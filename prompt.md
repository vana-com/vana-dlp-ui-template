Please help me make attached nextjs app production ready. Specifically:

- Let's modify `app/page.tsx` and make sure code is well organized and looks professional. Let's break it down into smaller functions and add comments.
- We need to make sure that changes that we are making will not break functionality of the app, so be careful with changes.
- Please respond with a full updated code, try to maintain order to make diff review easier.

```
vana-dlp-ui-tee-template
├── app
│   ├── about
│   │   └── page.tsx
│   ├── api
│   │   └── storage
│   │       └── dropbox
│   │           └── etag
│   │               └── route.ts
│   ├── auth
│   │   ├── dropbox
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── claim
│   │   ├── components
│   │   │   └── disclaimer.tsx
│   │   ├── success
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── layout
│   │   │   ├── layout.tsx
│   │   │   └── settings-button.tsx
│   │   └── index.tsx
│   ├── contracts
│   │   ├── DataLiquidityPoolLightImplementation.json
│   │   ├── DataRegistryImplementation.json
│   │   └── TeePoolImplementation.json
│   ├── core
│   │   ├── features
│   │   │   ├── integrations
│   │   │   │   ├── dropbox.service.ts
│   │   │   │   ├── google-drive.service.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── storage.service.tsx
│   │   │   │   └── storage.store.tsx
│   │   │   ├── layout
│   │   │   │   ├── index.tsx
│   │   │   │   └── network.store.ts
│   │   │   ├── wallet
│   │   │   │   ├── index.tsx
│   │   │   │   ├── wallet.hooks.tsx
│   │   │   │   ├── wallet.service.tsx
│   │   │   │   └── wallet.store.tsx
│   │   │   └── index.tsx
│   │   ├── theme
│   │   │   ├── index.ts
│   │   │   ├── theme.d.ts
│   │   │   └── theme.tsx
│   │   ├── check.txt
│   │   └── index.tsx
│   ├── home
│   │   └── components
│   │       ├── connect.tsx
│   │       ├── disclaimer.tsx
│   │       ├── dropbox-button.tsx
│   │       ├── google-drive-button.tsx
│   │       ├── share-file.tsx
│   │       ├── success.tsx
│   │       ├── upload.tsx
│   │       ├── uploaded.tsx
│   │       └── uploading.tsx
│   ├── hooks
│   │   └── useFileStatus.ts
│   ├── providers
│   │   └── network.provider.tsx
│   ├── terms
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── utils
│   │   ├── formatters
│   │   │   └── bytes.ts
│   │   └── crypto.ts
│   ├── config.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── public
│   └── images
├── README.md
├── decrypt.py
├── decrypt_key.py
├── keys.md
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

--- README.md ---
# Vana DLP UI
This is a generic UI for uploading data to a Data Liquidity Pool (DLP). This app does the following:
1. Connect your EVM compatible wallet, which holds some $VANA
2. On the upload page, log in to your Google Drive or Dropbox
3. Drag your data in, which is encrypted client-side and stored in your personal storage
4. A transaction is written on-chain, which the DLP validators will pick up on and verify your file

## Getting Started
```bash
# First, install the dependencies
yarn install

# Copy .env.example to .env
cp .env.example .env

# Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

## Client-side encryption

The Vana network strives to ensure personal data remains private, and is only shared with trusted parties. You can read more about how a DLP uses client-side encryption to protect user data [here](https://docs.vana.org/vana/core-concepts/key-elements/proof-of-contribution/data-privacy).

## Learn more
You can find out more about building a data liquidity pool with Vana [here](https://docs.vana.org/vana/get-started/data-liquidity-layer/create-a-data-liquidity-pool-dlp#dlp-upload-ui).

--- decrypt_key.py ---
# Decrypt an encrypted key using a private key
import hashlib
import hmac
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import binascii


def decrypt_with_private_key(encrypted_data: str, private_key: str) -> str:
# Remove '0x' prefix if present
private_key = private_key[2:] if private_key.startswith("0x") else private_key
encrypted_data = encrypted_data[2:] if encrypted_data.startswith("0x") else encrypted_data

    # Convert hex strings to bytes
    private_key_bytes = binascii.unhexlify(private_key)
    encrypted_data_bytes = binascii.unhexlify(encrypted_data)

    # Parse the encrypted data
    iv = encrypted_data_bytes[:16]
    ephemPublicKey = encrypted_data_bytes[16:81]
    ciphertext = encrypted_data_bytes[81:-32]
    mac = encrypted_data_bytes[-32:]

    # Load the private key
    private_key = ec.derive_private_key(
        int.from_bytes(private_key_bytes, byteorder='big'),
        ec.SECP256K1(),
        default_backend()
    )

    # Load the ephemeral public key
    ephemeral_public_key = ec.EllipticCurvePublicKey.from_encoded_point(
        ec.SECP256K1(),
        ephemPublicKey
    )

    # Perform ECDH to get the shared secret
    shared_key = private_key.exchange(ec.ECDH(), ephemeral_public_key)

    # Derive encryption and MAC keys
    hash_key = hashlib.sha512(shared_key).digest()
    enc_key = hash_key[:32]
    mac_key = hash_key[32:]

    # Verify MAC
    dataToMac = iv + ephemPublicKey + ciphertext
    calculated_mac = hmac.new(mac_key, dataToMac, hashlib.sha256).digest()
    if not hmac.compare_digest(calculated_mac, mac):
        raise ValueError("Invalid MAC")

    # Decrypt
    cipher = Cipher(algorithms.AES(enc_key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(ciphertext) + decryptor.finalize()

    # Remove PKCS7 padding
    padding_length = decrypted[-1]
    decrypted = decrypted[:-padding_length]

    return decrypted.decode('utf-8')


# Example usage
encrypted_data = "d22c0ec2139e0e5b30af989cf320ec7f0455732bd1776f8249992d00b21ae0c12724448cff74e6b9ab7f92179d25ccb302f74224724921a1b37540d15200a24f72ac6da53ea677a6a4d5a3bb434cce1558332eb0fdfefed99d7e7129fca8f96ea59b5ab75f51d8d2d9fafa3e6aa3e700b1caea99e9d9b4e11ec778ce07fd77b8fd5e383654c68eab8a5dec665ab4616c3f07178291c1893d3ca24628921384ada76c6bff3705f24c40651587db3ee3eb777b164666a49aee656cbf6c0ae25c5426447c7d61db305c75b56e38e6aab154e5c99ec97955b2cf002963ca67dee70b43183655d12d201f1f48292c03eda22178d0d6cf6ed1dccd7586088e07493f257f"
private_key = "enter_your_private_key"

try:
decrypted_text = decrypt_with_private_key(encrypted_data, private_key)
print("Decrypted text:", decrypted_text)
except Exception as e:
print("Decryption failed:", str(e))

--- keys.md ---
# Notes on managing keys and encryption

## Generating a key pair

This is used by the client-side encryption function to encrypt files and by DLP validators to decrypt files encrypted by the client-side encryption function.

```shell
gpg --full-generate-key
```

This will prompt you to select the type of key you want to generate.
- Select `RSA and RSA` (option 1) and then select the key size you want to generate.
- Recommended key size is `3072` bits.
- After that, you will be prompted to enter your name and email address.
- You can leave the comment field empty.
- After that, you will be prompted to enter a passphrase to protect your private key.
- After that, GPG will generate a lot of random bytes to generate the key pair.


## Backup key to file
```shell
gpg --armor --export-secret-keys your-email@example.com > my-private-key.asc
```

Use the following command to list the keys you have generated with details:

```shell
gpg --list-keys --keyid-format LONG
```

This will display a list of all the keys you have along with details such as the key IDs, creation dates, and associated emails.
Look for the key you created most recently.

- Identify the Key ID
  From the output, identify the key ID of the latest key. The key ID is usually displayed next to the 'pub' keyword. It will look something like this: rsa4096/1234ABCD1234ABCD 2023-01-01 [SC].

- Export the Specific Key
  Once you have identified the correct key ID, you can export just that key by replacing your-email@example.com with the key ID in the export command. For example:

```bash
gpg --armor --export 1234ABCD1234ABCD > publickey.asc
```

## Convert the keys to base64

```shell
base64 -i publickey.asc -o publickey_base64.asc 
base64 -i privatekey.asc -o privatekey_base64.asc  
```

## Decrypting a file

```shell
gpg --output decrypted_image.png --decrypt encrypted_image.png
```

## Import a key

Used to import a symmetric key generated by the client-side encryption function in the UI.

```shell
gpg --import decrypted_symmetric_key.asc
```

--- next.config.js ---
module.exports = {
async redirects() {
return [];
},
};

--- package.json ---
{
"name": "datadao-demo",
"version": "0.1.0",
"private": true,
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
},
"dependencies": {
"@mantine/carousel": "^7.9.1",
"@mantine/core": "^7.9.0",
"@mantine/dropzone": "^7.10.1",
"@mantine/form": "^7.9.0",
"@mantine/hooks": "^7.9.0",
"@mantine/notifications": "^7.9.0",
"@react-oauth/google": "^0.12.1",
"@types/eccrypto": "^1.1.6",
"clsx": "^2.1.1",
"dropbox": "^10.34.0",
"eccrypto": "^1.1.6",
"embla-carousel-autoplay": "^7.1.0",
"embla-carousel-react": "^7.1.0",
"ethers": "^6.12.1",
"next": "14.2.3",
"openpgp": "^5.11.2",
"react": "^18",
"react-dom": "^18",
"uuid": "^9.0.1",
"zustand": "^4.5.2"
},
"devDependencies": {
"@iconify/react": "^4.1.1",
"@types/node": "^20",
"@types/react": "^18",
"@types/react-dom": "^18",
"@types/uuid": "^9.0.8",
"eslint": "^8",
"eslint-config-next": "14.2.3",
"postcss": "^8",
"tailwindcss": "^3.4.1",
"typescript": "^5"
}
}

--- tailwind.config.ts ---
import type { Config } from "tailwindcss";

const config: Config = {
content: [
"./pages/**/*.{js,ts,jsx,tsx,mdx}",
"./components/**/*.{js,ts,jsx,tsx,mdx}",
"./app/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
extend: {
backgroundImage: {
"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
"gradient-conic":
"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
},
},
},
plugins: [],
};
export default config;

--- tsconfig.json ---
{
"compilerOptions": {
"lib": ["dom", "dom.iterable", "esnext"],
"allowJs": true,
"skipLibCheck": true,
"strict": true,
"noEmit": true,
"esModuleInterop": true,
"module": "esnext",
"moduleResolution": "bundler",
"resolveJsonModule": true,
"isolatedModules": true,
"jsx": "preserve",
"incremental": true,
"plugins": [
{
"name": "next"
}
],
"paths": {
"@/*": ["./*"]
}
},
"include": [
"next-env.d.ts",
"app/core/theme",
"**/*.d.ts",
"**/*.ts",
"**/*.tsx",
".next/types/**/*.ts",
],
"exclude": ["node_modules"]
}

--- app/config.ts ---
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

--- app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
--foreground-rgb: 0, 0, 0;
--background-start-rgb: 255, 255, 255;
--background-end-rgb: 255, 255, 255;
}

body {
color: rgb(var(--foreground-rgb));
background: linear-gradient(
to bottom,
transparent,
rgb(var(--background-end-rgb))
)
rgb(var(--background-start-rgb));
}

@layer utilities {
.text-balance {
text-wrap: balance;
}
}

--- app/layout.tsx ---
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dropzone/styles.css';

import type { Metadata } from "next";
import { Layout } from "./components";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
title: "YOUR DATA DAO",
description:
"Join with your data and receive governance rights. Vote to sell the data to AI companies, or vote to delete it if the data provider open sources their models.",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en">
<body suppressHydrationWarning={true}>
<Providers>
<Layout>{children}</Layout>
</Providers>
</body>
</html>
);
}

