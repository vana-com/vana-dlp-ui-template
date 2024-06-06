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
                src={null}
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
                Lorem ipsum dolor sit amet consectetur. Etiam et nullam ac eget
                nulla fringilla arcu ut. Massa viverra egestas varius.
              </Text>
              <Box>
                <Stack gap={0} align="center" p="lg" bg="brand-5">
                  <Title order={5}>15,000 $gptdat</Title>
                  <Text>available for claim</Text>
                </Stack>
              </Box>
              <Button fullWidth color="brand-3">Claim</Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
