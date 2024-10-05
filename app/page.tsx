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
import * as openpgp from "openpgp";
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

const FIXED_MESSAGE = "Please sign to retrieve your encryption key";

type JobSubmittedListener = (
  jobId: ethers.BigNumberish,
  fileId: ethers.BigNumberish,
  bidAmount: ethers.BigNumberish,
  event: any
) => void;

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

  const TIMEOUT_DURATION = 120000; // 120 seconds timeout

  const listenForJobSubmittedEvent = (
    teePoolContract: ethers.Contract,
    expectedFileId: number
  ): { promise: Promise<{ jobId: number; teeDetails: any }>; stopListening: () => void } => {
    let resolvePromise: (value: { jobId: number; teeDetails: any }) => void;
    let rejectPromise: (reason?: any) => void;
    let timeoutId: NodeJS.Timeout;

    const promise = new Promise<{ jobId: number; teeDetails: any }>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    const listener = async (jobId: ethers.BigNumberish, fileId: ethers.BigNumberish, bidAmount: ethers.BigNumberish, event: any) => {
      console.log(`Event received: JobID ${jobId}, FileID ${fileId}, Bid Amount ${bidAmount}`);
      appendStatus(`Event received: JobID ${jobId}, FileID ${fileId}, Bid Amount ${bidAmount}`);

      if (Number(fileId) === expectedFileId) {
        clearTimeout(timeoutId);
        teePoolContract.off("JobSubmitted", listener);

        const jobIdNumber = Number(jobId);
        try {
          const details = await getTeeDetails(teePoolContract, jobIdNumber);
          resolvePromise({ jobId: jobIdNumber, teeDetails: details });
        } catch (error: any) {
          console.error("Error fetching TEE details:", error);
          appendStatus(`Error fetching TEE details: ${error.message}`);
          rejectPromise(error);
        }
      } else {
        console.log(`Received event for different file ID. Expected: ${expectedFileId}, Received: ${fileId}`);
        appendStatus(`Received event for different file ID. Expected: ${expectedFileId}, Received: ${fileId}`);
      }
    };

    teePoolContract.on("JobSubmitted", listener);
    appendStatus(`Started listening for JobSubmitted event for FileID: ${expectedFileId}`);

    timeoutId = setTimeout(() => {
      teePoolContract.off("JobSubmitted", listener);
      const timeoutError = new Error("Timeout waiting for JobSubmitted event");
      appendStatus(`Error: ${timeoutError.message}`);
      rejectPromise(timeoutError);
    }, TIMEOUT_DURATION);

    const stopListening = () => {
      clearTimeout(timeoutId);
      teePoolContract.off("JobSubmitted", listener);
    };

    return { promise, stopListening };
  };

  const getTeeDetails = async (
    teePoolContract: ethers.Contract,
    jobId: number
  ) => {
    try {
      const details = await teePoolContract.jobTee(jobId);
      console.log("TEE Details:", details);
      return details;
    } catch (error) {
      console.error("Error fetching TEE details:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to fetch TEE details. Please try again.",
      });
      throw error;
    }
  };

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

      // Encrypt the signature (symmetric key) using the DLP public key
      if (!publicKeyBase64) {
        setUploadState("initial");
        console.error("Public key not found in config");
        throw new Error("Public key not found in config");
      }

      const publicKey = await openpgp.readKey({
        armoredKey: atob(publicKeyBase64),
      });
      const encryptedSignature = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: signature }),
        encryptionKeys: publicKey,
        format: "armored",
      });

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

      // Get base64 encoded signature
      const encryptedKey = btoa(encryptedSignature as string);

      // User adds file to the DataRegistry contract and sets permissions in one transaction
      appendStatus("Adding file to DataRegistry contract with permissions. Requesting user for permission...");
      const permissions = [
        {
          account: contractAddress,
          key: encryptedKey
        }
      ];
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
      const teeFee = await teePoolContract.teeFee();
      const teeFeeInVana = ethers.formatUnits(teeFee, 18);
      appendStatus(`TEE fee fetched: ${teeFeeInVana} VANA for running the contribution proof on the TEE`);

      appendStatus(`Starting to listen for JobSubmitted event for FileID: ${fileId}`);
      const { promise: jobSubmittedPromise, stopListening } = listenForJobSubmittedEvent(teePoolContract, fileId);

      appendStatus(`Requesting contribution proof from TEE for FileID: ${fileId}...`);
      const contributionProofTx = await teePoolContract.requestContributionProof(fileId, {
        value: teeFee,
      });
      const contributionProofReceipt = await contributionProofTx.wait();
      appendStatus(`Contribution proof requested. Transaction hash: ${contributionProofReceipt.hash}`);

      appendStatus(`Waiting for JobSubmitted event from TEE Pool contract...`);
      const { jobId, teeDetails } = await jobSubmittedPromise;

      appendStatus(`JobSubmitted event received. JobID: ${jobId}`);

      console.log("TEE Details:", teeDetails);
      console.log(
        "TODO: Implement query to TEE Attestation URL:",
        teeDetails.url
      );

      // Implement the GET request to the TEE attestation endpoint
      console.log(
        `TODO: Implement GET request to TEE attestation endpoint ${teeDetails.url}/attestation`
      );

      // User Sends POST request to TEE /contribution-proofs endpoint with fileId and encryptedFileKey
      appendStatus(`Sending contribution proof request to TEE`);

      // TODO: Move to separate function
      const contributionProofResponse = await fetch(
        `${teeDetails.url}/RunProof`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: jobId,
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
              OPENAI_API_KEY: "5995fd35703fe232de27b759abe4d7f1b6f8bd97b97edd7432e3198d680870433ef3c2a4f85835fce07f6b9dee3987d7061f562c87cc446aba578cacf26ede463867c98d8a6622056c038ad42665ed26c2c7f9c5f0fe9b71c038ae9b170ddb642a633d0c3e47aec32017ab298a313c629014374883fd4267b338ca5dbde2ff5734e90fc441d37a3d6983fde2a169b1a4b0cf3fefeeba0951d5d2d2f3047e781427e7ae78baacd30aeaa7dbf12c9834825ffa34a94ecac569a08586c50facd00e80e112555e8338312b044e6889b8096c8d7fff8179c5e4f0f54d8b01cbaa0d579f6bfc4edac14cb3955b8a8cf8041d8e6f3111925030e1c9ed814ecc41d468172967b4e15e87ac76cb93d987651c4b106e596af78cd9803410bad580cd2b0adc2c8982c6380cc25a79ce085f73c2194d181a403f8162909c2e871007f717f85979e6232aa6162f91b6f3f796c2f47b00607f12c75e51ed8ec34fe772b571f5cd5dbc2f36525af0d86b6627296a4ead12c3d4b34a8512a2737023f5186b8d0963",
              TWITTER_PASSWORD: "79a076686d33878f1a11ef62218266e51e9b17eb3e2c1485ebc1cf3b775a5dd93dc585cddeea975e4f0082310dca5630b0ca68abeb82eb4c46f486b7a9e297f2113815c11ff6ec52d11fc0f08e8e0c625b76490dcbd07e2994e9a0781d26672cd7e96c117ebb511e82e55fae5af25e21f83f14d007135823199eede5cee11aad5080bd0ec63e3885f93278baaca44bb6804429854344edb083b980d7643c37d7e59b8dcad81814b7e127b88b32d166eec3e4150fb0b30d674232b5005439163462b7c1ab14d225f50b570f10f8b5953a2db3042899bae7215c4ee5ee9905d05feebe3b9b06577189ca06f3fc583d891e40dc732cbc82e5712b5396c57e56275c66ebc75c722495a4119cb41c79c8323bb6eccb9c30129c81d00e8b369fb01b32c78c238c7f0d917786c6fecb0749535387076da39a061b3b2b131e91685b983fedc2c0c52a77dd92f71955af5f762999223d44919e2380000cfe0ef05a0bc50cc4aae808b56eaa9a2eed2c71f3137cf7b47173a7f6172ab5f75012ee46e0109b"
            }
          }),
        }
      );
      const contributionProofData = await contributionProofResponse.json();
      console.log("Contribution proof response:", contributionProofData);
      appendStatus(`Contribution proof response received from TEE. Requesting a reward...`);

      // After that user calls requestClaim(fileId) on the DLP contract to request the claim
      const requestClaimTx = await dlpLightContract.requestReward(fileId, 1);
      await requestClaimTx.wait();
      console.log("Claim requested successfully");

      setUploadState("done"); // TODO: Is this needed?
      appendStatus("File added successfully to DLP contract, awaiting for DLP contract to validate the file and send the reward");


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

              {uploadState === "initial" && !isDropboxConnected && <ConnectStep />}

              {uploadState === "initial" && isDropboxConnected && <UploadState onSetFile={handleSetFile} />}

              {uploadState === "loading" && file && <UploadingState fileName={file.name} fileSize={file.size} />}

              {uploadState === "done" &&
                encryptedFile &&
                uploadedFileMetadata && (
                  <UploadedFileState
                    fileName={uploadedFileMetadata.name ?? "encrypted_file"}
                    fileSize={uploadedFileMetadata.size ?? encryptedFile.size}
                    fileId={fileId}
                    onDownload={handleDownload}
                  />
                )}

              {statusLog.length > 0 && (
                <Stack gap="md">
                  <Title order={6}>Status Log:</Title>
                  <Paper p="sm">
                    {statusLog.map((status, index) => (
                      <Text key={index} mb={6}>— {status}</Text>
                    ))}
                  </Paper>
                </Stack>
              )}

              <Dialog opened={opened} onClose={close} size="lg" p={0}>
                <Notification color="red">
                  There was an error trying to encode your file. Please make
                  sure you have a wallet connected and try again.
                </Notification>
              </Dialog>

              {/*{uploadState === "done" && fileId && <Success fileId={fileId} />}*/}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}