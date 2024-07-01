import { Stack, Title, Box, Button, Text, Alert } from "@mantine/core";
import { useFileStatus } from "@/app/hooks/useFileStatus";

export const Success = ({ fileId }: { fileId: number | null }) => {
  const { isFinalized, reward, isClaimable, isClaiming, claimReward, error } = useFileStatus(fileId);

  if (fileId === null) {
    return <Alert color="blue">Waiting for file upload to complete...</Alert>;
  }

  return (
    <Stack gap="lg">
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}
      <Box className="border-2" style={{ borderColor: "var(--mantine-color-brand-3-text)" }}>
        <Stack gap={0} align="center" p="lg" bg="brand-5">
          <Title order={5}>{isFinalized ? `${reward} tokens` : 'Verification in progress'}</Title>
          <Text>{isFinalized ? 'available for claim' : 'Please wait for verification'}</Text>
        </Stack>
      </Box>
      {isClaimable ? (
        <Button fullWidth color="brand-3" onClick={claimReward} loading={isClaiming}>
          Claim Reward
        </Button>
      ) : (
        <Button fullWidth color="brand-3" disabled>
          {isFinalized ? 'Reward Claimed' : 'Waiting for verification'}
        </Button>
      )}
    </Stack>
  );
};
