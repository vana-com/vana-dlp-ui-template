import { useNetworkStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { ActionIcon, Button, Drawer, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

export const SettingsButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const contract = useNetworkStore((state) => state.contract);
  const publicKeyBase64 = useNetworkStore((state) => state.publicKeyBase64);
  const setPublicKeyBase64 = useNetworkStore((state) => state.setPublicKeyBase64);
  const setContract = useNetworkStore((state) => state.setContract);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      contract,
      publicKey: atob(publicKeyBase64),
    },
  });

  useEffect(() => {
    form.setValues({ contract, publicKey: atob(publicKeyBase64) });
  }, [contract, publicKeyBase64]);

  const handleSubmit = (values: { contract: string, publicKey: string }) => {
    setContract(values.contract);
    setPublicKeyBase64(btoa(values.publicKey));

    close();
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Settings"
        offset={8}
        radius="md"
        position="right"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Contract address"
            placeholder="0x..."
            key={form.key("contract")}
            autoComplete="off"
            {...form.getInputProps("contract")}
          />
          <Textarea
            withAsterisk
            rows={10}
            label="Public key"
            placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nABC..."
            key={form.key("publicKey")}
            autoComplete="off"
            {...form.getInputProps("publicKey")}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit" color="brand-3">
              Save
            </Button>
          </Group>
        </form>
      </Drawer>

      <ActionIcon
        variant="outline"
        color="brand-3"
        aria-label="Settings"
        onClick={open}
        size={36}
      >
        <Icon icon="carbon:settings" />
      </ActionIcon>
    </>
  );
};