--- app/page.tsx ---
"use client";

import {
FileMetadata,
getEncryptedDataUrl,
signMessage,
uploadFile,
useConnectWallet,
useNetworkStore,
useStorageStore,
useWalletStore,
} from "@/app/core";
import { clientSideEncrypt } from "@/app/utils/crypto";
import {
Box,
Container,
Dialog,
Grid,
Image,
Notification,
Paper,
Stack,
Text,
Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import DataLiquidityPool from "@/app/contracts/DataLiquidityPoolLightImplementation.json";
import TeePoolImplementation from "@/app/contracts/TeePoolImplementation.json";
import DataRegistryImplementation from "@/app/contracts/DataRegistryImplementation.json";
import { ConnectStep } from "./home/components/connect";
import { Success } from "./home/components/success";
import { UploadState } from "./home/components/upload";
// import { UploadedFileState } from "./home/components/uploaded";
import { UploadingState } from "./home/components/uploading";
import { config } from "@/app/config";
import { UploadedFileState } from "@/app/home/components/uploaded";
import * as eccrypto from "eccrypto";

const FIXED_MESSAGE = "Please sign to retrieve your encryption key";

export default function Page() {
const [statusLog, setStatusLog] = useState<string[]>(["Please select a file to start contribution process"]);
const [shareUrl, setShareUrl] = useState<string | null>(null);
const storageProvider = useStorageStore((state) => state.provider);

const contractAddress = config.smartContracts.dlp;
const dataRegistryContractAddress = config.smartContracts.dataRegistry;
const teePoolContractAddress = config.smartContracts.teePool;

const dropboxToken = useStorageStore((state) => state.token);
const publicKeyBase64 = useNetworkStore((state) => state.publicKeyBase64);
const isDropboxConnected = !!dropboxToken;

const [opened, { close }] = useDisclosure(false);

const [uploadState, setUploadState] = useState<
"initial" | "loading" | "done"
>("initial");
const [fileId, setFileId] = useState<number | null>(null);

const [uploadedFileMetadata, setUploadedFileMetadata] =
useState<FileMetadata | null>(null);

const walletAddress = useWalletStore((state) => state.walletAddress);
const { connect } = useConnectWallet();

const [file, setFile] = useState<File | null>(null);
const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);

const appendStatus = (newStatus: string) => {
setStatusLog(prevLog => [...prevLog, newStatus]);
};

/**
* Encrypts the given data using the provided master key (public key).
*
* @param data - The data to encrypt.
* @param masterKey - The hexadecimal public key for encryption.
* @returns The encrypted data as a hexadecimal string.
  */
  const encryptWithMasterKey = async (data: string, masterKey: string): Promise<string> => {
  // Convert the public key to bytes and remove the '0x' prefix if present
  const publicKeyBytes = Buffer.from(masterKey.startsWith("0x") ? masterKey.slice(2) : masterKey, "hex");

    // If the public key is not in the uncompressed format (starts with 0x04), add it
    const uncompressedKey = publicKeyBytes.length === 64 ? Buffer.concat([Buffer.from([4]), publicKeyBytes]) : publicKeyBytes;

    // Encrypt the data
    const encryptedBuffer = await eccrypto.encrypt(uncompressedKey, Buffer.from(data));

    // Combine the encrypted components into a single buffer and return as hex
    const encryptedHex = Buffer.concat([encryptedBuffer.iv, encryptedBuffer.ephemPublicKey, encryptedBuffer.ciphertext, encryptedBuffer.mac]).toString("hex");
    return encryptedHex;
};

const getTeeDetails = async (
teePoolContract: ethers.Contract,
jobId: number
) => {
try {
// TODO: Unresolved function or method jobs()
const job = await teePoolContract.jobs(jobId);
console.log("Job Details:", job);

      // Fetch the TEE info using the teeAddress
      // TODO: Unresolved function or method tees()
      const teeInfo = await teePoolContract.tees(job.teeAddress);
      console.log("TEE Info:", teeInfo);

      return { ...job, teeUrl: teeInfo.url };
    } catch (error) {
      console.error("Error fetching job details:", error);
      // TODO: Argument type {color: string, title: string, message: string} is not assignable to parameter type NotificationData
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to fetch job details. Please try again.",
      });
      throw error;
    }
};

const fileJobIds = async (
teePoolContract: ethers.Contract,
fileId: number
) => {
try {
// TODO: Unresolved function or method fileJobIds()
const jobIds = await teePoolContract.fileJobIds(fileId);
return jobIds.map(Number);
} catch (error) {
console.error("Error fetching file job IDs:", error);
throw error;
}
};

const teeJobIdsPaginated = async (
teePoolContract: ethers.Contract,
teeAddress: string,
start: number,
end: number
) => {
try {
// TODO: Unresolved function or method teeJobIdsPaginated()
const jobIds = await teePoolContract.teeJobIdsPaginated(teeAddress, start, end);
return jobIds.map(Number);
} catch (error) {
console.error("Error fetching paginated TEE job IDs:", error);
throw error;
}
};

// TODO: Argument type {color: string, title: string, message: string} is not assignable to parameter type NotificationData
const handleError = () => {
notifications.show({
color: "red",
title: "Error",
message:
"There was an error trying to encode your file. Please try again.",
});
};

const handleSetFile = async (file: File | null) => {
try {
if (!walletAddress) {
await connect();
}
} catch (error) {
setUploadState("initial");
handleError();
}

    setFile(file);
};

