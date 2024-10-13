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
