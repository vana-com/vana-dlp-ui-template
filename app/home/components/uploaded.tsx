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