const handleFileUpload = async (file: File) => {
if (!walletAddress) {
setUploadState("initial");
handleError();
console.error("Wallet address not found");
return;
}

    try {
      setUploadState("loading");
      appendStatus(`Doing a client side file signing, asking user to sign the message to create a deterministic signature...`);
      // Sign a fixed message with the user's wallet to create a deterministic signature
      const signature = await signMessage(walletAddress, FIXED_MESSAGE);
      console.log("Signature:", signature);
      appendStatus(`Signature created: '${signature}'`);

      // Encrypt the file using the signature as the symmetric key
      const encryptedData = await clientSideEncrypt(file, signature);
      const encryptedFile = new Blob([encryptedData], {
        type: "application/octet-stream",
      });

      if (!dropboxToken || !storageProvider) {
        throw new Error("Token not found");
      }

      const uploadedFileMetadata = await uploadFile(
        encryptedFile,
        file.name,
        dropboxToken,
        storageProvider
      );

      // Get shareUrl to file in storage
      const encryptedDataUrl = await getEncryptedDataUrl(
        dropboxToken,
        uploadedFileMetadata.id,
        storageProvider
      );
      console.log("encryptedDataUrl:", encryptedDataUrl);

      setShareUrl(encryptedDataUrl);

      setUploadedFileMetadata(uploadedFileMetadata);

      setEncryptedFile(encryptedFile);

      setUploadState("done");
      appendStatus(`File uploaded to ${encryptedDataUrl}`);

      // Initialize contracts TODO: Move this to a separate function - file
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // DLP light contract
      const contractABI = [...DataLiquidityPool.abi];
      const dlpLightContract = new ethers.Contract(
        contractAddress as string,
        contractABI,
        signer
      );

      // Data Registry contract
      const dataRegistryContractABI = [...DataRegistryImplementation.abi];
      const dataRegistryContract = new ethers.Contract(
        dataRegistryContractAddress,
        dataRegistryContractABI,
        signer
      );

      // TEE Pool contract
      const teePoolContractABI = [...TeePoolImplementation.abi];
      const teePoolContract = new ethers.Contract(
        teePoolContractAddress,
        teePoolContractABI,
        signer
      );

      // Get master key from DLP contract
      const masterKey = await dlpLightContract.masterKey();
      console.log("Master Key:", masterKey);

      // Encrypt the signature using the master key
      const encryptedKey = await encryptWithMasterKey(signature, masterKey);
      console.log(`encryptedKey: '${encryptedKey}'`);

      // User adds file to the DataRegistry contract and sets permissions in one transaction
      appendStatus("Adding file to DataRegistry contract with permissions. Requesting user for permission...");
      const permissions = [
        {
          account: contractAddress,
          key: encryptedKey
        }
      ];
      // TODO: Unresolved function or method addFileWithPermissions()
      const tx = await dataRegistryContract.addFileWithPermissions(encryptedDataUrl, walletAddress, permissions);
      const receipt = await tx.wait();
      console.log("File added with permissions, transaction receipt:", receipt.hash);

      // Get file id from receipt transaction log
      const log = receipt.logs[0];
      const fileId = Number(log.args[0]);
      console.log("File ID:", fileId);
      setFileId(fileId);
      appendStatus(`File added to DataRegistry contract with permissions, file id is '${fileId}'. Requesting TEE fees from the TeePool contract...`);

      setUploadState("done");
      console.log(`File uploaded with ID: ${fileId}`);

      // TEE Proof
      // TODO: Unresolved function or method teeFee()
      const teeFee = await teePoolContract.teeFee();
      const teeFeeInVana = ethers.formatUnits(teeFee, 18);
      appendStatus(`TEE fee fetched: ${teeFeeInVana} VANA for running the contribution proof on the TEE`);

      appendStatus(`Requesting contribution proof from TEE for FileID: ${fileId}...`);
      const contributionProofTx = await teePoolContract.requestContributionProof(fileId, {
        value: teeFee,
      });
      const contributionProofReceipt = await contributionProofTx.wait();
      appendStatus(`Contribution proof requested. Transaction hash: ${contributionProofReceipt.hash}`);

      // Use fileJobIds to get the latest job for the file
      const jobIds = await fileJobIds(teePoolContract, fileId);
      const latestJobId = jobIds[jobIds.length - 1];
      appendStatus(`Latest JobID for FileID ${fileId}: ${latestJobId}`);

      const jobDetails = await getTeeDetails(teePoolContract, latestJobId);
      appendStatus(`Job details retrieved for JobID ${latestJobId}`);

      console.log("Job Details:", jobDetails);
      console.log(
        "TODO: Implement query to TEE Attestation URL:",
        jobDetails.teeUrl
      );

      // Implement the GET request to the TEE attestation endpoint
      console.log(
        `TODO: Implement GET request to TEE attestation endpoint ${jobDetails.teeUrl}/attestation`
      );

      // User Sends POST request to TEE /contribution-proofs endpoint with fileId and encryptedFileKey
      appendStatus(`Sending contribution proof request to TEE`);

      // TODO: Move to separate function
      const contributionProofResponse = await fetch(
        `${jobDetails.teeUrl}/RunProof`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: latestJobId,
            file_id: fileId,
            nonce: "1234",
            encryption_key: signature,
            proof_url:
              "https://github.com/vana-com/vana-satya-proof-template/releases/download/v24/gsc-my-proof-24.tar.gz",
            encryption_seed: "Please sign to retrieve your encryption key",
            env_vars: {
              USER_EMAIL: "user123@gmail.com",
            },
            secrets: {
              OPENAI_API_KEY:
                "5995fd35703fe232de27b759abe4d7f1b6f8bd97b97edd7432e3198d680870433ef3c2a4f85835fce07f6b9dee3987d7061f562c87cc446aba578cacf26ede463867c98d8a6622056c038ad42665ed26c2c7f9c5f0fe9b71c038ae9b170ddb642a633d0c3e47aec32017ab298a313c629014374883fd4267b338ca5dbde2ff5734e90fc441d37a3d6983fde2a169b1a4b0cf3fefeeba0951d5d2d2f3047e781427e7ae78baacd30aeaa7dbf12c9834825ffa34a94ecac569a08586c50facd00e80e112555e8338312b044e6889b8096c8d7fff8179c5e4f0f54d8b01cbaa0d579f6bfc4edac14cb3955b8a8cf8041d8e6f3111925030e1c9ed814ecc41d468172967b4e15e87ac76cb93d987651c4b106e596af78cd9803410bad580cd2b0adc2c8982c6380cc25a79ce085f73c2194d181a403f8162909c2e871007f717f85979e6232aa6162f91b6f3f796c2f47b00607f12c75e51ed8ec34fe772b571f5cd5dbc2f36525af0d86b6627296a4ead12c3d4b34a8512a2737023f5186b8d0963",
              TWITTER_PASSWORD:
                "79a076686d33878f1a11ef62218266e51e9b17eb3e2c1485ebc1cf3b775a5dd93dc585cddeea975e4f0082310dca5630b0ca68abeb82eb4c46f486b7a9e297f2113815c11ff6ec52d11fc0f08e8e0c625b76490dcbd07e2994e9a0781d26672cd7e96c117ebb511e82e55fae5af25e21f83f14d007135823199eede5cee11aad5080bd0ec63e3885f93278baaca44bb6804429854344edb083b980d7643c37d7e59b8dcad81814b7e127b88b32d166eec3e4150fb0b30d674232b5005439163462b7c1ab14d225f50b570f10f8b5953a2db3042899bae7215c4ee5ee9905d05feebe3b9b06577189ca06f3fc583d891e40dc732cbc82e5712b5396c57e56275c66ebc75c722495a4119cb41c79c8323bb6eccb9c30129c81d00e8b369fb01b32c78c238c7f0d917786c6fecb0749535387076da39a061b3b2b131e91685b983fedc2c0c52a77dd92f71955af5f762999223d44919e2380000cfe0ef05a0bc50cc4aae808b56eaa9a2eed2c71f3137cf7b47173a7f6172ab5f75012ee46e0109b",
            },
          }),
        }
      );
      const contributionProofData = await contributionProofResponse.json();
      console.log("Contribution proof response:", contributionProofData);
      appendStatus(
        `Contribution proof response received from TEE. Requesting a reward...`
      );

      // After that user calls requestClaim(fileId) on the DLP contract to request the claim
      // TODO: Unresolved function or method requestReward()
      const requestClaimTx = await dlpLightContract.requestReward(fileId, 1);
      await requestClaimTx.wait();
      console.log("Claim requested successfully");

      setUploadState("done");
      appendStatus("Reward received successfully");
    } catch (error) {
      console.error("Error encrypting and uploading file:", error);
      setUploadState("initial");
      appendStatus("Error: Failed to encrypt and upload file");
      handleError();
    }
};

const handleDownload = async () => {
if (!shareUrl) return;

    window.open(shareUrl, "_blank");
};

useEffect(() => {
if (!file) return;

    handleFileUpload(file);
}, [file]);

