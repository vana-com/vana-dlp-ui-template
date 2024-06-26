# Vana DLP UI
This is a generic UI for uploading data to a Data Liquidity Pool (DLP). This app does the following:
1. Connect your EVM compatible wallet, which holds some $DAT
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
