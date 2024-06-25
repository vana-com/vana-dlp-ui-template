import { Group, Stack, Text } from "@mantine/core";
import Script from "next/script";
import { DropboxButton } from "./dropbox-button";
import { GoogleDriveButton } from "./google-drive-button";

export const ConnectStep = () => {
  return (
    <Stack>
      <Script src="https://apis.google.com/js/api.js" />
      <Text>
        Connect your cloud storage account, where your encrypted hotdog photo will be stored.
      </Text>
      <Text>
        This gives you full control, as you can delete your data at any point.
      </Text>
      <Group>
        <DropboxButton />
        <GoogleDriveButton />
      </Group>
    </Stack>
  );
};
