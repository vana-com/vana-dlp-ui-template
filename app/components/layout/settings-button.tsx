import { useNetworkStore } from "@/app/core";
import { Icon } from "@iconify/react";
import { ActionIcon, Button, Drawer, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

export const SettingsButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const contract = useNetworkStore((state) => state.contract);
  const setContract = useNetworkStore((state) => state.setContract);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      contract,
    },
  });

  useEffect(() => {
    form.setValues({ contract });
  }, [contract]);

  const handleSubmit = (values: { contract: string }) => {
    setContract(values.contract);

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
