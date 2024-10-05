import { getDropboxShareLink, uploadFileToDropbox } from "./dropbox.service";
import {
  getGoogleDriveShareLink,
  uploadFileToGoogleDrive,
} from "./google-drive.service";

export type StorageProvider = "google-drive" | "dropbox";

export type FileMetadata = {
  id: string;
  name: string;
  size: number;
  modifiedTime?: string;
  fileId?: number;
};

export const uploadFile = async (
  file: Blob,
  fileName: string,
  token: string,
  provider: StorageProvider
): Promise<FileMetadata> => {
  switch (provider) {
    case "google-drive": {
      const metadata = await uploadFileToGoogleDrive(file, fileName, token);
      console.log("Modified Time", metadata.modifiedTime);

      return {
        id: metadata.id,
        name: metadata.name,
        size: file.size,
        modifiedTime: metadata.modifiedTime,
      };
    }
    case "dropbox": {
      const metadata = await uploadFileToDropbox(file, fileName, token);

      return {
        id: metadata.path_lower as string,
        name: metadata.name,
        size: file.size,
      };
    }
    default:
      throw new Error(`Unknown storage provider: ${provider}`);
  }
};

export const getEncryptedDataUrl = (
  token: string,
  id: string,
  provider: StorageProvider
) => {
  switch (provider) {
    case "google-drive":
      return getGoogleDriveShareLink(token, id);
    case "dropbox":
      return getDropboxShareLink(token, id);
    default:
      throw new Error(`Unknown storage provider: ${provider}`);
  }
};
