"use client";

import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useStorageStore } from "../core";

export default function Page() {
  const params = useParams();
  const setToken = useStorageStore((state) => state.setToken);
  const setProvider = useStorageStore((state) => state.setProvider);
  const setExpiresAt = useStorageStore((state) => state.setExpiresAt);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    // The length of time in seconds that the access token will be valid for.
    const expiresIn = hashParams.get("expires_in");

    if (expiresIn) {
      setExpiresAt(Date.now() + parseInt(expiresIn) * 1000);
    }

    if (accessToken) {
      setToken(accessToken);
      setProvider('dropbox');
      window.close();
    }
  }, [params]);

  return (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
      loaderProps={{ color: "brand-3", type: "bars" }}
      color="brand-3"
    />
  );
}
