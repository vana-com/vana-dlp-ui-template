"use client";

import { Icon } from "@iconify/react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMatches,
} from "@mantine/core";
import Link from "next/link";

export default function Home() {
  const titleSize = useMatches({
    base: 40,
    sm: 60,
    md: 72,
  });

  return (
    <section>
      <Box bg="brand-4" pos="relative">
        <Box pos="absolute" left="0" bottom={0} w="100%" visibleFrom="md">
          <Image src="/images/home/grass.png" alt="datadao" mah="100%" />
        </Box>
        <Box pos="absolute" left="0" top="-30px" h="120%" visibleFrom="md">
          <Image src="/images/home/bg-left.png" alt="datadao" mah="100%" />
        </Box>
        <Box pos="absolute" right="0" bottom={0} h="80%" visibleFrom="md">
          <Image src="/images/home/bg-right.png" alt="datadao" mah="100%" />
        </Box>
        <Container>
          <Stack
            align="center"
            pt={{ md: 100, base: 24 }}
            pb={{ md: 200, base: 24 }}
          >
            <Title
              order={1}
              ff="monospace"
              size={titleSize}
              ta="center"
              c="brand-3"
            >
              YOUR GPT DATA, <br />
              YOUR POWER
            </Title>

            <Box w={{ lg: 800, md: 600 }}>
              <Text size="lg" ta="center" fw="500">
                gpt data dao is the chatGPT data liquidity pool. Join with your
                chatGPT account and receive governance rights. Vote to sell the
                data to other AI companies, or vote to delete it if OpenAI open
                sources GPT-4
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Box bg="brand-7">
        <Container p={{ base: 40, md: 80 }}>
          <Grid gutter="xl">
            <Grid.Col span={{ sm: 5, xs: 12 }}>
              <Image
                src="/images/home/section-1.png"
                alt="datadao"
                mah="100%"
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 6, xs: 12 }} offset={{ sm: 1, xs: 0 }}>
              <Stack>
                <Title order={3}>
                  There’s a race for good conversational training data
                </Title>
                <Text>
                  Lorem ipsum dolor sit amet consectetur. In et eget mattis
                  magnis. Enim id sit eu nibh ac sollicitudin amet diam.
                  Senectus neque non sapien gravida. Dictum enim purus id risus.
                  Ultricies at nisl enim et curabitur. Quam tortor sed odio
                  fermentum nisl a. Dolor auctor sagittis duis sit diam lorem
                  enim convallis.
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Box pos="relative">
        <Flex
          pos="absolute"
          visibleFrom="sm"
          top={0}
          left={0}
          w="100%"
          h="100%"
        >
          <Box bg="brand-5" flex={1}></Box>
          <Box bg="brand-8" flex={1}></Box>
        </Flex>
        <Flex
          hiddenFrom="sm"
          bg="brand-5"
          pos="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
        ></Flex>
        <Container pos="relative">
          <Grid gutter={0}>
            <Grid.Col
              span={{ sm: 5, xs: 12 }}
              px={20}
              py={{ base: 20, sm: 80 }}
            >
              <Title order={3} fw="500">
                Break down walled gardens
              </Title>
              <Text>
                OpenAI is now everything it promised not to be: closed-source
                and for-profit. We want to continue to push the frontiers of AI
                research but ensure those benefits are widely distributed.
                Export your valuable data to push the frontier forward.
              </Text>
            </Grid.Col>
            <Grid.Col
              span={{ sm: 5, xs: 12 }}
              offset={{ sm: 2, xs: 0 }}
              px={20}
              py={{ base: 20, sm: 80 }}
            >
              <Title order={3} fw="500">
                Your data is exclusively yours
              </Title>
              <Text>
                After exporting your data, you can choose to revoke OpenAI’s
                access to train on your data, while keeping your conversation
                history. This gives the GPT data DAO a unique market position as
                the only entity that can permission out your chatGPT history for
                training.
              </Text>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Box bg="brand-1" component="footer">
        <Container>
          <Flex py="24" align="end" gap={{ base: 24, sm: "96" }} wrap={"wrap"}>
            <Stack gap="xs">
              <Text>SMART CONTRACT</Text>
              <Link href="#">
                <Group className="border-b border-black">
                  <Text fw="bold">
                    0xa2f96ef6ed3d67a0352e659b1e980f13e098619f
                  </Text>
                  <Icon icon="carbon:arrow-up-right" />
                </Group>
              </Link>
            </Stack>
            <Stack gap="xs">
              <Text>SOCIALS</Text>
              <Link href="#">
                <Group className="border-b border-black">
                  <Text fw="bold">X / TWITTER</Text>
                  <Icon icon="carbon:arrow-up-right" />
                </Group>
              </Link>
            </Stack>
            <Stack gap="xs">
              <Link href="#">
                <Group className="border-b border-black">
                  <Text fw="bold">Reddit</Text>
                  <Icon icon="carbon:arrow-up-right" />
                </Group>
              </Link>
            </Stack>
          </Flex>
        </Container>
      </Box>
    </section>
  );
}
