const config = {
  publicKeyBase64:
    process.env.NEXT_PUBLIC_FILE_ENCRYPTION_PUBLIC_KEY_BASE64 || "",

  dropboxCallbackUrl: process.env.NEXT_PUBLIC_DROPBOX_CALLBACK_URL || "",
  dropboxClientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || "",
  dropboxFolderName: "data-dao",
  googleDriveFolderName: "data-dao",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID || "",
  network: process.env.NEXT_PUBLIC_NETWORK || "test",
  smartContractAddressVanaTestnet:
    process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_VANA_TESTNET || "",
  smartContractAddressSepolia:
    process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS_SEPOLIA || "",
};

export { config };
