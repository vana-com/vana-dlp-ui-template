import { Stack, Title, Box, Button, Text } from "@mantine/core";
import { useFileStatus } from "@/app/hooks/useFileStatus";

export const Success = ({ fileId }: { fileId: number }) => {
  const { isFinalized, reward, isClaimable, isClaiming, claimReward } = useFileStatus(fileId);

  return (
    <Stack gap="lg">
      <Box className="border-2" style={{ borderColor: "var(--mantine-color-brand-3-text)" }}>
        <Stack gap={0} align="center" p="lg" bg="brand-5">
          <Title order={5}>{isFinalized ? `${reward} $DAT` : 'Verification in progress'}</Title>
          <Text>{isFinalized ? 'available for claim' : 'Please wait for verification'}</Text>
        </Stack>
      </Box>
      {isClaimable ? (
        <Button fullWidth color="brand-3" onClick={claimReward} loading={isClaiming}>
          Claim Reward
        </Button>
      ) : (
        <Button fullWidth color="brand-3" disabled={!isFinalized}>
          {isFinalized ? 'Reward Claimed' : 'Waiting for verification'}
        </Button>
      )}
    </Stack>
  );
};