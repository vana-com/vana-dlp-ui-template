import { useStorageStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { Button, Group } from "@mantine/core";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export const GoogleDriveButton = () => {
  const [loading, setLoading] = useState(false);

  const setToken = useStorageStore((state) => state.setToken);
  const setProvider = useStorageStore((state) => state.setProvider);
  const setExpiresAt = useStorageStore((state) => state.setExpiresAt);

  const handleSuccess = (
    response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
  ) => {
    setToken(response.access_token);
    setProvider("google-drive");
    setExpiresAt(Date.now() + response.expires_in * 1000);
  };

  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
    onSuccess: handleSuccess,
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleLogin = () => {
    setLoading(true);

    login();
  };

  return (
    <Button
      color="#21a363"
      onClick={handleLogin}
      loading={loading}
      variant="outline"
    >
      <Group gap="xs">
        <Icon icon="mdi:google-drive" />
        Connect Google Drive
      </Group>
    </Button>
  );
};
