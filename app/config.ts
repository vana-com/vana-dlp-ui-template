const networks = {
  moksha: {
    chainId: "14800",
    rpcUrl: "https://rpc.moksha.vana.org",
    chainName: "Vana Moksha Testnet",
    explorerUrl: "https://moksha.vanascan.io",
    currency: "VANA",
    contract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_MOKSHA_TESTNET || "moksha",
    dataRegistryContract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_DATA_REGISTRY_MOKSHA_TESTNET || "data_registry",
    teePoolContract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_TEE_POOL_MOKSHA_TESTNET || "tee_pool",
  },
  satori: {
    chainId: "14801",
    rpcUrl: "https://rpc.satori.vana.org",
    chainName: "Vana Satori Testnet",
    explorerUrl: "https://satori.vanascan.io",
    currency: "VANA",
    contract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_SATORI_TESTNET || "satori",
    dataRegistryContract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_DATA_REGISTRY || "0xDAAD102189FE8D0FE43c1926b109E94D06bD8a97",
    teePoolContract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_TEE_POOL || "0x88790ffF10E952ffc13Be22a442616eAfE081594",
  },
  mainnet: {
    chainId: "1480",
    rpcUrl: "https://rpc.vana.org",
    chainName: "Vana Mainnet",
    explorerUrl: "https://vanascan.io",
    currency: "VANA",
    contract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_MAINNET || "",
    dataRegistryContract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_DATA_REGISTRY_MAINNET || "",
    teePoolContract: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_TEE_POOL_MAINNET || "",
  },
}

const network = (process.env.NEXT_PUBLIC_NETWORK || "satori") as keyof typeof networks;

if (!Object.keys(networks).includes(network)) {
  throw new Error(`Invalid network type: ${network}`);
}

let networkConfig = networks[network];
if (!networkConfig) {
  networkConfig = {} as any;
  networks[network] = networkConfig;
}

networkConfig.contract = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS || networkConfig.contract;
networkConfig.dataRegistryContract = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_DATA_REGISTRY || networkConfig.dataRegistryContract;
networkConfig.teePoolContract = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_TEE_POOL || networkConfig.teePoolContract;
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

  publicKeyBase64: process.env.NEXT_PUBLIC_FILE_ENCRYPTION_PUBLIC_KEY_BASE64 || "",

  network,
};

export { config, networks };
