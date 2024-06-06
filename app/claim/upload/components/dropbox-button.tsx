import { getDropboxAuthUrl, useStorageStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { Button, Group } from "@mantine/core";
import { useState } from "react";

export const DropboxButton = () => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    const authUrl = await getDropboxAuthUrl();

    setLoading(true);

    const popup = window.open(
      authUrl,
      "_blank",
      "popup=true, width=600, height=600"
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        useStorageStore.persist.rehydrate();
        setLoading(false);

        clearInterval(interval);
        return;
      }
    }, 1000);
  };

  return (
    <Button
      color="#0061FE"
      onClick={handleConnect}
      loading={loading}
      variant="outline"
    >
      <Group gap="xs">
        <Icon icon="mdi:dropbox" />
        Connect Dropbox
      </Group>
    </Button>
  );
};
