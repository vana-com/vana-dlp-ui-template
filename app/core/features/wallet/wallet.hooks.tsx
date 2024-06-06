import { connectMetamask } from "./wallet.service";
import { useWalletStore } from "./wallet.store";

export const useConnectWallet = () => {
  const setWalletAddress = useWalletStore((state) => state.setWalletAddress);

  const connect = async () => {
    const metamaskConnection = await connectMetamask();

    if (!metamaskConnection || "error" in metamaskConnection) {
      console.error("Error connecting to Metamask");
      return;
    }

    const { address } = metamaskConnection;

    setWalletAddress(address);
  };

  const disconnect = async () => {
    setWalletAddress(null);
  };

  return { connect, disconnect };
};
