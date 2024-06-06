import { Box } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Box py={{ base: "16", sm: "72" }}>{children}</Box>;
}
