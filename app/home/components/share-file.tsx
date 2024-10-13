import { Stack, TextInput, Flex, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ShareFileLink = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      url: "",
    },

    // validate: {
    //   url: (value) => (validateGoogleDriveDomain(value) ? null : "Invalid url"),
    // },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // fake timer for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsSubmitting(false);
    }
    // TODO: add validation
    router.push("/success");
  };

  return (
    <Stack gap="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Text size="lg" fw="500">
          Share google drive link
        </Text>
        <Stack gap="sm">
          <TextInput
            placeholder="https://drive.google.com/drive"
            description={
              form.getInputProps("url").error
                ? undefined
                : "any guidance could go here"
            }
            inputWrapperOrder={["label", "input", "error", "description"]}
            type="url"
            {...form.getInputProps("url")}
          />
          <Flex justify="flex-end">
            <Button color="brand-3" type="submit" loading={isSubmitting}>
              Continue
            </Button>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
};

const validateGoogleDriveDomain = (value: string) => {
  // This regex checks if the URL starts with 'https://drive.google.com/'
  const regex = /^https:\/\/drive\.google\.com\//;
  return regex.test(value);
};
