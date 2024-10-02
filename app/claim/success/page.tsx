"use client";

import {
  Box,
  Container,
  Grid,
  Image,
  Stack,
  Title,
  Text,
  Button,
} from "@mantine/core";

export default function Page() {
  return (
    <Box>
      <Container>
        <Grid gutter="lg" grow>
          <Grid.Col span={{ sm: 12, md: 5 }} order={{ base: 2, md: 1 }}>
            <Stack align="stretch" justify="center" gap="md">
              <Image
                radius="md"
                src="/images/claim/instructions.png"
                fallbackSrc="https://placehold.co/600x600?text=Placeholder"
              />
            </Stack>
          </Grid.Col>
          <Grid.Col
            span={5}
            offset={{ sm: 0, md: 2 }}
            pt={{ sm: 0, md: 50 }}
            order={{ base: 1, md: 2 }}
          >
            <Stack gap="lg">
              <Title order={5}>Congratulations</Title>
              <Text>
                You have successfully uploaded your encrypted data to the Data
                Liquidity Pool.
              </Text>
              <Box>
                <Stack gap={0} align="center" p="lg" bg="brand-5">
                  <Title order={5}>15,000 tokens</Title>
                  {/*<Text>available for claim</Text> */}
                </Stack>
              </Box>
              <Button fullWidth color="brand-3" disabled>
                Claim (coming soon)
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
