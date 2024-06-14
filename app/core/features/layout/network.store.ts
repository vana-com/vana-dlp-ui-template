import { config } from "@/app/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Network = "test" | "moksha" | "satori" | "mainnet";

type NetworkState = {
  network: Network;
  setNetwork: (network: Network) => void;

  contract: string;
  setContract: (contract: string) => void;

  publicKeyBase64: string;
  setPublicKeyBase64: (publicKeyBase64: string) => void;
};

const defaultContractAddresses = {
  // TODO: test should be deprecated
  test: config.smartContractAddressSatoriTestnet,
  satori: config.smartContractAddressSatoriTestnet,
  moksha: config.smartContractAddressMokshaTestnet,
  mainnet: config.smartContractAddressSepolia,
};

const defaultPublicKeyMap = {
  test: config.publicKeyBase64,
  satori: config.publicKeyBase64,
  moksha: config.publicKeyBase64,
  mainnet: config.publicKeyBase64,
};

if (!Object.keys(defaultContractAddresses).includes(config.network)) {
  throw new Error(`Invalid network type: ${config.network}`);
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      network: config.network as Network,
      setNetwork: (network) =>
        set({
          network,
          contract: defaultContractAddresses[network],
          publicKeyBase64: defaultPublicKeyMap[network],
        }),

      contract: defaultContractAddresses[config.network as Network],
      setContract: (contract) => set({ contract }),

      publicKeyBase64: defaultPublicKeyMap[config.network as Network],
      setPublicKeyBase64: (publicKeyBase64) => set({ publicKeyBase64 }),
    }),
    {
      name: "network-storage",
    }
  )
);
