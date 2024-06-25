"use client";

import {
  FileMetadata,
  getShareLink,
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
import DataLiquidityPool from "../contracts/DataLiquidityPool.json";
import { ConnectStep } from "./upload/components/connect";
import { Success } from "./upload/components/success";
import { UploadState } from "./upload/components/upload";
import { UploadedFileState } from "./upload/components/uploaded";
import { UploadingState } from "./upload/components/uploading";
import { Disclaimer } from "./components/disclaimer";

const FIXED_MESSAGE = "Please sign to retrieve your encryption key";

export default function Page() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const storageProvider = useStorageStore((state) => state.provider);
  const contractAddress = useNetworkStore((state) => state.contract);
  const dropboxToken = useStorageStore((state) => state.token);
  const publicKeyBase64 = useNetworkStore((state) => state.publicKeyBase64);
  const isDropboxConnected = !!dropboxToken;

  const [opened, { close }] = useDisclosure(false);

  const [uploadState, setUploadState] = useState<
    "initial" | "loading" | "done"
  >("initial");

  const [uploadedFileMetadata, setUploadedFileMetadata] =
    useState<FileMetadata | null>(null);

  const walletAddress = useWalletStore((state) => state.walletAddress);
  const { connect } = useConnectWallet();

  const [file, setFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);

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
      const shareUrl = await getShareLink(
        dropboxToken,
        uploadedFileMetadata.id,
        storageProvider
      );

      console.log("Share url:", shareUrl);

      setShareUrl(shareUrl);

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

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractABI = [...DataLiquidityPool.abi];
      const contract = new ethers.Contract(
        contractAddress as string,
        contractABI,
        signer
      );

      // Get base64 encoded signature
      const encryptedKey = btoa(encryptedSignature as string);
      const tx = await contract.addFile(shareUrl, encryptedKey);
      await tx.wait();
      console.log(`Share url added to the smart contract`);
    } catch (error) {
      console.error("Error encrypting file:", error);
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
              <Image radius="md" h={200} src="/images/not_hotdog.png" />

              <Stack gap="sm">
                <Text fw="500" size="md">
                  1. Find or take a photo of a hotdog
                </Text>
                <Text fw="500" size="md">
                  2. Upload it to the DLP
                </Text>
                <Text fw="500" size="md">
                  3. Get rewarded in $hotdog
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
                {uploadState === "done" ? "Congratulations" : "Upload your hotdog photo"}
              </Title>

              {uploadState === "done" && (
                <Text>
                  The file has been validated successfully. You are eligible to
                  claim your rewards
                </Text>
              )}

              {uploadState === "initial" && !isDropboxConnected && (
                <ConnectStep />
              )}

              {uploadState === "initial" && isDropboxConnected && (
                <UploadState onSetFile={handleSetFile} />
              )}

              {uploadState === "loading" && file && (
                <UploadingState fileName={file.name} fileSize={file.size} />
              )}

              {uploadState === "done" && encryptedFile && (
                <UploadedFileState
                  fileName={uploadedFileMetadata?.name ?? "encrypted_file"}
                  fileSize={uploadedFileMetadata?.size ?? encryptedFile.size}
                  onDownload={handleDownload}
                />
              )}

              <Dialog opened={opened} onClose={close} size="lg" p={0}>
                <Notification color="red">
                  There was an error trying to encode your file. Please make
                  sure you have a wallet connected and try again.
                </Notification>
              </Dialog>

              {encryptedFile && <Success />}
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