return (
<Box>
<Container>
<Grid gutter="lg" grow>
<Grid.Col
span={4}
offset={{ sm: 0, md: 1 }}
pt={{ sm: 0, md: 50 }}
order={{ base: 1, md: 2 }}
>
<Stack gap="md">
<Title order={5}>
{/*{uploadState === "done" ? "Congratulations" : "Upload data"}*/}
Contribute data
</Title>

              {uploadState === "initial" && !isDropboxConnected && (
                <ConnectStep />
              )}

              {uploadState === "initial" && isDropboxConnected && (
                <UploadState onSetFile={handleSetFile} />
              )}

              {uploadState === "loading" && file && (
                <UploadingState
                  fileName={file.name}
                  fileSize={file.size}
                />
              )}

              {uploadState === "done" &&
                encryptedFile &&
                uploadedFileMetadata && (
                  <UploadedFileState
                    fileName={
                      uploadedFileMetadata.name ?? "encrypted_file"
                    }
                    fileSize={
                      uploadedFileMetadata.size ?? encryptedFile.size
                    }
                    fileId={fileId}
                    onDownload={handleDownload}
                  />
                )}

              {statusLog.length > 0 && (
                <Stack gap="md">
                  <Title order={6}>Status Log:</Title>
                  <Paper p="sm">
                    {statusLog.map((status, index) => (
                      <Text key={index} mb={6}>
                        — {status}
                      </Text>
                    ))}
                  </Paper>
                </Stack>
              )}

              <Dialog opened={opened} onClose={close} size="lg" p={0}>
                <Notification color="red">
                  There was an error trying to encode your file. Please
                  make sure you have a wallet connected and try again.
                </Notification>
              </Dialog>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
);
}

--- app/providers.tsx ---
"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { theme } from "./core/theme/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config";
import { NetworkProvider } from "./providers/network.provider";

function Providers({ children }: React.PropsWithChildren) {
return (
<GoogleOAuthProvider clientId={config.googleClientId}>
<NetworkProvider />
<MantineProvider theme={theme}>
<Notifications />
{children}
</MantineProvider>
</GoogleOAuthProvider>
);
}

export default Providers;

--- app/about/page.tsx ---
import { Container, Stack, Text, Title } from "@mantine/core";

export default function Page() {
return (
<Container py={{ base: "16", sm: "72" }}>
<Stack align="stretch" justify="center" gap="md">
<Title order={4}>Acknowledgment of Test Nature</Title>
<Text>
Experimental Purpose: The participant acknowledges that the testnet is
provided solely on an “as is” and “as available” basis for
experimental purposes. The functionality of the testnet remains
experimental and has not undergone comprehensive testing. VANA
expressly disclaims any representations or warranties regarding the
operability, accuracy, or reliability of the testnet.
</Text>

        <Title order={4}>No Financial Promises</Title>
        <Text>
          Absence of Future Value: The participant agrees that participation in
          the testnet neither constitutes an investment nor implies an
          expectation of profit. There is no promise or implication of future
          value or potential return on any contributions of resources, time, or
          effort.
        </Text>

        <Title order={4}>Eligibility Requirements</Title>
        <Text>
          Restricted Countries: The participant represents and warrants that
          they are not a resident of, nor accessing the testnet from, the United
          States of America, Canada, or any jurisdiction that is either subject
          to OFAC sanctions or where participation in the testnet could subject
          VANA or the participant to potential liability.
        </Text>
        <Text>
          Compliance with Laws: The participant is solely responsible for
          ensuring that their participation in the testnet complies with all
          laws and regulations applicable within their jurisdiction.
        </Text>

        <Title order={4}>Indemnification</Title>
        <Text>
          Release of Liability: The participant agrees to indemnify, defend, and
          hold harmless VANA, its affiliates, officers, agents, employees, and
          partners from any claims, demands, losses, liabilities, or expenses
          arising from the use of the testnet, breach of these terms, or
          violation of any applicable laws or third-party rights.
        </Text>

        <Title order={4}>No Liability</Title>
        <Text>
          Limitation of Liability: In no event shall VANA be liable for any
          direct, indirect, incidental, special, consequential, or exemplary
          damages, including, but not limited to, damages for loss of profits,
          goodwill, use, data, or other intangible losses, resulting from the
          access to, use of, or inability to use the testnet.
        </Text>
        <Text>
          Technology Disclaimer: The technology underlying the testnet is
          provided without warranties of any kind, either express or implied,
          including, but not limited to, implied warranties of merchantability,
          fitness for a particular purpose, or non-infringement.
        </Text>

        <Title order={4}>Agreement to Additional Terms</Title>
        <Text>
          VANA’s Terms of Use and Privacy Policy: By clicking “Accept” in the
          pop-up, the participant agrees to be bound not only by these terms and
          conditions but also by VANA’s Terms of Use and Privacy Policy.
        </Text>
        <Text>
          Acceptance of Risk and Terms: By clicking “Accept” in the pop-up, the
          participant confirms having read, understood, and agreed to these
          terms and conditions, and accepts all risks associated with the use of
          the testnet, which may include bugs, errors, and other issues that
          could cause system failures or data loss.
        </Text>

        <Title order={4}>Modifications to Terms</Title>
        <Text>
          Right to Modify Terms: VANA reserves the right, at its sole
          discretion, to modify or replace these terms at any time. The
          participant is responsible for reviewing and becoming familiar with
          any such modifications. Continued use of the testnet following such
          modifications constitutes acceptance of the new terms.
        </Text>
      </Stack>
    </Container>
);
}

--- app/api/storage/dropbox/etag/route.ts ---
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
const searchParams = request.nextUrl.searchParams;
const url = searchParams.get("url");

if (!url) {
return new Response("URL parameter is required", { status: 400 });
}

try {
const response = await fetch(url, { method: "HEAD" });
const etag = response.headers.get("etag");

    if (etag) {
      return Response.json({ etag });
    } else {
      return Response.json({ error: "ETag not found" }, { status: 404 });
    }
} catch (error) {
throw new Error("Failed to fetch ETag");
}
}

--- app/auth/page.tsx ---
"use client";

import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useStorageStore } from "../core";

export default function Page() {
const params = useParams();
const setToken = useStorageStore((state) => state.setToken);
const setProvider = useStorageStore((state) => state.setProvider);
const setExpiresAt = useStorageStore((state) => state.setExpiresAt);

useEffect(() => {
const hashParams = new URLSearchParams(window.location.hash.slice(1));
const accessToken = hashParams.get("access_token");
// The length of time in seconds that the access token will be valid for.
const expiresIn = hashParams.get("expires_in");

    if (expiresIn) {
      setExpiresAt(Date.now() + parseInt(expiresIn) * 1000);
    }

    if (accessToken) {
      setToken(accessToken);
      setProvider('dropbox');
      window.close();
    }
}, [params]);

return (
<LoadingOverlay
visible={true}
zIndex={1000}
overlayProps={{ radius: "sm", blur: 2 }}
loaderProps={{ color: "brand-3", type: "bars" }}
color="brand-3"
/>
);
}

--- app/auth/dropbox/page.tsx ---
"use client";

import { useStorageStore } from "@/app/core";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
const params = useParams();
const setToken = useStorageStore((state) => state.setToken);
const setExpiresAt = useStorageStore((state) => state.setExpiresAt);
const setProvider = useStorageStore((state) => state.setProvider);

useEffect(() => {
const hashParams = new URLSearchParams(window.location.hash.slice(1));
const accessToken = hashParams.get("access_token");
// The length of time in seconds that the access token will be valid for.
const expiresIn = hashParams.get("expires_in");

    if (expiresIn) {
      setExpiresAt(Date.now() + parseInt(expiresIn) * 1000);
    }

    if (accessToken) {
      setToken(accessToken);
      setProvider("dropbox");
      window.close();
    }
}, [params]);

return (
<LoadingOverlay
visible={true}
zIndex={1000}
overlayProps={{ radius: "sm", blur: 2 }}
loaderProps={{ color: "brand-3", type: "bars" }}
color="brand-3"
/>
);
}

--- app/claim/layout.tsx ---
import { Box } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
return <Box py={{ base: "16", sm: "72" }}>{children}</Box>;
}

--- app/claim/page.tsx ---
"use client";

import { Icon } from "@iconify/react";
import {
Button,
Container,
Flex,
Grid,
Stack,
Text,
Title,
Image,
Alert,
Group,
} from "@mantine/core";
import Link from "next/link";
import { Notification } from "@mantine/core";
import { Disclaimer } from "./components/disclaimer";

const instructions = [
{
number: 1,
title: "Connect wallet to create account",
description:
"To create your account, click 'Connect' located at the top right corner of the screen and follow the instructions to connect your wallet.",
},
{
number: 2,
title: "Follow Your DLP's instructions",
description:
"For example, a ChatGPT DLP may ask you to open a new chat in ChatGPT, paste your wallet address into the message box, and send it. Then, request a download of your ChatGPT data.",
},
{
number: 3,
title: "Upload data and claim points",
description:
"Submit a data upload transaction here to claim your points",
},
];

