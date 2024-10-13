import { Group, Stack, Text } from "@mantine/core";
import Script from "next/script";
import { DropboxButton } from "./dropbox-button";
import { GoogleDriveButton } from "./google-drive-button";

export const ConnectStep = () => {
  return (
    <Stack>
      <Script src="https://apis.google.com/js/api.js" />
      <Text>
        In order to upload your file, you need to connect your cloud storage
        account.
      </Text>
      <Text>
        We will never store your files. They will be encrypted and stored in
        your storage account.
      </Text>
      <Group>
        <DropboxButton />
        <GoogleDriveButton />
      </Group>
    </Stack>
  );
};
