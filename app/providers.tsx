"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { theme } from "./core/theme/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config";
import { NetworkProvider } from "./providers/network.provider";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <NetworkProvider />
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}

export default Providers;
