import { BrowserProvider, JsonRpcSigner } from "ethers";
import { v4 } from "uuid";

declare global {
  interface Window {
    ethereum: any;
  }
}

const connect = async (signer: JsonRpcSigner) => {
  const address = await signer.getAddress();

  const nonce = v4();
  const signature = await signer.signMessage(nonce);
  return { address, signature, nonce };
};

export const connectMetamask = async () => {
  if (!window.ethereum) {
    console.error("Please install MetaMask");
    return { error: "MetaMask not found" };
  }

  const provider = new BrowserProvider(window.ethereum);

  try {
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const { address } = await connect(signer);

    return { address };
  } catch (error: any) {
    console.error("Error connecting to MetaMask:", error);
    return { error: error.message };
  }
};

export const signMessage = async (
  address: string,
  message: string
): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(address);
  const signature = await signer.signMessage(message);
  return signature;
};

export const requestNetworkSwitch = async ({
  chainId,
  rpcUrl,
  chainName,
  explorerUrl,
  currency,
}: {
  chainId: string | number;
  rpcUrl: string;
  chainName: string;
  currency: string;
  explorerUrl?: string;
}) => {
  const hexChainId = "0x" + Number(chainId).toString(16);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChainId,
              rpcUrls: [rpcUrl],
              chainName: chainName,
              nativeCurrency: {
                name: currency,
                symbol: currency,
                decimals: 18,
              },
              blockExplorerUrls: explorerUrl ? [explorerUrl] : [],
            },
          ],
        });
      } catch (error) {
        console.log("Error switching the network", error); // * TODO : Handle error
        return { error };
      }
    }
  }
};
