import { ProviderLabel, useStorageStore } from "@/app/core";
import { formatBytes } from "@/app/utils/formatters/bytes";
import { Button, Grid, Stack, Text } from "@mantine/core";

export const UploadedFileState = ({
  fileName,
  fileSize,
  onDownload,
}: {
  fileName: string;
  fileSize: number;
  onDownload(): void;
}) => {
  const provider = useStorageStore((store) => store.provider);

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
        </Stack>
      </Grid.Col>
      {provider && (
        <Grid.Col span="content">
          <Button variant="outline" color="brand-3" onClick={onDownload}>
            View on {ProviderLabel[provider]}
          </Button>
        </Grid.Col>
      )}
    </Grid>
  );
};
