import { config } from "@/app/config";

export const uploadFileToGoogleDrive = async (
  file: Blob,
  fileName: string,
  token: string
) => {
  const folderId = await findOrCreateFolder(
    token,
    config.googleDriveFolderName
  );
  const url =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  // Construct metadata
  const metadata = {
    name: `encrypted_${fileName}`,
    parents: [folderId],
  };

  // Create the multipart body
  let formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set 'Content-Type' here as FormData will append the boundary parameter to 'multipart/form-data'
      },
      body: formData,
    });

    if (!response.ok)
      throw new Error(
        `Google Drive API returned error ${
          response.status
        }: ${await response.text()}`
      );

    const fileDetails = await response.json();

    return await fetchFileDetails(token, fileDetails.id);
  } catch (error) {
    console.error("Failed to upload file to Google Drive:", error);
    throw error;
  }
};

const fetchFileDetails = async (token: string, fileId: string) => {
  const detailsUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,md5Checksum,modifiedTime`;

  const response = await fetch(detailsUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch file details: ${
        response.status
      } ${await response.text()}`
    );
  }

  return await response.json();
};

export const getGoogleDriveShareLink = async (
  token: string,
  fileId: string
) => {
  try {
    // Update permissions
    await updateFilePermissions(token, fileId);

    // Get the shareable link
    return createSharableLink(token, fileId);
  } catch (error) {
    console.error("Error creating shareable link:", error);
    throw error;
  }
};

const findOrCreateFolder = async (token: string, folderName: string) => {
  const url = `https://www.googleapis.com/drive/v3/files`;
  const params = new URLSearchParams({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    pageSize: "1",
  });

  const searchResponse = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await searchResponse.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id; // Return the first found folder's ID
  } else {
    // Folder not found, create it
    const metadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };
    const createResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    const folderData = await createResponse.json();
    return folderData.id; // Return the newly created folder's ID
  }
};

const createSharableLink = async (token: string, fileId: string) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

const updateFilePermissions = async (token: string, fileId: string) => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;

  const body = JSON.stringify({
    role: "reader", // or 'writer' depending on the access you want to provide
    type: "anyone", // 'anyone' who has the link can view the file
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error(`Failed to update permissions: ${await response.text()}`);
  }

  return await response.json(); // Returns permission details
};
