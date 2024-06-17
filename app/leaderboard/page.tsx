"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import Link from "next/link";

const elements = [
  {
    rank: 1,
    username: "0x12B45AfBD25F9d7C12c78100250B71F6c0D34f",
    points: 150,
    referralPoints: 35,
    totalPoints: 185,
  },
  {
    rank: 2,
    username: "0x7Be21fF37B1c38Ee12D12DaC69fC57f48C22e9",
    points: 120,
    referralPoints: 50,
    totalPoints: 170,
  },
  {
    rank: 3,
    username: "0xA45dDc60F324Ffe19eA0Dc23fdD28BcA2D2eAB",
    points: 180,
    referralPoints: 20,
    totalPoints: 200,
  },
  {
    rank: 4,
    username: "0x39Ef9f1231eCFc23fEd90fCB3a31BbBc1B3e11",
    points: 160,
    referralPoints: 25,
    totalPoints: 185,
  },
  {
    rank: 5,
    username: "0xBaB98aF76CCbeFeCadd8d5B1019E77FBf8DaaC",
    points: 140,
    referralPoints: 45,
    totalPoints: 185,
  },
  {
    rank: 6,
    username: "0x1Cd22B1aF65AE79CCe11aD9753Ed30A2d3eFf22",
    points: 135,
    referralPoints: 30,
    totalPoints: 165,
  },
  {
    rank: 7,
    username: "0xF5d13e1aBC18d12DDeeE12Cfa12Fb0DDc31AaF",
    points: 120,
    referralPoints: 55,
    totalPoints: 175,
  },
  {
    rank: 8,
    username: "0xEeF8Acce231bA19A12DbAd9A1D2b3Af2D1a9e9",
    points: 165,
    referralPoints: 40,
    totalPoints: 205,
  },
  {
    rank: 9,
    username: "0xFe2B3aDe8E23F3CdfB5F12B9dC2aCf11d3D33e",
    points: 155,
    referralPoints: 50,
    totalPoints: 205,
  },
  {
    rank: 10,
    username: "0xDeA11faCB2a9dd23AEDC4ba12f1ACa2d3c4Bde",
    points: 130,
    referralPoints: 35,
    totalPoints: 165,
  },
];

export default function Page() {
  const clipboard = useClipboard({ timeout: 2000 });

  const rows = elements.map((element) => (
    <Table.Tr key={element.username}>
      <Table.Td w={50}>#{element.rank}</Table.Td>
      <Table.Td>
        <Text truncate="end">{element.username}</Text>
      </Table.Td>
      <Table.Td fw={500}>{element.points}</Table.Td>
      <Table.Td fw={500}>{element.referralPoints}</Table.Td>
      <Table.Td fw={500} ta="right">
        {element.totalPoints}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container py={{ base: "16", sm: "72" }}>
      <Stack align="stretch" justify="center" gap="md">
        <Title order={3} ff="monospace" ta="center">
          Leaderboard
        </Title>
        <Box
          w="100%"
          className="border"
          style={{
            borderColor: "var(--mantine-color-brand-3-filled)",
            boxShadow: "0px 4px 0px 0px var(--mantine-color-brand-3-filled)",
          }}
          p={12}
        >
          <Grid align="stretch" grow>
            <Grid.Col span={{ base: 6, sm: 4 }}>
              <Flex
                direction="column"
                gap={0}
                justify="space-between"
                p={12}
                h="100%"
              >
                <Text size="sm" fw="bold" c="brand-2">
                  Total points
                </Text>
                <Box>
                  <Text size="xl" fw="bold">
                    12,450
                  </Text>
                  <Box>
                    <Link href="/claim">
                      <Button color="brand-3" size="xs">
                        Claim
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4 }}>
              <Flex
                direction="column"
                gap={0}
                justify="space-between"
                p={12}
                className="md:border-l md:border-r"
                h="100%"
              >
                <Text size="sm" fw="bold" c="brand-2">
                  Your rank
                </Text>
                <Box>
                  <Text size="xl" fw="bold">
                    12/12,000
                  </Text>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex
                direction="column"
                gap={0}
                justify="space-between"
                p={12}
                h="100%"
              >
                <Text size="sm" fw="bold" c="brand-2">
                  Referral link
                </Text>
                <Flex gap="sm">
                  <Flex
                    className="border rounded-md"
                    style={{
                      borderColor: "var(--mantine-color-brand-3-filled)",
                    }}
                    px="lg"
                    align="center"
                  >
                    <Text size="sm" fw="bold">
                      datadao.com/GHPECX
                    </Text>
                  </Flex>
                  <ActionIcon
                    variant="outline"
                    size="xl"
                    color={clipboard.copied ? "teal" : "brand-3"}
                    className="!rounded-md"
                    onClick={() => clipboard.copy("datadao.com/GHPECX")}
                    disabled={clipboard.copied}
                  >
                    {clipboard.copied ? (
                      <Icon icon="ph:check" fontSize={20} color="black" />
                    ) : (
                      <Icon icon="ph:copy-fill" fontSize={20} color="black" />
                    )}
                  </ActionIcon>
                </Flex>
              </Flex>
            </Grid.Col>
          </Grid>
        </Box>
        <Table.ScrollContainer minWidth={500} type="native">
          <Table highlightOnHover layout="auto">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={50}>
                  <Text fw="normal">Rank</Text>
                </Table.Th>
                <Table.Th>
                  <Text fw="normal" lineClamp={1}>
                    Username
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text fw="normal">Points</Text>
                </Table.Th>
                <Table.Th>
                  <Text fw="normal">Referral points</Text>
                </Table.Th>
                <Table.Th ta="right">
                  <Text fw="normal">Total points</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Container>
  );
}
