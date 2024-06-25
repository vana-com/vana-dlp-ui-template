"use client";

import { useConnectWallet, useNetworkStore, useWalletStore } from "@/app/core";
import { Icon } from "@iconify/react";
import {
  AppShell,
  Badge,
  Burger,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  SelectProps,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SettingsButton } from "./settings-button";

const links: { title: string; href: string }[] = [];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const network = useNetworkStore((state) => state.network);
  const setNetwork = useNetworkStore((state) => state.setNetwork);

  const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure();
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const { connect, disconnect } = useConnectWallet();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  useEffect(() => {
    if (sidebarOpened) {
      toggleSidebar();
    }
  }, [pathname]);

  const renderSelectOption: SelectProps["renderOption"] = ({ option }) => {
    if (option.value === "testnet") {
      return option.label;
    }

    return (
      <Group flex="1" gap="xs">
        {option.label}
        <Badge size="sm" variant="light" color="dark">
          Coming Soon
        </Badge>
      </Group>
    );
  };

  // if query string contains `internal`, show internal features
  let showInternalFeatures = false;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    showInternalFeatures = urlParams.has("internal");
  }

  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !sidebarOpened },
      }}
    >
      <AppShell.Header bg="brand-1">
        <Container h="100%">
          <Group h="100%" align="center">
            <Group justify="space-between" w="100%">
              <Group>
                <Burger
                  opened={sidebarOpened}
                  onClick={toggleSidebar}
                  hiddenFrom="sm"
                  size="sm"
                  color="brand-4"
                />

                <Flex pos="relative" dir="row" align="center" gap="sm">
                  <Link href="/">
                    <Title order={5} ff="monospace">
                      <Badge color="red" variant="light" size="xxl">
                        hot dog DLP
                      </Badge>
                    </Title>
                  </Link>
                </Flex>

                <Group ml="lg" gap={0} visibleFrom="sm">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <UnstyledButton
                        p={12}
                        c={isActive(link.href) ? "brand-4" : undefined}
                      >
                        <Text size="sm" fw="bold">
                          {link.title}
                        </Text>
                      </UnstyledButton>
                    </Link>
                  ))}
                </Group>
              </Group>

              <Group>
                {walletAddress ? (
                  <Button
                    variant="outline"
                    color="brand-3"
                    onClick={disconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    color="brand-3"
                    // onClick={handleOpenLogin}
                    onClick={connect}
                  >
                    Connect
                  </Button>
                )}
                <SettingsButton />
                <Menu shadow="md" width={250}>
                  <Menu.Target>
                    <UnstyledButton>
                      <Badge color="green" variant="light" size="lg">
                        {network as string}
                      </Badge>
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Network</Menu.Label>
                    {showInternalFeatures && <Menu.Item
                      onClick={() => setNetwork("moksha")}
                      leftSection={
                        network === "moksha" && (
                          <Icon icon="carbon:checkmark" />
                        )
                      }
                    >
                      Moksha Testnet
                    </Menu.Item>}
                    <Menu.Item
                      onClick={() => setNetwork("satori")}
                      leftSection={
                        network === "satori" && (
                          <Icon icon="carbon:checkmark" />
                        )
                      }
                    >
                      Satori Testnet
                    </Menu.Item>
                    <Menu.Item
                      disabled
                      onClick={() => setNetwork("mainnet")}
                      leftSection={
                        network === "mainnet" && (
                          <Icon icon="carbon:checkmark" />
                        )
                      }
                    >
                      <Group flex="1" gap="xs">
                        Vana Mainnet
                        <Badge size="sm" variant="light" color="dark">
                          Coming Soon
                        </Badge>
                      </Group>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="default"
                fullWidth
                justify="flex-start"
                fw="bold"
                size="lg"
                disabled={isActive(link.href)}
              >
                {link.title}
              </Button>
            </Link>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
