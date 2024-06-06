import { Stack, Title, Box, Button, Text } from "@mantine/core";

export const Success = () => {
  return (
    <Stack gap="lg">
      <Box
        className="border-2"
        style={{
          borderColor: "var(--mantine-color-brand-3-text)",
        }}
      >
        <Stack gap={0} align="center" p="lg" bg="brand-5">
          <Title order={5}>15,000 $gptdat</Title>
          <Text>available for claim</Text>
        </Stack>
      </Box>
      <Button fullWidth color="brand-3">
        Claim
      </Button>
    </Stack>
  );
};
