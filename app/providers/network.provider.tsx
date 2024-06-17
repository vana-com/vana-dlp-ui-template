"use client";

import { useEffect } from "react";
import { requestNetworkSwitch } from "../core";
import { config } from "../config";

export const NetworkProvider = () => {
  useEffect(() => {
    requestNetworkSwitch({
      chainId: config.chainId,
      rpcUrl: config.rpcUrl,
      chainName: config.chainName,
      explorerUrl: config.explorerUrl,
      currency: config.currency,
    });
  }, []);

  return <></>;
};
