const networks = {
  moksha: {
    chainId: "14800",
    rpcUrl: "https://rpc.moksha.vana.org",
    chainName: "Vana Moksha Testnet",
    explorerUrl: "https://moksha.vanascan.io",
    currency: "VANA",
  },
  satori: {
    chainId: "14801",
    rpcUrl: "https://rpc.satori.vana.org",
    chainName: "Vana Satori Testnet",
    explorerUrl: "https://satori.vanascan.io",
    currency: "VANA",
  },
  mainnet: {
    chainId: "1480",
    rpcUrl: "https://rpc.vana.org",
    chainName: "Vana Mainnet",
    explorerUrl: "https://vanascan.io",
    currency: "VANA",
  },
}

const network = (process.env.NEXT_PUBLIC_NETWORK || "moksha") as keyof typeof networks;

if (!Object.keys(networks).includes(network)) {
  throw new Error(`Invalid network type: ${network}`);
}

let networkConfig = networks[network];
if (!networkConfig) {
  networkConfig = {} as any;
  networks[network] = networkConfig;
}

const config = {
  dropboxCallbackUrl: process.env.NEXT_PUBLIC_DROPBOX_CALLBACK_URL || "",
  dropboxClientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || "",
  dropboxFolderName: "data-dao",
  googleDriveFolderName: "data-dao",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID || "",
  publicKeyBase64: process.env.NEXT_PUBLIC_FILE_ENCRYPTION_PUBLIC_KEY_BASE64 || "",
  network,
  networkConfig,
  smartContracts: {
  dlp: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_DLP || "0x88006Bc06d3B703a3F50ACe4DEFC587549085940",
    dataRegistry: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_DATA_REGISTRY || "0xEA882bb75C54DE9A08bC46b46c396727B4BFe9a5",
    teePool: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_TEE_POOL || "0xF084Ca24B4E29Aa843898e0B12c465fAFD089965",
  }
};

export { config, networks };
