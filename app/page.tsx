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
  Notification,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NotificationData, notifications } from "@mantine/notifications";
import { ethers, EventLog } from "ethers";
import React, { useEffect, useState } from "react";
import DataLiquidityPoolABI from "@/app/contracts/DataLiquidityPoolLightImplementation.json";
import TeePoolImplementationABI from "@/app/contracts/TeePoolImplementation.json";
import DataRegistryImplementationABI from "@/app/contracts/DataRegistryImplementation.json";
import { ConnectStep } from "./home/components/connect";
import { UploadState } from "./home/components/upload";
import { UploadingState } from "./home/components/uploading";
import { config } from "@/app/config";
import { UploadedFileState } from "@/app/home/components/uploaded";
import * as eccrypto from "@toruslabs/eccrypto";

import { DataLiquidityPoolImplementation, TeePoolImplementation, DataRegistryImplementation } from "@/app/typechain-types";

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

  const encryptWithMasterKey = async (data: string, masterKey: string): Promise<string> => {
    const publicKeyBytes = Buffer.from(masterKey.startsWith("0x") ? masterKey.slice(2) : masterKey, "hex");
    const uncompressedKey = publicKeyBytes.length === 64 ? Buffer.concat([Buffer.from([4]), publicKeyBytes]) : publicKeyBytes;

    const encryptedBuffer = await eccrypto.encrypt(uncompressedKey, Buffer.from(data));
    const encryptedHex = Buffer.concat([encryptedBuffer.iv, encryptedBuffer.ephemPublicKey, encryptedBuffer.ciphertext, encryptedBuffer.mac]).toString("hex");
    return encryptedHex;
  };

  const getTeeDetails = async (
    teePoolContract: TeePoolImplementation,
    jobId: number
  ) => {
    try {
      const job = await teePoolContract.jobs(jobId as any) as any;
      const teeInfo = await teePoolContract.tees(job.teeAddress);

      return { ...job, teeUrl: teeInfo.url };
    } catch (error) {
      console.error("Error fetching job details:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to fetch job details. Please try again.",
      } as NotificationData);
      throw error;
    }
  };

  const fileJobIds = async (
    teePoolContract: TeePoolImplementation,
    fileId: number
  ) => {
    try {
      const jobIds = await teePoolContract.fileJobIds(fileId as any);
      return jobIds.map(Number);
    } catch (error) {
      console.error("Error fetching file job IDs:", error);
      throw error;
    }
  };

  const teeJobIdsPaginated = async (
    teePoolContract: TeePoolImplementation,
    teeAddress: string,
    start: number,
    end: number
  ) => {
    try {
      const jobIds = await teePoolContract.teeJobIdsPaginated(
        teeAddress as any,
        start as any,
        end as any
      );
      return jobIds.map(Number);
    } catch (error) {
      console.error("Error fetching paginated TEE job IDs:", error);
      throw error;
    }
  };

  const handleError = (message: string) => {
    notifications.show({
      color: "red",
      title: "Error",
      message,
    } as NotificationData)
  };

  const handleSetFile = async (file: File | null) => {
    try {
      if (!walletAddress) {
        await connect();
      }
    } catch (error) {
      setUploadState("initial");
      handleError("Error connecting wallet. Please try again.");
    }

    setFile(file);
  };

  const handleFileUpload = async (file: File) => {
    if (!walletAddress) {
      setUploadState("initial");
      handleError("Wallet address not found. Please connect your wallet.");
      console.error("Wallet address not found");
      return;
    }

    try {
      setUploadState("loading");
      appendStatus(`Doing a client side file signing, asking user to sign the message to create a deterministic signature...`);
      const signature = await signMessage(walletAddress, FIXED_MESSAGE);
      console.log("Signature:", signature);
      appendStatus(`Signature created: '${signature}'`);

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

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const dlpContract = new ethers.Contract(
        contractAddress,
        DataLiquidityPoolABI.abi,
        signer
      ) as unknown as DataLiquidityPoolImplementation;

      const dataRegistryContract = new ethers.Contract(
        dataRegistryContractAddress,
        DataRegistryImplementationABI.abi,
        signer
      ) as unknown as DataRegistryImplementation;

      const teePoolContract = new ethers.Contract(
        teePoolContractAddress,
        TeePoolImplementationABI.abi,
        signer
      ) as unknown as TeePoolImplementation;

      const masterKey = await dlpContract.masterKey();
      console.log("Master Key:", masterKey);

      const encryptedKey = await encryptWithMasterKey(signature, masterKey);
      console.log(`encryptedKey: '${encryptedKey}'`);

      appendStatus("Adding file to DataRegistry contract with permissions. Requesting user for permission...");
      const permissions = [
        {
          account: contractAddress,
          key: encryptedKey
        }
      ];
      const tx = await dataRegistryContract.addFileWithPermissions(
        encryptedDataUrl as any,
        walletAddress as any,
        permissions as any
      );
      const receipt = await tx.wait();
      console.log("File added with permissions, transaction receipt:", receipt?.hash);
      if (receipt && receipt.logs.length > 0) {
        const eventLog = receipt.logs[0] as EventLog;

        // Check if the event is the one we're expecting
        if (eventLog.topics[0] === ethers.id("FileAdded(uint256,address,string)")) {
          const decodedLog = dataRegistryContract.interface.parseLog({
            topics: eventLog.topics,
            data: eventLog.data,
          });

          if (decodedLog && decodedLog.args) {
            const fileId = decodedLog.args[0];
            const owner = decodedLog.args[1];
            const url = decodedLog.args[2];

            console.log("File ID:", fileId);
            console.log("Owner:", owner);
            console.log("URL:", url);

            setFileId(Number(fileId));
          }
        }
      }
      appendStatus(`File added to DataRegistry contract with permissions, file id is '${fileId}'. Requesting TEE fees from the TeePool contract...`);

      setUploadState("done");
      console.log(`File uploaded with ID: ${fileId}`);

      const teeFee = await teePoolContract.teeFee();
      const teeFeeInVana = ethers.formatUnits(teeFee, 18);
      appendStatus(`TEE fee fetched: ${teeFeeInVana} VANA for running the contribution proof on the TEE`);

      appendStatus(`Requesting contribution proof from TEE for FileID: ${fileId}...`);
      const contributionProofTx = await teePoolContract.requestContributionProof(
        fileId as any,
        { value: teeFee } as any
      );
      const contributionProofReceipt = await contributionProofTx.wait();
      appendStatus(`Contribution proof requested. Transaction hash: ${contributionProofReceipt?.hash}`);

      const jobIds = await fileJobIds(teePoolContract, fileId as number);
      const latestJobId = jobIds[jobIds.length - 1] as number;
      appendStatus(`Latest JobID for FileID ${fileId}: ${latestJobId}`);

      const jobDetails = await getTeeDetails(teePoolContract, latestJobId);
      appendStatus(`Job details retrieved for JobID ${latestJobId}`);

      console.log("Job Details:", jobDetails);
      console.log(
        "TODO: Implement query to TEE Attestation URL:",
        jobDetails.teeUrl
      );

      appendStatus(`Sending contribution proof request to TEE`);

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

      const requestClaimTx = await dlpContract.requestReward(fileId as any, 1 as any);
      await requestClaimTx.wait();
      console.log("Claim requested successfully");

      setUploadState("done");
      appendStatus("Reward received successfully");
    } catch (error) {
      console.error("Error encrypting and uploading file:", error);
      setUploadState("initial");
      appendStatus("Error: Failed to encrypt and upload file");
      handleError("Failed to encrypt and upload file. Please try again.");
    }
  };

  const handleDownload = async () => {
    if (!shareUrl) return;

    window.open(shareUrl, "_blank");
  };

  useEffect(() => {
    if (!file) return;

    handleFileUpload(file).then(() => {
      console.log("File upload complete");
    });
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