export default function Page() {
return (
<Container>
<Grid>
<Grid.Col span={{ sm: 12, md: 6 }}>
<Stack align="stretch" justify="center" gap="lg">
<Title order={3} ff="monospace">
Claim instructions
</Title>
<Disclaimer />
{instructions.map((instruction, i) => (
<Stack gap="sm" key={i}>
<Text c="brand-2" fw="bold">
0{instruction.number}
</Text>
<Title order={6} c="brand-2">
{instruction.title}
</Title>
<Text fw="500">{instruction.description}</Text>
</Stack>
))}
<Flex justify="flex-end">
<Link href="/claim/upload">
<Button color="brand-3">Get started</Button>
</Link>
</Flex>
</Stack>
</Grid.Col>
<Grid.Col span={5} offset={1} visibleFrom="md">
<Image radius="md" src="/images/claim/instructions.png" />
</Grid.Col>
</Grid>
</Container>
);
}

--- app/claim/components/disclaimer.tsx ---
import {
Group,
Notification,
Text,
Title
} from "@mantine/core";

export const Disclaimer = () => {
return (
<Notification
title={
<Group gap={4}>
<Title order={6}>THIS IS A TESTNET</Title>
</Group>
}
withCloseButton={false}
color="orange"
withBorder
bg="gray.0"
>
<Text c="black">
Please do <b>NOT</b> upload any real information. To participate, please
create a new account for testing purposes only.
</Text>
</Notification>
);
};

--- app/claim/success/page.tsx ---
"use client";

import {
Box,
Container,
Grid,
Image,
Stack,
Title,
Text,
Button,
} from "@mantine/core";

export default function Page() {
return (
<Box>
<Container>
<Grid gutter="lg" grow>
<Grid.Col span={{ sm: 12, md: 5 }} order={{ base: 2, md: 1 }}>
<Stack align="stretch" justify="center" gap="md">
<Image
radius="md"
src="/images/claim/instructions.png"
fallbackSrc="https://placehold.co/600x600?text=Placeholder"
/>
</Stack>
</Grid.Col>
<Grid.Col
span={5}
offset={{ sm: 0, md: 2 }}
pt={{ sm: 0, md: 50 }}
order={{ base: 1, md: 2 }}
>
<Stack gap="lg">
<Title order={5}>Congratulations</Title>
<Text>
You have successfully uploaded your encrypted data to the Data
Liquidity Pool.
</Text>
<Box>
<Stack gap={0} align="center" p="lg" bg="brand-5">
<Title order={5}>15,000 tokens</Title>
{/*<Text>available for claim</Text> */}
</Stack>
</Box>
<Button fullWidth color="brand-3" disabled>
Claim (coming soon)
</Button>
</Stack>
</Grid.Col>
</Grid>
</Container>
</Box>
);
}

--- app/components/index.tsx ---
export * from "./layout/layout";

--- app/components/layout/layout.tsx ---
"use client";

import { useConnectWallet, useNetworkStore, useWalletStore } from "@/app/core";
import { Icon } from "@iconify/react";
import {
AppShell,
Badge,
Burger,
Button,
Center,
Container,
Flex,
Group,
Menu,
SelectProps,
Stack,
Text,
Title,
UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SettingsButton } from "./settings-button";

const links = [
{ title: "Claim", href: "/claim" },
{ title: "About", href: "/terms" },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
children,
}) => {
const network = useNetworkStore((state) => state.network);
const setNetwork = useNetworkStore((state) => state.setNetwork);

useEffect(() => {
useNetworkStore.persist.rehydrate();
}, []);

const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure();
const walletAddress = useWalletStore((state) => state.walletAddress);
const { connect, disconnect } = useConnectWallet();
const pathname = usePathname();

const isActive = (path: string) => pathname.includes(path);

useEffect(() => {
if (sidebarOpened) {
toggleSidebar();
}
}, [pathname]);

const renderSelectOption: SelectProps["renderOption"] = ({ option }) => {
if (option.value === "testnet") {
return option.label;
}

    return (
      <Group flex="1" gap="xs">
        {option.label}
        <Badge size="sm" variant="light" color="dark">
          Coming Soon
        </Badge>
      </Group>
    );
};

// if query string contains `internal`, show internal features
let showInternalFeatures = false;
if (typeof window !== "undefined") {
const urlParams = new URLSearchParams(window.location.search);
showInternalFeatures = urlParams.has("internal");
}

return (
<AppShell
header={{ height: 72 }}
navbar={{
width: 300,
breakpoint: "sm",
collapsed: { desktop: true, mobile: !sidebarOpened },
}}
>
<AppShell.Header bg="brand-1">
<Container h="100%">
<Group h="100%" align="center">
<Group justify="space-between" w="100%">
<Group>
<Burger
opened={sidebarOpened}
onClick={toggleSidebar}
hiddenFrom="sm"
size="sm"
color="brand-4"
/>

                <Flex pos="relative" dir="row" align="center" gap="sm">
                  <Link href="/">
                    <Title order={5} ff="monospace">
                      DataDAO
                    </Title>
                  </Link>
                  <Menu shadow="md" width={250}>
                    <Menu.Target>
                      <UnstyledButton>
                        <Badge color="red" variant="light" size="lg">
                          {network as string}
                        </Badge>
                      </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Network</Menu.Label>
                      {showInternalFeatures && <Menu.Item
                        onClick={() => setNetwork("moksha")}
                        leftSection={
                          network === "moksha" && (
                            <Icon icon="carbon:checkmark" />
                          )
                        }
                      >
                        Moksha Testnet
                      </Menu.Item>}
                      <Menu.Item
                        onClick={() => setNetwork("satori")}
                        leftSection={
                          network === "satori" && (
                            <Icon icon="carbon:checkmark" />
                          )
                        }
                      >
                        Satori Testnet
                      </Menu.Item>
                      <Menu.Item
                        disabled
                        onClick={() => setNetwork("mainnet")}
                        leftSection={
                          network === "mainnet" && (
                            <Icon icon="carbon:checkmark" />
                          )
                        }
                      >
                        <Group flex="1" gap="xs">
                          Vana Mainnet
                          <Badge size="sm" variant="light" color="dark">
                            Coming Soon
                          </Badge>
                        </Group>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>

                <Group ml="lg" gap={0} visibleFrom="sm">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <UnstyledButton
                        p={12}
                        c={isActive(link.href) ? "brand-4" : undefined}
                      >
                        <Text size="sm" fw="bold">
                          {link.title}
                        </Text>
                      </UnstyledButton>
                    </Link>
                  ))}
                </Group>
              </Group>

              <Group>
                {walletAddress ? (
                  <Button
                    variant="outline"
                    color="brand-3"
                    onClick={disconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    color="brand-3"
                    // onClick={handleOpenLogin}
                    onClick={connect}
                  >
                    Connect
                  </Button>
                )}
              </Group>
            </Group>
          </Group>
        </Container>

        <Center p={"xs"} bg="var(--mantine-color-red-9)">
          <Text fs={"sm"} c={"white"}>THIS IS A TESTNET. POINTS EARNED ON TESTNET HOLD NO VALUE AND ARE NOT INDICATIVE OF A FUTURE AIRDROP.</Text>
        </Center>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="default"
                fullWidth
                justify="flex-start"
                fw="bold"
                size="lg"
                disabled={isActive(link.href)}
              >
                {link.title}
              </Button>
            </Link>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main mt={40}>{children}</AppShell.Main>
    </AppShell>
);
};

