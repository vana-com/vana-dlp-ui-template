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
