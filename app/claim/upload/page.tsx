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
import { Carousel } from "@mantine/carousel";
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
import Autoplay from "embla-carousel-autoplay";
import { ethers } from "ethers";
import * as openpgp from "openpgp";
import { useEffect, useRef, useState } from "react";
import DataLiquidityPool from "./../../contracts/DataLiquidityPoolLightImplementation.json";
import TeePoolImplementation from "./../../contracts/TeePoolImplementation.json";
import DataRegistryImplementation from "@/app/contracts/DataRegistryImplementation.json";
import { ConnectStep } from "./components/connect";
import { Success } from "./components/success";
import { UploadState } from "./components/upload";
import { UploadedFileState } from "./components/uploaded";
import { UploadingState } from "./components/uploading";
import { Disclaimer } from "../components/disclaimer";

const FIXED_MESSAGE = "Please sign to retrieve your encryption key";

type JobSubmittedListener = (
  jobId: ethers.BigNumberish,
  fileId: ethers.BigNumberish,
  bidAmount: ethers.BigNumberish,
  event: any
) => void;

export default function Page() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const storageProvider = useStorageStore((state) => state.provider);
  const contractAddress = useNetworkStore((state) => state.contract);
  const dataRegistryContractAddress = useNetworkStore(
    (state) => state.dataRegistryContract
  );
  const teePoolContractAddress = useNetworkStore(
    (state) => state.teePoolContract
  );
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

  const [jobId, setJobId] = useState<number | null>(null);
  const [teeDetails, setTeeDetails] = useState<any | null>(null);
  const eventListenerRef = useRef<JobSubmittedListener | null>(null);

  const listenForJobSubmittedEvent = (
    teePoolContract: ethers.Contract
  ): Promise<any> => {
    return new Promise((resolve) => {
      // Remove previous listener if it exists
      if (eventListenerRef.current) {
        teePoolContract.off("JobSubmitted", eventListenerRef.current);
      }

      // Create new listener
      const listener: JobSubmittedListener = async (
        jobId,
        fileId,
        bidAmount,
        event
      ) => {
        console.log(
          `New job submitted: JobID ${jobId}, FileID ${fileId}, Bid Amount ${bidAmount}`
        );
        const jobIdNumber = Number(jobId);
        setJobId(jobIdNumber);
        const details = await getTeeDetails(teePoolContract, jobIdNumber);
        resolve(details);
      };

      // Set up the event listener
      teePoolContract.on("JobSubmitted", listener);

      // Store the listener reference for future cleanup
      eventListenerRef.current = listener;
    });
  };

  const getTeeDetails = async (
    teePoolContract: ethers.Contract,
    jobId: number
  ) => {
    try {
      const details = await teePoolContract.jobTee(jobId);
      setTeeDetails(details);
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
      // Sign a fixed message with the user's wallet to create a deterministic signature
      const signature = await signMessage(walletAddress, FIXED_MESSAGE);
      console.log("Signature:", signature);

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

      // Initialize contracts
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
      const dataRegsitryContract = new ethers.Contract(
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

      // User adds file to the DataRegistry contract by calling addFile(encryptedDataUrl)
      const tx = await dataRegsitryContract.addFile(encryptedDataUrl);
      const receipt = await tx.wait();
      console.log("File added, transaction receipt:", receipt.hash);

      // Get file id from receipt transaction log
      const log = receipt.logs[0];
      const fileId = Number(log.args[0]);
      console.log("File ID:", fileId);
      setFileId(fileId);

      setUploadState("done");
      console.log(`File uploaded with ID: ${fileId}`);

      // TEE Proof
      const teeFee = await teePoolContract.teeFee();
      console.log("TEE Fee:", teeFee.toString());

      // Start listening for JobSubmitted event
      const teeDetailsPromise = listenForJobSubmittedEvent(teePoolContract);

      // Request contribution proof from a TEE. This starts the validation process on the TEE
      const contributionProofTx =
        await teePoolContract.requestContributionProof(fileId, {
          value: ethers.parseUnits(teeFee.toString(), 18),
        });
      await contributionProofTx.wait();
      console.log("Contribution proof requested");

      // Wait for the TEE details to be received
      const teeDetails = (await teeDetailsPromise) as any;

      // Once user gets TeeDetails, user can send a GET request to the /attestation endpoint of the TEE to get the attestation using url from TeeDetails
      console.log("TEE Details:", teeDetails);
      console.log(
        "TODO: Implement query to TEE Attestation URL:",
        teeDetails.url
      );
      // TODO: Fix this: we use a delay here to wait for setJobId(x) in the listener to complete.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Implement the GET request to the TEE attestation endpoint
      console.log(
        `TODO: Implement GET request to TEE attestation endpoint ${teeDetails.url}/attestation`
      );
      // const attestationResponse = await fetch(`${teeDetails.url}/attestation`);
      // const attestationData = await attestationResponse.json();
      // console.log("Attestation data:", attestationData);

      // User Verify TEE attestation and safety retrieved from the GET call above
      // TODO: Implement attestation verification logic here

      // User Sends POST request to TEE /contribution-proofs endpoint with fileId and encryptedFileKey
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
            encryption_key: signature,
            proof_url:
              "https://github.com/vana-com/vana-satya-proof-template/releases/download/v22/gsc-my-proof-22.tar.gz",
            encryption_seed: "Please sign to retrieve your encryption key",
            env_vars: {
              USER_EMAIL: "user123@gmail.com",
            },
          }),
        }
      );
      const contributionProofData = await contributionProofResponse.json();
      console.log("Contribution proof response:", contributionProofData);

      // User now authorize DLPLight contract to access the file data by calling addFilePermission(fileId, walletAddress, encryptedKey)
      const authorizeTx = await dataRegsitryContract.addFilePermission(
        fileId,
        contractAddress,
        encryptedKey
      );
      await authorizeTx.wait();
      console.log(`File permission added for contract ${contractAddress}`);

      // After that user calls requestClaim(fileId) on the DLP contract to request the claim
      const requestClaimTx = await dlpLightContract.addFile(fileId);
      await requestClaimTx.wait();
      console.log("Claim requested successfully");

      setUploadState("done");

      // DLP contract will get the file from the DataRegistry contract by calling getFile(fileId) and get back encryptedDataUrl, encryptedKey and proof
      // DLP contract decrypts the file using the encryptedKey and verifies the proof and file hash and calculates the reward
      // DLP contract issues DLP token as a reward
    } catch (error) {
      console.error("Error encrypting and uploading file:", error);
      setUploadState("initial");
      handleError();
    }
  };

  // const handleOpenDropbox = async () => {
  //   const folderLink = `https://www.dropbox.com/home/${config.dropboxFolderName}`;
  //   window.open(folderLink, "_blank");
  // };

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
          <Grid.Col span={{ sm: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <Stack align="stretch" justify="center" gap="lg">
              <Title order={3} ff="monospace">
                Instructions
              </Title>
              <Disclaimer />
              <InstructionsGallery />
              <Stack gap="sm">
                <Text fw="500" size="md">
                  1. Navigate to your account and open settings.
                </Text>
                <Text fw="500" size="md">
                  2. Open the Data Controls tab and click on "Export".
                </Text>
                <Text fw="500" size="md">
                  3. You will receive an email to download your data.
                </Text>
                <Text fw="500" size="md">
                  4. Please upload this data file on the right.
                </Text>
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col
            span={4}
            offset={{ sm: 0, md: 1 }}
            pt={{ sm: 0, md: 50 }}
            order={{ base: 1, md: 2 }}
          >
            <Stack gap="md">
              <Title order={5}>
                {uploadState === "done" ? "Congratulations" : "Upload data"}
              </Title>

              {uploadState === "initial" && !isDropboxConnected && (
                <ConnectStep />
              )}

              {uploadState === "initial" && isDropboxConnected && (
                <UploadState onSetFile={handleSetFile} />
              )}

              {uploadState === "loading" && file && (
                <UploadingState fileName={file.name} fileSize={file.size} />
              )}

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

              <Dialog opened={opened} onClose={close} size="lg" p={0}>
                <Notification color="red">
                  There was an error trying to encode your file. Please make
                  sure you have a wallet connected and try again.
                </Notification>
              </Dialog>

              {uploadState === "done" && fileId && <Success fileId={fileId} />}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}

const InstructionsGallery = () => {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const slides = new Array(10).fill(null).map((_, idx) => {
    const url = `/images/claim/instructions_${idx + 1}.png`;
    return (
      <Carousel.Slide key={url}>
        <Image src={url} />
      </Carousel.Slide>
    );
  });

  return (
    <Paper shadow="xs" p="sm" radius={10}>
      <Carousel
        withIndicators
        loop
        controlSize={40}
        color="brand-3"
        classNames={{ control: "!bg-white" }}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {slides}
      </Carousel>
    </Paper>
  );
};