--- app/components/layout/settings-button.tsx ---
import { useNetworkStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { ActionIcon, Button, Drawer, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

export const SettingsButton = () => {
const [opened, { open, close }] = useDisclosure(false);
const contract = useNetworkStore((state) => state.contract);
const publicKeyBase64 = useNetworkStore((state) => state.publicKeyBase64);
const setPublicKeyBase64 = useNetworkStore((state) => state.setPublicKeyBase64);
const setContract = useNetworkStore((state) => state.setContract);

const form = useForm({
mode: "uncontrolled",
initialValues: {
contract,
publicKey: atob(publicKeyBase64),
},
});

useEffect(() => {
form.setValues({ contract, publicKey: atob(publicKeyBase64) });
}, [contract, publicKeyBase64]);

const handleSubmit = (values: { contract: string, publicKey: string }) => {
setContract(values.contract);
setPublicKeyBase64(btoa(values.publicKey));

    close();
};

return (
<>
<Drawer
opened={opened}
onClose={close}
title="Settings"
offset={8}
radius="md"
position="right"
>
<form onSubmit={form.onSubmit(handleSubmit)}>
<TextInput
withAsterisk
label="Contract address"
placeholder="0x..."
key={form.key("contract")}
autoComplete="off"
{...form.getInputProps("contract")}
/>
<Textarea
withAsterisk
rows={10}
label="Public key"
placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nABC..."
key={form.key("publicKey")}
autoComplete="off"
{...form.getInputProps("publicKey")}
/>

          <Group justify="flex-end" mt="md">
            <Button type="submit" color="brand-3">
              Save
            </Button>
          </Group>
        </form>
      </Drawer>

      <ActionIcon
        variant="outline"
        color="brand-3"
        aria-label="Settings"
        onClick={open}
        size={36}
      >
        <Icon icon="carbon:settings" />
      </ActionIcon>
    </>
);
};

--- app/core/index.tsx ---
export * from "./features";

--- app/core/features/index.tsx ---
export * from "./wallet";
export * from "./integrations";
export * from "./layout";

--- app/core/features/integrations/dropbox.service.ts ---
import { config } from "@/app/config";
import * as Dropbox from "dropbox";

export const getDropboxAuthUrl = async () => {
const dbx = new Dropbox.DropboxAuth({ clientId: config.dropboxClientId });
const authUrl = await dbx.getAuthenticationUrl(config.dropboxCallbackUrl);

return authUrl.toString();
};

export const uploadFileToDropbox = async (
file: Blob,
fileName: string,
token: string
) => {
const dbx = new Dropbox.Dropbox({ accessToken: token });
const response = await dbx.filesUpload({
contents: file,
path: `/${config.dropboxFolderName}/encrypted_${fileName}`,
mode: {
".tag": "add",
},
autorename: true,
mute: false,
});

const shareLink = await getDropboxShareLink(
token,
response.result.path_lower as string
);
// TODO: This is wrong, try to get the ETag from the header of response to the share link or /2/sharing/get_shared_link_metadata
// const etag = await getEtag(shareLink);
const etag = null;

return { ...response.result, etag };
};

export const getDropboxShareLink = async (token: string, path: string) => {
const dbx = new Dropbox.Dropbox({ accessToken: token });
const response = await dbx.sharingListSharedLinks({
path,
direct_only: true,
});

let shareableLink = response.result.links.find(
(link) => link.path_lower === path.toLowerCase()
)?.url;

// If a link already exists, use it, otherwise create a new one
if (!shareableLink) {
const createLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
path,
settings: {
allow_download: true,
},
});
shareableLink = createLinkResponse.result.url;
}

// Replace 'dl=0' with 'dl=1' to force download
shareableLink = shareableLink.replace("dl=0", "dl=1");

return shareableLink;
};

const getEtag = async (shareLink: string) => {
// Use the link to fetch the ETag via an HTTP HEAD request
const res = await fetch(
`/api/storage/dropbox/etag?url=${encodeURIComponent(shareLink)}`
);
const data = await res.json();
if (data.etag) {
console.log("ETag:", data.etag);
} else {
console.error("Error:", data.error);
}
return data.etag;
};

--- app/core/features/integrations/google-drive.service.ts ---
import { config } from "@/app/config";

export const uploadFileToGoogleDrive = async (
file: Blob,
fileName: string,
token: string
) => {
const folderId = await findOrCreateFolder(
token,
config.googleDriveFolderName
);
const url =
"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

// Construct metadata
const metadata = {
name: `encrypted_${fileName}`,
parents: [folderId],
};

// Create the multipart body
let formData = new FormData();
formData.append(
"metadata",
new Blob([JSON.stringify(metadata)], { type: "application/json" })
);
formData.append("file", file);

try {
const response = await fetch(url, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
// Don't set 'Content-Type' here as FormData will append the boundary parameter to 'multipart/form-data'
},
body: formData,
});

    if (!response.ok)
      throw new Error(
        `Google Drive API returned error ${
          response.status
        }: ${await response.text()}`
      );

    const fileDetails = await response.json();

    return await fetchFileDetails(token, fileDetails.id);
} catch (error) {
console.error("Failed to upload file to Google Drive:", error);
throw error;
}
};

const fetchFileDetails = async (token: string, fileId: string) => {
const detailsUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,md5Checksum,modifiedTime`;

const response = await fetch(detailsUrl, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});

if (!response.ok) {
throw new Error(
`Failed to fetch file details: ${
response.status
} ${await response.text()}`
);
}

return await response.json();
};

export const getGoogleDriveShareLink = async (
token: string,
fileId: string
) => {
try {
// Update permissions
await updateFilePermissions(token, fileId);

    // Get the shareable link
    return createSharableLink(token, fileId);
} catch (error) {
console.error("Error creating shareable link:", error);
throw error;
}
};

const findOrCreateFolder = async (token: string, folderName: string) => {
const url = `https://www.googleapis.com/drive/v3/files`;
const params = new URLSearchParams({
q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
fields: "files(id, name)",
pageSize: "1",
});

const searchResponse = await fetch(`${url}?${params.toString()}`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});

const data = await searchResponse.json();
if (data.files && data.files.length > 0) {
return data.files[0].id; // Return the first found folder's ID
} else {
// Folder not found, create it
const metadata = {
name: folderName,
mimeType: "application/vnd.google-apps.folder",
};
const createResponse = await fetch(url, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
body: JSON.stringify(metadata),
});

    const folderData = await createResponse.json();
    return folderData.id; // Return the newly created folder's ID
}
};

const createSharableLink = async (token: string, fileId: string) => {
return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

const updateFilePermissions = async (token: string, fileId: string) => {
const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;

const body = JSON.stringify({
role: "reader", // or 'writer' depending on the access you want to provide
type: "anyone", // 'anyone' who has the link can view the file
});

const response = await fetch(url, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
body: body,
});

if (!response.ok) {
throw new Error(`Failed to update permissions: ${await response.text()}`);
}

return await response.json(); // Returns permission details
};

--- app/core/features/integrations/index.tsx ---
export * from "./storage.service";
export * from "./storage.store";
export * from "./dropbox.service";

--- app/core/features/integrations/storage.service.tsx ---
import { getDropboxShareLink, uploadFileToDropbox } from "./dropbox.service";
import {
getGoogleDriveShareLink,
uploadFileToGoogleDrive,
} from "./google-drive.service";

export type StorageProvider = "google-drive" | "dropbox";

export type FileMetadata = {
id: string;
name: string;
size: number;
modifiedTime?: string;
fileId?: number;
};

export const uploadFile = async (
file: Blob,
fileName: string,
token: string,
provider: StorageProvider
): Promise<FileMetadata> => {
switch (provider) {
case "google-drive": {
const metadata = await uploadFileToGoogleDrive(file, fileName, token);
console.log("Modified Time", metadata.modifiedTime);

      return {
        id: metadata.id,
        name: metadata.name,
        size: file.size,
        modifiedTime: metadata.modifiedTime,
      };
    }
    case "dropbox": {
      const metadata = await uploadFileToDropbox(file, fileName, token);

      return {
        id: metadata.path_lower as string,
        name: metadata.name,
        size: file.size,
      };
    }
    default:
      throw new Error(`Unknown storage provider: ${provider}`);
}
};

export const getEncryptedDataUrl = (
token: string,
id: string,
provider: StorageProvider
) => {
switch (provider) {
case "google-drive":
return getGoogleDriveShareLink(token, id);
case "dropbox":
return getDropboxShareLink(token, id);
default:
throw new Error(`Unknown storage provider: ${provider}`);
}
};

--- app/core/features/integrations/storage.store.tsx ---
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StorageProvider } from "./storage.service";

export const ProviderLabel: Record<StorageProvider, string> = {
"google-drive": "Google Drive",
dropbox: "Dropbox",
};

type StorageState = {
provider: StorageProvider | null;
setProvider: (provider: StorageProvider) => void;

token: string | null;
setToken: (token: string) => void;

expiresAt: number | null;
setExpiresAt: (expiresAt: number) => void;

reset: () => void;
};

export const useStorageStore = create<StorageState>()(
persist(
(set) => ({
provider: null,
setProvider: (provider) => set({ provider }),

      token: null,
      setToken: (token) => set({ token }),

      expiresAt: null,
      setExpiresAt: (expiresAt) => set({ expiresAt }),

      // Clear all state
      reset: () =>
        set({
          provider: null,
          token: null,
          expiresAt: null,
        }),
    }),
    {
      name: "storage-storage",
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return;

          if (!state.expiresAt || state.expiresAt < Date.now()) {
            state.reset();
          }
        };
      },
    }
)
);

--- app/core/features/layout/index.tsx ---
export * from './network.store';

--- app/core/features/layout/network.store.ts ---
import { config, networks } from "@/app/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Network = keyof typeof networks | string;

type NetworkState = {
network: Network;
setNetwork: (network: Network) => void;

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

        publicKeyBase64: config.publicKeyBase64,
        setPublicKeyBase64: (publicKeyBase64) => set({ publicKeyBase64 }),

        chainId: defaultNetworkConfig.chainId,
        rpcUrl: defaultNetworkConfig.rpcUrl,
        chainName: defaultNetworkConfig.chainName,
        explorerUrl: defaultNetworkConfig.explorerUrl,
        currency: defaultNetworkConfig.currency,
      }
    },
    {
      name: "network-storage",
    }
)
);

--- app/core/features/wallet/index.tsx ---
export * from "./wallet.store";
export * from "./wallet.hooks";
export * from "./wallet.service";

--- app/core/features/wallet/wallet.hooks.tsx ---
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

