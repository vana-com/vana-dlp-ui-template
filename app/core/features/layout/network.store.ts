import { config, networks } from "@/app/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Network = "moksha" | "satori" | "mainnet";

type NetworkState = {
  network: Network;
  setNetwork: (network: Network) => void;

  contract: string;
  setContract: (contract: string) => void;

  publicKeyBase64: string;
  setPublicKeyBase64: (publicKeyBase64: string) => void;

  chainId: string;
  rpcUrl: string;
  chainName: string;
  explorerUrl: string;
  currency: string;
};

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      network: config.network as Network,
      setNetwork: (network: Network) => {
        console.log({
          network,
          ...networks[network],
          publicKeyBase64: config.publicKeyBase64,
        })
        set({
          network,
          ...networks[network],
          publicKeyBase64: config.publicKeyBase64,
        });
      },

      contract: networks[config.network].contract,
      setContract: (contract) => set({ contract }),

      publicKeyBase64: config.publicKeyBase64,
      setPublicKeyBase64: (publicKeyBase64) => set({ publicKeyBase64 }),

      chainId: networks[config.network].chainId,
      rpcUrl: networks[config.network].rpcUrl,
      chainName: networks[config.network].chainName,
      explorerUrl: networks[config.network].explorerUrl,
      currency: networks[config.network].currency,
    }),
    {
      name: "network-storage",
      // We could include only specific fields to be persisted if necessary
      // partialize: state => ({
      //   network: state.network,
      //   contract: state.contract,
      //   publicKeyBase64: state.publicKeyBase64,
      //   chainId: state.chainId,
      //   rpcUrl: state.rpcUrl,
      //   chainName: state.chainName,
      //   explorerUrl: state.explorerUrl,
      //   currency: state.currency,
      // })
    }
  )
);
