import { config } from "@/app/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Network = "testnet" | "mainnet";

type NetworkState = {
  contract: string;
  setContract: (contract: string) => void;

  network: Network | null;
  setNetwork: (network: Network | null) => void;
};

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      contract:
        config.network === "test"
          ? config.smartContractAddressVanaTestnet
          : config.smartContractAddressSepolia,
      setContract: (contract) => set({ contract }),

      network: config.network === "test" ? "testnet" : "mainnet",
      setNetwork: (network) => set({ network }),
    }),
    {
      name: "network-storage",
    }
  )
);