--- app/core/features/wallet/wallet.service.tsx ---
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

--- app/core/features/wallet/wallet.store.tsx ---
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletState = {
walletAddress: string | null;
setWalletAddress: (address: string | null) => void;
};

export const useWalletStore = create<WalletState>()(
persist(
(set) => ({
walletAddress: null,
setWalletAddress: (address) => set({ walletAddress: address }),
}),
{
name: "wallet-storage",
}
)
);

--- app/core/theme/index.ts ---
export * from './theme';
export * from './theme.d';

--- app/core/theme/theme.d.ts ---
import { DefaultMantineColor, MantineColorsTuple } from "@mantine/core";

type ExtendedCustomColors =
| "brand-1"
| "brand-2"
| "brand-3"
| "brand-4"
| "brand-5"
| "brand-6"
| "brand-7"
| DefaultMantineColor;

declare module "@mantine/core" {
export interface MantineThemeColorsOverride {
colors: Record<ExtendedCustomColors, MantineColorsTuple>;
}
}

--- app/core/theme/theme.tsx ---
import { Container, Text, colorsTuple, createTheme, rem } from "@mantine/core";
import { Khand } from "next/font/google";
import localFont from "next/font/local";

const khand = Khand({
weight: ["400", "500", "600", "700"],
subsets: ["latin"],
});

const arrayFont = localFont({
src: [
{
path: "../fonts/Array-Wide.otf",
weight: "400",
style: "normal",
},
{
path: "../fonts/Array-SemiboldWide.otf",
weight: "500",
style: "bolder",
},
{
path: "../fonts/Array-BoldWide.otf",
weight: "700",
style: "bold",
},
],
});

export const theme = createTheme({
components: {
Container: Container.extend({
defaultProps: {
size: "lg",
},
}),
Text: Text.extend({
defaultProps: {
size: "sm",
},
}),
},
fontFamily: khand.style.fontFamily,
fontFamilyMonospace: arrayFont.style.fontFamily,
headings: {
fontFamily: khand.style.fontFamily,
sizes: {
h1: {
fontSize: rem(60),
},
h2: {
fontSize: rem(56),
},
h3: {
fontSize: rem(40),
},
h4: {
fontSize: rem(32),
},
h5: {
fontSize: rem(24),
},
h6: {
fontSize: rem(16),
},
},
},
fontSizes: {
xl: rem(32),
lg: rem(24),
md: rem(20),
sm: rem(16),
xs: rem(14),
xxs: rem(12),
},
lineHeights: {
xl: rem(48),
lg: rem(32),
md: rem(28),
sm: rem(24),
xs: rem(20),
xxs: rem(16),
},
spacing: {
xs: rem(8),
md: rem(16),
lg: rem(24),
xl: rem(32),
xxl: rem(40),
},
colors: {
["brand-1"]: colorsTuple("#90D26D"),
["brand-2"]: colorsTuple("#A0AA96"),
["brand-3"]: colorsTuple("#2D7865"),
["brand-4"]: colorsTuple("#D9EDBF"),
["brand-5"]: colorsTuple("#F7FFF4"),
["brand-6"]: colorsTuple("#F3F8EE"),
["brand-7"]: colorsTuple("#E0EAE3"),
["brand-8"]: colorsTuple("#A5B3A5"),
},
});

--- app/home/components/connect.tsx ---
import { Group, Stack, Text } from "@mantine/core";
import Script from "next/script";
import { DropboxButton } from "./dropbox-button";
import { GoogleDriveButton } from "./google-drive-button";

export const ConnectStep = () => {
return (
<Stack>
<Script src="https://apis.google.com/js/api.js" />
<Text>
In order to upload your file, you need to connect your cloud storage
account.
</Text>
<Text>
We will never store your files. They will be encrypted and stored in
your storage account.
</Text>
<Group>
<DropboxButton />
<GoogleDriveButton />
</Group>
</Stack>
);
};

--- app/home/components/disclaimer.tsx ---
import {
Group,
Notification,
Text,
Title
} from "@mantine/core";

export const Disclaimer = () => {
return (
<Notification
title={
<Group gap={4}>
<Title order={6}>THIS IS A TESTNET</Title>
</Group>
}
withCloseButton={false}
color="orange"
withBorder
bg="gray.0"
>
<Text c="black">
Please do <b>NOT</b> upload any real information. To participate, please
create a new account for testing purposes only.
</Text>
</Notification>
);
};

--- app/home/components/dropbox-button.tsx ---
import { getDropboxAuthUrl, useStorageStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { Button, Group } from "@mantine/core";
import { useState } from "react";

export const DropboxButton = () => {
const [loading, setLoading] = useState(false);

const handleConnect = async () => {
const authUrl = await getDropboxAuthUrl();

    setLoading(true);

    const popup = window.open(
      authUrl,
      "_blank",
      "popup=true, width=600, height=600"
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        useStorageStore.persist.rehydrate();
        setLoading(false);

        clearInterval(interval);
        return;
      }
    }, 1000);
};

return (
<Button
color="#0061FE"
onClick={handleConnect}
loading={loading}
variant="outline"
>
<Group gap="xs">
<Icon icon="mdi:dropbox" />
Connect Dropbox
</Group>
</Button>
);
};

