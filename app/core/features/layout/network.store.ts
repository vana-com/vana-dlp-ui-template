import { config, networks } from "@/app/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Network = keyof typeof networks | string;

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

const defaultNetworkConfig = networks[config.network as keyof typeof networks];
export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => {
      return {
        network: config.network as Network,
        setNetwork: (network: Network) => {
          const networkConfig = networks[network as keyof typeof networks];
          set({
            network,
            ...networkConfig,
            publicKeyBase64: config.publicKeyBase64,
          });
        },

        contract: defaultNetworkConfig.contract,
        setContract: (contract) => set({ contract }),

        publicKeyBase64: config.publicKeyBase64,
        setPublicKeyBase64: (publicKeyBase64) => set({ publicKeyBase64 }),

        chainId: defaultNetworkConfig.chainId,
        rpcUrl: defaultNetworkConfig.rpcUrl,
        chainName: defaultNetworkConfig.chainName,
        explorerUrl: defaultNetworkConfig.explorerUrl,
        currency: defaultNetworkConfig.currency,
      };
    },
    {
      name: "network-storage",
      onRehydrateStorage: (state) => {
        console.log(state.contract);
        if (!state.contract) {
          state.setContract(defaultNetworkConfig.contract);
        }

        // return state;
      },
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
