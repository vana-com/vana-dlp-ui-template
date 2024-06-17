import { config } from "@/app/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Network = "testnet" | "mainnet";

type NetworkState = {
  contract: string;
  setContract: (contract: string) => void;

  publicKeyBase64: string;
  setPublicKeyBase64: (publicKey: string) => void;

  network: Network | null;
  setNetwork: (network: Network | null) => void;
};

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      contract: ["test", "satori"].includes(config.network)
        ? config.smartContractAddressVanaTestnet
        : config.smartContractAddressSepolia,
      setContract: (contract) => set({ contract }),

      publicKeyBase64: ["test", "satori"].includes(config.network)
        ? config.publicKeyBase64
        : config.publicKeyBase64, // TODO
      setPublicKeyBase64: (publicKeyBase64) => set({ publicKeyBase64 }),

      network: config.network === "test" ? "testnet" : "mainnet",
      setNetwork: (network) => set({ network }),
    }),
    {
      name: "network-storage",
    }
  )
);
