import { Container, Stack, Text, Title } from "@mantine/core";

export default function Page() {
  return (
    <Container py={{ base: "16", sm: "72" }}>
      <Stack align="stretch" justify="center" gap="md">
        <Title order={4}>Acknowledgment of Test Nature</Title>
        <Text>
          Experimental Purpose: The participant acknowledges that the testnet is
          provided solely on an “as is” and “as available” basis for
          experimental purposes. The functionality of the testnet remains
          experimental and has not undergone comprehensive testing. VANA
          expressly disclaims any representations or warranties regarding the
          operability, accuracy, or reliability of the testnet.
        </Text>

        <Title order={4}>No Financial Promises</Title>
        <Text>
          Absence of Future Value: The participant agrees that participation in
          the testnet neither constitutes an investment nor implies an
          expectation of profit. There is no promise or implication of future
          value or potential return on any contributions of resources, time, or
          effort.
        </Text>

        <Title order={4}>Eligibility Requirements</Title>
        <Text>
          Restricted Countries: The participant represents and warrants that
          they are not a resident of, nor accessing the testnet from, the United
          States of America, Canada, or any jurisdiction that is either subject
          to OFAC sanctions or where participation in the testnet could subject
          VANA or the participant to potential liability.
        </Text>
        <Text>
          Compliance with Laws: The participant is solely responsible for
          ensuring that their participation in the testnet complies with all
          laws and regulations applicable within their jurisdiction.
        </Text>

        <Title order={4}>Indemnification</Title>
        <Text>
          Release of Liability: The participant agrees to indemnify, defend, and
          hold harmless VANA, its affiliates, officers, agents, employees, and
          partners from any claims, demands, losses, liabilities, or expenses
          arising from the use of the testnet, breach of these terms, or
          violation of any applicable laws or third-party rights.
        </Text>

        <Title order={4}>No Liability</Title>
        <Text>
          Limitation of Liability: In no event shall VANA be liable for any
          direct, indirect, incidental, special, consequential, or exemplary
          damages, including, but not limited to, damages for loss of profits,
          goodwill, use, data, or other intangible losses, resulting from the
          access to, use of, or inability to use the testnet.
        </Text>
        <Text>
          Technology Disclaimer: The technology underlying the testnet is
          provided without warranties of any kind, either express or implied,
          including, but not limited to, implied warranties of merchantability,
          fitness for a particular purpose, or non-infringement.
        </Text>

        <Title order={4}>Agreement to Additional Terms</Title>
        <Text>
          VANA’s Terms of Use and Privacy Policy: By clicking “Accept” in the
          pop-up, the participant agrees to be bound not only by these terms and
          conditions but also by VANA’s Terms of Use and Privacy Policy.
        </Text>
        <Text>
          Acceptance of Risk and Terms: By clicking “Accept” in the pop-up, the
          participant confirms having read, understood, and agreed to these
          terms and conditions, and accepts all risks associated with the use of
          the testnet, which may include bugs, errors, and other issues that
          could cause system failures or data loss.
        </Text>

        <Title order={4}>Modifications to Terms</Title>
        <Text>
          Right to Modify Terms: VANA reserves the right, at its sole
          discretion, to modify or replace these terms at any time. The
          participant is responsible for reviewing and becoming familiar with
          any such modifications. Continued use of the testnet following such
          modifications constitutes acceptance of the new terms.
        </Text>
      </Stack>
    </Container>
  );
}
