import { config } from "@/app/config";
import * as Dropbox from "dropbox";

export const getDropboxAuthUrl = async () => {
  const dbx = new Dropbox.DropboxAuth({ clientId: config.dropboxClientId });
  const authUrl = await dbx.getAuthenticationUrl(config.dropboxCallbackUrl);

  return authUrl.toString();
};

export const uploadFileToDropbox = async (
  file: Blob,
  fileName: string,
  token: string
) => {
  const dbx = new Dropbox.Dropbox({ accessToken: token });
  const response = await dbx.filesUpload({
    contents: file,
    path: `/${config.dropboxFolderName}/encrypted_${fileName}`,
    mode: {
      ".tag": "add",
    },
    autorename: true,
    mute: false,
  });

  const shareLink = await getDropboxShareLink(
    token,
    response.result.path_lower as string
  );
  // TODO: This is wrong, try to get the ETag from the header of response to the share link or /2/sharing/get_shared_link_metadata
  // const etag = await getEtag(shareLink);
  const etag = null;

  return { ...response.result, etag };
};

export const getDropboxShareLink = async (token: string, path: string) => {
  const dbx = new Dropbox.Dropbox({ accessToken: token });
  const response = await dbx.sharingListSharedLinks({
    path,
    direct_only: true,
  });

  let shareableLink = response.result.links.find(
    (link) => link.path_lower === path.toLowerCase()
  )?.url;

  // If a link already exists, use it, otherwise create a new one
  if (!shareableLink) {
    const createLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path,
      settings: {
        allow_download: true,
      },
    });
    shareableLink = createLinkResponse.result.url;
  }

  // Replace 'dl=0' with 'dl=1' to force download
  shareableLink = shareableLink.replace("dl=0", "dl=1");

  return shareableLink;
};

const getEtag = async (shareLink: string) => {
  // Use the link to fetch the ETag via an HTTP HEAD request
  const res = await fetch(
    `/api/storage/dropbox/etag?url=${encodeURIComponent(shareLink)}`
  );
  const data = await res.json();
  if (data.etag) {
    console.log("ETag:", data.etag);
  } else {
    console.error("Error:", data.error);
  }
  return data.etag;
};