--- app/home/components/google-drive-button.tsx ---
import { useStorageStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { Button, Group } from "@mantine/core";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export const GoogleDriveButton = () => {
const [loading, setLoading] = useState(false);

const setToken = useStorageStore((state) => state.setToken);
const setProvider = useStorageStore((state) => state.setProvider);
const setExpiresAt = useStorageStore((state) => state.setExpiresAt);

const handleSuccess = (
response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
) => {
setToken(response.access_token);
setProvider("google-drive");
setExpiresAt(Date.now() + response.expires_in * 1000);
};

const login = useGoogleLogin({
scope:
"https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
onSuccess: handleSuccess,
onError: (error) => console.log("Login Failed:", error),
});

const handleLogin = () => {
setLoading(true);

    login();
};

return (
<Button
color="#21a363"
onClick={handleLogin}
loading={loading}
variant="outline"
>
<Group gap="xs">
<Icon icon="mdi:google-drive" />
Connect Google Drive
</Group>
</Button>
);
};

--- app/home/components/share-file.tsx ---
import { Stack, TextInput, Flex, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ShareFileLink = () => {
const [isSubmitting, setIsSubmitting] = useState(false);
const router = useRouter();
const form = useForm({
mode: "uncontrolled",
initialValues: {
url: "",
},

    // validate: {
    //   url: (value) => (validateGoogleDriveDomain(value) ? null : "Invalid url"),
    // },
});

const handleSubmit = async () => {
setIsSubmitting(true);

    try {
      // fake timer for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsSubmitting(false);
    }
    // TODO: add validation
    router.push("/success");
};

return (
<Stack gap="lg">
<form onSubmit={form.onSubmit(handleSubmit)}>
<Text size="lg" fw="500">
Share google drive link
</Text>
<Stack gap="sm">
<TextInput
placeholder="https://drive.google.com/drive"
description={
form.getInputProps("url").error
? undefined
: "any guidance could go here"
}
inputWrapperOrder={["label", "input", "error", "description"]}
type="url"
{...form.getInputProps("url")}
/>
<Flex justify="flex-end">
<Button color="brand-3" type="submit" loading={isSubmitting}>
Continue
</Button>
</Flex>
</Stack>
</form>
</Stack>
);
};

const validateGoogleDriveDomain = (value: string) => {
// This regex checks if the URL starts with 'https://drive.google.com/'
const regex = /^https:\/\/drive\.google\.com\//;
return regex.test(value);
};

--- app/home/components/success.tsx ---
import { Stack, Title, Box, Button, Text, Alert } from "@mantine/core";
import { useFileStatus } from "@/app/hooks/useFileStatus";

export const Success = ({ fileId }: { fileId: number | null }) => {
const { isFinalized, reward, isClaimable, isClaiming, claimReward, error } = useFileStatus(fileId);

if (fileId === null) {
return <Alert color="blue">Waiting for file upload to complete...</Alert>;
}

return (
<Stack gap="lg">
{error && (
<Alert color="red" title="Error">
{error}
</Alert>
)}
<Box className="border-2" style={{ borderColor: "var(--mantine-color-brand-3-text)" }}>
<Stack gap={0} align="center" p="lg" bg="brand-5">
<Title order={5}>{isFinalized ? `${reward} tokens` : 'Verification in progress'}</Title>
<Text>{isFinalized ? 'available for claim' : 'Please wait for verification'}</Text>
</Stack>
</Box>
{isClaimable ? (
<Button fullWidth color="brand-3" onClick={claimReward} loading={isClaiming}>
Claim Reward
</Button>
) : (
<Button fullWidth color="brand-3" disabled>
{isFinalized ? 'Reward Claimed' : 'Waiting for verification'}
</Button>
)}
</Stack>
);
};

--- app/home/components/upload.tsx ---
import { useStorageStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { Box, Button, Highlight, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

export const UploadState = ({
onSetFile,
}: {
onSetFile(file: File | null): void;
}) => {
const reset = useStorageStore((state) => state.reset);

return (
<Stack gap={0}>
<Dropzone
onDrop={(files) => files[0] && onSetFile(files[0])}
maxFiles={1}
bg="brand-5"
>
<Box w="100%" h={126}>
<Stack align="center" justify="center" gap={4} h="100%">
<Icon icon="bxs:data" />
<Highlight
ta="center"
highlight={["Click to upload"]}
highlightStyles={{
fontWeight: 700,
background: "none",
}}
>
Click to upload or drag and drop
</Highlight>
<Text size="xs" ta="center">
(Max. File size: 25 MB)
</Text>
</Stack>
</Box>
</Dropzone>
<Button variant="transparent" onClick={reset}>
<Text size="xs" c="gray" fw="500">Disconnect</Text>
</Button>
</Stack>
);
};

--- app/home/components/uploaded.tsx ---
import { ProviderLabel, useStorageStore } from "@/app/core";
import { formatBytes } from "@/app/utils/formatters/bytes";
import { Button, Grid, Stack, Text, Alert } from "@mantine/core";
import { useFileStatus } from "@/app/hooks/useFileStatus";

export const UploadedFileState = ({
fileName,
fileSize,
fileId,
onDownload,
}: {
fileName: string;
fileSize: number;
fileId: number | null;
onDownload(): void;
}) => {
const provider = useStorageStore((store) => store.provider);
const { isFinalized, reward, isClaimable, isClaiming, claimReward, error } = useFileStatus(fileId);

return (
<Grid
w="100%"
bg="brand-5"
className="border-2"
style={{
borderColor: "var(--mantine-color-brand-3-text)",
}}
p={24}
>
<Grid.Col span="auto">
<Stack gap={0}>
<Text size="sm" fw="500" lineClamp={1}>
{fileName}
</Text>
<Text size="xxs" c="gray" fw="bold">
{formatBytes(fileSize)}
</Text>
{isFinalized && (
<Text size="xs">
Reward: {reward} tokens
</Text>
)}
{error && (
<Alert color="red" mt={8}>
{error}
</Alert>
)}
</Stack>
</Grid.Col>
<Grid.Col span="content">
<Stack>
{provider && (
<Button variant="outline" color="brand-3" onClick={onDownload}>
View on {ProviderLabel[provider]}
</Button>
)}
{isClaimable && (
<Button
color="brand-3"
onClick={claimReward}
loading={isClaiming}
>
Claim Reward
</Button>
)}
</Stack>
</Grid.Col>
</Grid>
);
};

--- app/home/components/uploading.tsx ---
import { formatBytes } from "@/app/utils/formatters/bytes";
import { Grid, Stack, Progress, Text } from "@mantine/core";

export const UploadingState = ({
fileName,
fileSize,
}: {
fileName: string;
fileSize: number;
}) => {
return (
<Grid
w="100%"
bg="brand-5"
className="border-2 border-dashed"
style={{
borderColor: "var(--mantine-color-brand-3-text)",
}}
p={24}
>
<Stack w="100%" justify="center" gap={12}>
<Stack gap={0}>
<Text size="sm" fw="500" lineClamp={1}>
{fileName}
</Text>
<Text size="xxs" c="gray" fw="bold">
{formatBytes(fileSize)}
</Text>
</Stack>
<Progress color="gray" value={100} animated size="lg" />
</Stack>
</Grid>
);
};

--- app/hooks/useFileStatus.ts ---
import { useNetworkStore, useWalletStore } from "@/app/core";
import { ethers } from "ethers";
import { useState, useEffect, useCallback } from "react";
import DataLiquidityPoolLightImplementation from "@/app/contracts/DataLiquidityPoolLightImplementation.json";
import { config } from "@/app/config";

export const useFileStatus = (fileId: number | null) => {
const [isFinalized, setIsFinalized] = useState(false);
const [reward, setReward] = useState(0);
const [isClaimable, setIsClaimable] = useState(false);
const [isClaiming, setIsClaiming] = useState(false);
const [error, setError] = useState<string | null>(null);

const contractAddress = config.smartContracts.dlp
const walletAddress = useWalletStore((state) => state.walletAddress);

const checkFileStatus = useCallback(async () => {
if (!contractAddress || !walletAddress || fileId === null) {
setError("Wallet not connected, contract address not set, or file ID not available");
return;
}

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // const contract = new ethers.Contract(contractAddress, DataLiquidityPoolLightImplementation.abi, signer);
      // const fileInfo = await contract.files(fileId);
      // setIsFinalized(fileInfo.status == 2);
      // setReward(Number(ethers.formatEther(fileInfo.rewardAmount)));
      // setIsClaimable(fileInfo.status == 2 && fileInfo.rewardWithdrawn === BigInt(0));
      setError(null);
    } catch (err) {
      console.error("Error checking file status:", err);
    }
}, [fileId, contractAddress, walletAddress]);

useEffect(() => {
if (fileId !== null) {
checkFileStatus();
const interval = setInterval(checkFileStatus, 30000);
return () => clearInterval(interval);
}
}, [fileId, checkFileStatus]);

const claimReward = async () => {
if (!contractAddress || !walletAddress || fileId === null) {
setError("Wallet not connected, contract address not set, or file ID not available");
return;
}

    setIsClaiming(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DataLiquidityPoolLightImplementation.abi, signer);

      const tx = await contract.claimContributionReward(fileId);
      await tx.wait();
      setIsClaimable(false);
      setError(null);
      await checkFileStatus(); // Refresh the status after claiming
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      setError(`Failed to claim reward: ${err.message || 'Unknown error'}`);
    } finally {
      setIsClaiming(false);
    }
};

return { isFinalized, reward, isClaimable, isClaiming, claimReward, error };
};

--- app/providers/network.provider.tsx ---
"use client";

import { useEffect } from "react";
import { requestNetworkSwitch, useNetworkStore } from "../core";

export const NetworkProvider = () => {
const chainId = useNetworkStore((state) => state.chainId);
const rpcUrl = useNetworkStore((state) => state.rpcUrl);
const chainName = useNetworkStore((state) => state.chainName);
const explorerUrl = useNetworkStore((state) => state.explorerUrl);
const currency = useNetworkStore((state) => state.currency);

useEffect(() => {
requestNetworkSwitch({
chainId,
rpcUrl,
chainName,
explorerUrl,
currency,
});
}, [chainId, rpcUrl, chainName, explorerUrl, currency]);

return <></>;
};

--- app/terms/layout.tsx ---
"use client";


export default function TermsLayout({
children,
}: {
children: React.ReactNode;
}) {
return <section>{children}</section>;
}

--- app/terms/page.tsx ---
import { Container, List, ListItem, Stack, Text, Title } from "@mantine/core";

export default function Page() {
return (
<Container py={{ base: "16", sm: "72" }}>
<Stack align="stretch" justify="center" gap="md">
<Title order={1}>Data usage & privacy</Title>
<Text>Effective Date: 15 May 2024</Text>

        <Title order={5}>Introduction</Title>
        <Text>
          Corsali, Inc. dba Vana (“Vana,” “we,” “us,” or “our”) is developing a
 ...

--- app/utils/crypto.ts ---
import * as openpgp from "openpgp";

export async function clientSideEncrypt(
file: File,
signature: string,
): Promise<File> {
const fileBuffer = await file.arrayBuffer();
const message = await openpgp.createMessage({
binary: new Uint8Array(fileBuffer),
});

const encrypted = await openpgp.encrypt({
message,
passwords: [signature],
format: "binary",
});

// Convert WebStream<Uint8Array> to BlobPart
const response = new Response(encrypted as ReadableStream<Uint8Array>);
const arrayBuffer = await response.arrayBuffer();
const uint8Array = new Uint8Array(arrayBuffer);

const encryptedBlob = new Blob([uint8Array], {
type: "application/octet-stream",
});
const encryptedFile = new File(
[encryptedBlob],
"",
{
type: "application/octet-stream",
},
);
return encryptedFile;
}

export async function clientSideDecrypt(encryptedFile: File, signature: string): Promise<ArrayBuffer> {
const encryptedData = await encryptedFile.arrayBuffer();
const message = await openpgp.readMessage({
binaryMessage: new Uint8Array(encryptedData),
});

const decrypted = await openpgp.decrypt({
message,
passwords: [signature],
format: "binary",
});

// Convert the decrypted data to an ArrayBuffer
const response = new Response(decrypted.data as ReadableStream<Uint8Array>);
const arrayBuffer = await response.arrayBuffer();

return arrayBuffer;
}

--- app/utils/formatters/bytes.ts ---
export function formatBytes(bytes: number, decimals?: number) {
if (bytes == 0) return "0 Bytes";
var k = 1024,
dm = decimals ?? 0,
sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}