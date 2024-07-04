"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Stack,
  Text,
  Title,
  Image,
  Alert,
  Group,
} from "@mantine/core";
import Link from "next/link";
import { Notification } from "@mantine/core";
import { Disclaimer } from "./components/disclaimer";

const instructions = [
  {
    number: 1,
    title: "Connect wallet to create account",
    description:
      "To create your account, click 'Connect' located at the top right corner of the screen and follow the instructions to connect your wallet.",
  },
  {
    number: 2,
    title: "Follow Your DLP's instructions",
    description:
      "For example, a ChatGPT DLP may ask you to open a new chat in ChatGPT, paste your wallet address into the message box, and send it. Then, request a download of your ChatGPT data.",
  },
  {
    number: 3,
    title: "Upload data and claim points",
    description:
      "Submit a data upload transaction here to claim your points",
  },
];

export default function Page() {
  return (
    <Container>
      <Grid>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Stack align="stretch" justify="center" gap="lg">
            <Title order={3} ff="monospace">
              Claim instructions
            </Title>
            <Disclaimer />
            {instructions.map((instruction, i) => (
              <Stack gap="sm" key={i}>
                <Text c="brand-2" fw="bold">
                  0{instruction.number}
                </Text>
                <Title order={6} c="brand-2">
                  {instruction.title}
                </Title>
                <Text fw="500">{instruction.description}</Text>
              </Stack>
            ))}
            <Flex justify="flex-end">
              <Link href="/claim/upload">
                <Button color="brand-3">Get started</Button>
              </Link>
            </Flex>
          </Stack>
        </Grid.Col>
        <Grid.Col span={5} offset={1} visibleFrom="md">
          <Image radius="md" src="/images/claim/instructions.png" />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
