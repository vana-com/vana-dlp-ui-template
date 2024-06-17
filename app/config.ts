const networks = {
  moksha: {
    chainId: "14800",
    rpcUrl: "https://rpc.moksha.vana.com",
    chainName: "Vana Moksha Testnet",
    explorerUrl: "https://moksha.vanascan.io",
    currency: "DAT",
    contract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_MOKSHA_TESTNET || "xyz",
  },
  satori: {
    chainId: "14801",
    rpcUrl: "https://rpc.satori.vana.com",
    chainName: "Vana Satori Testnet",
    explorerUrl: "https://satori.vanascan.io",
    currency: "DAT",
    contract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_SATORI_TESTNET || "123",
  },
  mainnet: {
    chainId: "1480",
    rpcUrl: "https://rpc.vana.com",
    chainName: "Vana Mainnet",
    explorerUrl: "https://vanascan.io",
    currency: "DAT",
    contract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_MAINNET || "zzz",
  },
}

// const network = process.env.NEXT_PUBLIC_NETWORK || "satori";
const network = "satori";

if (!Object.keys(networks).includes(network)) {
  throw new Error(`Invalid network type: ${network}`);
}

let networkConfig = networks[network];
if (!networkConfig) {
  networkConfig = {} as any;
  networks[network] = networkConfig;
}

networkConfig.contract = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS || networkConfig.contract;
networkConfig.rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || networkConfig.rpcUrl;
networkConfig.chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || networkConfig.chainName;
networkConfig.explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || networkConfig.explorerUrl;
networkConfig.currency = process.env.NEXT_PUBLIC_CURRENCY || networkConfig.currency;

const config = {
  dropboxCallbackUrl: process.env.NEXT_PUBLIC_DROPBOX_CALLBACK_URL || "",
  dropboxClientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || "",
  dropboxFolderName: "data-dao",
  googleDriveFolderName: "data-dao",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID || "",

  publicKeyBase64:
    process.env.NEXT_PUBLIC_FILE_ENCRYPTION_PUBLIC_KEY_BASE64 || "ahahah",

  network,
};

export { config, networks };
