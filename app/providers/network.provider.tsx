"use client";

import { useEffect } from "react";
import { requestNetworkSwitch, useNetworkStore } from "../core";

export const NetworkProvider = () => {
  const chainId = useNetworkStore((state) => state.chainId);
  const rpcUrl = useNetworkStore((state) => state.rpcUrl);
  const chainName = useNetworkStore((state) => state.chainName);
  const explorerUrl = useNetworkStore((state) => state.explorerUrl);
  const currency = useNetworkStore((state) => state.currency);

  useEffect(() => {
    requestNetworkSwitch({
      chainId,
      rpcUrl,
      chainName,
      explorerUrl,
      currency,
    });
  }, [chainId, rpcUrl, chainName, explorerUrl, currency]);

  return <></>;
};
