import { Container, List, ListItem, Stack, Text, Title } from "@mantine/core";

export default function Page() {
  return (
    <Container py={{ base: "16", sm: "72" }}>
      <Stack align="stretch" justify="center" gap="md">
        <Title order={1}>Data usage & privacy</Title>
        <Text>Effective Date: 15 May 2024</Text>

        <Title order={5}>Introduction</Title>
        <Text>
          Corsali, Inc. dba Vana (“Vana,” “we,” “us,” or “our”) is developing a
          web3 protocol to enable a decentralized network for user-owned data
          (the “Protocol”). To assist in the development, testing and deployment
          of the Protocol and related applications, Vana has made available a
          testnet accessible at satori.corsali.com (the “Testnet”). All access
          and use of the Testnet is subject to the terms and conditions
          contained in these Terms of Service (as amended from time to time, the
          “Terms of Service”). By accessing or otherwise using the Testnet, you
          acknowledge that you have read, understood, and agree to be bound by
          these Terms of Service. If you do not accept the terms and conditions
          of these Terms of Service, you will not access, browse, or otherwise
          use the Testnet.
        </Text>

        <Title order={5}>Modifications to Terms</Title>
        <Text>
          We reserve the right, at our sole discretion, to change or modify
          portions of these Terms of Service at any time. If we do this, we will
          post the changes on this page and will indicate at the top of this
          page the date these Terms of Service were last revised. Your continued
          use of the Testnet after the date any such changes become effective
          constitutes your acceptance of the new Terms of Service. You should
          periodically visit this page to review the current Terms of Service,
          so you are aware of any revisions. If you do not agree to abide by
          these or any future Terms of Service, you will not access, browse, or
          use (or continue to access, browse, or use) the Testnet.
        </Text>

        <Title order={5}>Important Information</Title>
        <Text>
          PLEASE READ THESE TERMS OF SERVICE CAREFULLY, AS THEY CONTAIN AN
          AGREEMENT TO ARBITRATE AND OTHER IMPORTANT INFORMATION REGARDING YOUR
          LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS. THE AGREEMENT TO ARBITRATE
          REQUIRES (WITH LIMITED EXCEPTION) THAT YOU SUBMIT CLAIMS YOU HAVE
          AGAINST US TO BINDING AND FINAL ARBITRATION, AND FURTHER (1) YOU WILL
          ONLY BE PERMITTED TO PURSUE CLAIMS AGAINST US ON AN INDIVIDUAL BASIS,
          NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE
          ACTION OR PROCEEDING, (2) YOU WILL ONLY BE PERMITTED TO SEEK RELIEF
          (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF) ON AN
          INDIVIDUAL BASIS, AND (3) YOU MAY NOT BE ABLE TO HAVE ANY CLAIMS YOU
          HAVE AGAINST US RESOLVED BY A JURY OR IN A COURT OF LAW.
        </Text>

        <Title order={5}>1. USE OF THE TESTNET</Title>
        <List withPadding>
          <ListItem>
            <Text>
              <strong>(a) Access to the Testnet:</strong> Vana is providing the
              Testnet for testing or evaluation purposes. The Testnet is not
              intended to be relied on for any reason whatsoever or to be used
              in a production environment. You acknowledge and accept that the
              Testnet (a) may contain bugs, errors and defects, (b) may function
              improperly or be subject to periods of downtime and
              unavailability, (c) may result in total or partial loss or
              corruption of data; (d) may result in partial or total inability
              to access; and (e) may be modified or discontinued at any time by
              us, including through the release of subsequent versions, all with
              or without notice to you. The Testnet is available on an “as is”
              basis without any warranties of any kind.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(b) Eligibility:</strong> In order to be eligible to
              access and use the Testnet, you represent and warrant that:
              <List>
                <ListItem>
                  You are at least eighteen (18) years of age and possess the
                  legal capacity to enter into a binding agreement with Vana;
                </ListItem>
                <ListItem>
                  You are not a citizen or resident of, and will not access the
                  Testnet from, the United States or Canada; and
                </ListItem>
                <ListItem>
                  You must not be under any sanctions imposed or enforced by any
                  national or international authority, nor should you be listed
                  on any roster of prohibited or restricted entities, inclusive
                  of, but not limited to, those maintained by the United Nations
                  Security Council, the U.S. Government, the European Union or
                  its Member States, or any other pertinent governmental
                  authority. Furthermore, you must neither be a citizen of nor
                  domiciled within any nation or region subjected to
                  comprehensive sanctions, including, but not limited to, Cuba,
                  Democratic People’s Republic of Korea, the Crimea, Donetsk,
                  Luhansk regions, Iran, or Syria.
                </ListItem>
              </List>
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(c) Testnet Tokens No Monetary Value:</strong> Within the
              scope of your engagement with the Testnet, you may amass “testnet
              tokens”. You agree and acknowledge that these tokens neither
              possess nor will they ever transform into or accumulate to become
              mainnet tokens or any other form of tokens or virtual assets.
              Testnet tokens are purely virtual entities devoid of any monetary
              significance. They do not represent any form of currency or
              tangible asset and cannot be exchanged, reimbursed, or converted
              into any fiat or virtual currency or any item of value.
              Transferring Testnet tokens between users outside the Testnet is
              prohibited, and any endeavors to sell, barter, or relocate any
              Testnet tokens beyond the Testnet confines, or to secure any form
              of credit leveraging Testnet tokens, are strictly forbidden. Any
              such attempts shall be deemed null and void. Vana retains the
              exclusive right to erase, purge, or otherwise eliminate the
              Testnet at any juncture without prior notification. This includes,
              but is not limited to, altering the existence, quantities, or any
              stipulations related to the Testnet tokens, all without incurring
              any liability towards you or other Testnet participants. Vana
              offers no assurance regarding the sustained provision of Testnet
              tokens for any predetermined duration, and you are cautioned
              against anticipating their perpetual availability. Should the
              Testnet be discontinued or terminated, you recognize and consent
              to the cessation of your access to and utilization of your Testnet
              tokens, and erasure of all accumulated Testnet tokens from the
              Testnet infrastructure. Under no circumstances will Testnet tokens
              be transmuted into any prospective rewards offered by Vana.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(d) Security; Non-Custodial:</strong> You bear the sole
              obligation to ensure the security and management of all
              identification details, passwords, or any other access codes
              associated with your participation in Testnet. Vana expressly
              disclaims any liability for losses arising from any breach of your
              systems or wallet(s). During specific stages of the Testnet,
              mainnet, or in the course of disbursing incentives/rewards, Vana
              may transmit or receive Testnet tokens or rewards to your
              designated wallet application. In such instances, you are
              exclusively accountable for the safeguarding and management of the
              private keys associated with your wallet(s). Vana neither manages
              nor retains, nor will it ever manage or retain, the private keys
              pertinent to your wallet(s). You assume responsibility for all
              actions undertaken through your wallet, irrespective of your
              awareness of such activities.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(e) Privacy Policy:</strong> Please review our Privacy
              Policy available at https://www.vana.com/legal/privacy-policy,
              which also governs your use of the Testnet, for information on how
              we collect, use and share your information. By using the Testnet,
              you agree to be bound by our Privacy Policy.
            </Text>
          </ListItem>
        </List>

        <Title order={5}>2. OWNERSHIP</Title>
        <List withPadding>
          <ListItem>
            <Text>
              <strong>(a) Ownership of Vana Content:</strong> The Testnet and
              all content made available by Vana through the Testnet, including
              any trademarks, logos, designs, text, graphics, pictures,
              information, data, software, and files (the “Vana Content”) is the
              proprietary property of Vana or our affiliates or licensors. The
              Vana Content, unless specifically stated otherwise, may not be
              used without the express written consent of Vana.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(b) Ownership of User Content:</strong> You retain
              ownership and responsibility for any content, data or other
              materials you upload or otherwise provide to the Testnet (“User
              Content”). You are responsible for ensuring that you have all
              rights, consents and permissions necessary to provide your User
              Content and to grant the licenses set forth herein.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(c) Rights to User Content:</strong> To provide the
              Testnet, we retain legal rights to host, publish, and share your
              User Content. You grant us the right to store, display, and use
              your User Content, including making incidental copies and
              transfers as part of providing and improving the Testnet. This
              license does not permit us to sell or distribute your User Content
              outside the Testnet, except as part of archival or backup
              processes.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(d) Feedback:</strong> You agree that submission of
              feedback, suggestions and recommendations (“Feedback”) is at your
              own risk and that Vana has no obligations with respect to such
              Feedback. You represent and warrant that you have all rights
              necessary to submit the Feedback. You hereby grant to Vana a fully
              paid, royalty-free, perpetual, irrevocable, worldwide,
              non-exclusive, and fully sublicensable right and license to use,
              reproduce, perform, display, distribute, adapt, modify, re-format,
              create derivative works of, and otherwise commercially or
              non-commercially exploit in any manner, any and all Feedback, for
              any purpose.
            </Text>
          </ListItem>
        </List>

        <Title order={5}>3. USER CONDUCT</Title>
        <Text>
          You agree that you are solely responsible for your conduct in
          connection with the Testnet. You agree not to:
          <List>
            <ListItem>
              (a) infringe or violate any copyrights, trademarks, patents, or
              any other intellectual property rights;
            </ListItem>
            <ListItem>(b) promote or facilitate illegal activity;</ListItem>
            <ListItem>
              (c) compromise the security or functioning of computers, servers,
              or networks through malicious software or denial of service
              attacks;
            </ListItem>
            <ListItem>
              (d) upload or transmit viruses, worms, trojan horses, time bombs,
              cancel bots, spiders, malware or any other type of malicious code
              that will or may be used in any way that will affect the
              functionality or operation of the Testnet;
            </ListItem>
            <ListItem>
              (e) engage in any attack, hack, denial-of-service attack,
              interference, or exploit of any smart contract or Testnet except
              when conducted solely for the purpose of identifying and reporting
              vulnerabilities, weaknesses, or potential threats within the
              Testnet, and only within the predefined boundaries and limitations
              of the Testnet;
            </ListItem>
            <ListItem>
              (f) provide false or misleading information to defraud us or
              others, or engage in any deceptive practices;
            </ListItem>
            <ListItem>
              (g) use data mining, scraping, or similar methods to extract
              information from the Testnet;
            </ListItem>
            <ListItem>
              (h) attempt to bypass sanctions or export controls imposed on you
              or your location;
            </ListItem>
            <ListItem>
              (i) rely on the Testnet for unauthorized financial or legal
              decisions, engage in fraudulent activities, or violate any
              applicable laws or regulations.
            </ListItem>
          </List>
        </Text>

        <Title order={5}>4. INVESTIGATIONS</Title>
        <Text>
          Vana may, but is not obligated to, monitor or review the Testnet and
          your use thereof at any time. Although Vana does not generally monitor
          user activity occurring in connection with the Testnet, if Vana
          becomes aware of any possible violations by you of any provision of
          these Terms of Service, Vana reserves the right to investigate such
          violations, and Vana may, at its sole discretion, immediately
          terminate your right to use the Testnet without prior notice to you.
        </Text>

        <Title order={5}>5. INDEMNIFICATION</Title>
        <Text>
          You agree to indemnify and hold Vana and its affiliates, officers,
          directors, employees, contractors, agents, and representatives (“Vana
          Parties”) harmless from any losses, costs, liabilities and expenses
          (including reasonable attorneys’ fees) relating to or arising out of
          any and all of the following:
          <List>
            <ListItem>(a) your User Content;</ListItem>
            <ListItem>
              (b) your use of, or inability to use, Vana or any of the Testnet;
            </ListItem>
            <ListItem>(c) your violation of these Terms of Service;</ListItem>
            <ListItem>
              (d) your violation of any rights of another party;
            </ListItem>
            <ListItem>
              (e) your violation of any applicable laws, rules or regulations.
            </ListItem>
          </List>
          Vana reserves the right, at its own cost, to assume the exclusive
          defense and control of any matter otherwise subject to indemnification
          by you, in which event you will fully cooperate with Vana in asserting
          any available defenses. This provision does not require you to
          indemnify any of the Vana for any unconscionable commercial practice
          by such party or for such party’s fraud, deception, false promise,
          misrepresentation or concealment, or suppression or omission of any
          material fact in connection with Vana or any Testnet provided
          hereunder. You agree that the provisions in this section will survive
          any termination of these Terms of Service and/or your access to the
          Testnet.
        </Text>

        <Title order={5}>6. DISCLAIMER OF WARRANTIES</Title>
        <Text>
          <strong>(a) No Fiduciary Duty:</strong> VANA IS NOT A BROKER,
          FINANCIAL INSTITUTION OR INTERMEDIARY AND IS IN NO WAY YOUR AGENT,
          ADVISOR, OR CUSTODIAN. VANA CANNOT INITIATE A TRANSFER OF ANY OF YOUR
          CRYPTOCURRENCY OR DIGITAL ASSETS OR OTHERWISE ACCESS YOUR DIGITAL
          ASSETS. VANA HAS NO FIDUCIARY RELATIONSHIP OR OBLIGATION TO YOU
          REGARDING ANY DECISIONS OR ACTIVITIES THAT YOU EFFECT IN CONNECTION
          WITH YOUR USE OF THE TESTNET.
        </Text>
        <Text>
          <strong>(b) Third Party Transactions:</strong> THE TESTNET MAY PROVIDE
          TECHNICAL MEANS THAT ENABLE YOU TO ENGAGE IN TRANSACTIONS WITH THIRD
          PARTIES. ALL TRANSACTIONS INITIATED THROUGH THE TESTNET ARE EFFECTED
          BY YOUR WALLET OR OTHER THIRD-PARTY DIGITAL WALLET EXTENSIONS. BY
          USING THE TESTNET, YOU AGREE THAT SUCH TRANSACTIONS ARE GOVERNED BY
          THE TERMS OF SERVICE AND PRIVACY POLICY AND THAT VANA IS NOT
          RESPONSIBLE FOR ANY SUCH TRANSACTIONS.
        </Text>
        <Text>
          <strong>(c) General Disclaimer:</strong> YOU EXPRESSLY UNDERSTAND AND
          AGREE THAT TO THE EXTENT PERMITTED BY APPLICABLE LAW, YOUR USE OF THE
          TESTNET IS AT YOUR SOLE RISK, AND THE TESTNET IS PROVIDED ON AN “AS
          IS” AND “AS AVAILABLE” BASIS, WITH ALL FAULTS. VANA PARTIES EXPRESSLY
          DISCLAIM ALL WARRANTIES, REPRESENTATIONS, AND CONDITIONS OF ANY KIND,
          WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
          WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE AND NON-INFRINGEMENT ARISING FROM USE OF VANA. VANA PARTIES
          MAKE NO WARRANTY, REPRESENTATION OR CONDITION THAT: (1) THE TESTNET
          WILL MEET YOUR REQUIREMENTS; (2) YOUR USE OF THE TESTNET WILL BE
          UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE; OR (3) THE RESULTS THAT
          MAY BE OBTAINED FROM USE OF THE TESTNET WILL BE ACCURATE OR RELIABLE.
          ANY CONTENT DOWNLOADED FROM OR OTHERWISE ACCESSED THROUGH THE TESTNET
          IS ACCESSED AT YOUR OWN RISK, AND YOU SHALL BE SOLELY RESPONSIBLE FOR
          ANY DAMAGE TO YOUR PROPERTY, INCLUDING, BUT NOT LIMITED TO, YOUR
          COMPUTER SYSTEM AND ANY DEVICE YOU USE TO ACCESS THE TESTNET, OR ANY
          OTHER LOSS THAT RESULTS FROM ACCESSING SUCH CONTENT. THE TESTNET MAY
          BE SUBJECT TO DELAYS, CANCELLATIONS AND OTHER DISRUPTIONS. VANA MAKES
          NO WARRANTY, REPRESENTATION OR CONDITION WITH RESPECT TO THE TESTNET,
          INCLUDING BUT NOT LIMITED TO, THE QUALITY, EFFECTIVENESS, REPUTATION
          AND OTHER CHARACTERISTICS OF THE TESTNET. NO ADVICE OR INFORMATION,
          WHETHER ORAL OR WRITTEN, OBTAINED FROM VANA OR THROUGH THE TESTNET
          WILL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN.
        </Text>
        <Text>
          <strong>(d) No Liability for Conduct of Third Parties:</strong> YOU
          ACKNOWLEDGE AND AGREE THAT VANA PARTIES ARE NOT LIABLE, AND YOU AGREE
          NOT TO SEEK TO HOLD VANA PARTIES LIABLE, FOR THE CONDUCT OF THIRD
          PARTIES, INCLUDING OPERATORS OF EXTERNAL SITES, AND THAT THE RISK OF
          INJURY FROM SUCH THIRD PARTIES RESTS ENTIRELY WITH YOU. VANA MAKES NO
          WARRANTY THAT THE GOODS OR SERVICES PROVIDED BY THIRD PARTIES WILL
          MEET YOUR REQUIREMENTS OR BE AVAILABLE ON AN UNINTERRUPTED, SECURE, OR
          ERROR-FREE BASIS. VANA MAKES NO WARRANTY REGARDING THE QUALITY OF ANY
          SUCH GOODS OR SERVICES, OR THE ACCURACY, TIMELINESS, TRUTHFULNESS,
          COMPLETENESS OR RELIABILITY OF ANY CONNECTED CONTENT OBTAINED THROUGH
          THE TESTNET.
        </Text>

        <Title order={5}>7. LIMITATION OF LIABILITY</Title>
        <Text>
          <strong>(a) Disclaimer of Certain Damages:</strong> YOU UNDERSTAND AND
          AGREE THAT, TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT SHALL
          VANA PARTIES BE LIABLE FOR ANY LOSS OF PROFITS, ETHEREUM OR OTHER
          VIRTUAL CURRENCY, REVENUE OR DATA, INDIRECT, INCIDENTAL, SPECIAL, OR
          CONSEQUENTIAL DAMAGES, OR DAMAGES OR COSTS DUE TO LOSS OF PRODUCTION
          OR USE, BUSINESS INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE GOODS OR
          SERVICES, IN EACH CASE WHETHER OR NOT VANA HAS BEEN ADVISED OF THE
          POSSIBILITY OF SUCH DAMAGES, ARISING OUT OF OR IN CONNECTION WITH THE
          AGREEMENT OR ANY COMMUNICATIONS, INTERACTIONS OR MEETINGS WITH OTHER
          USERS OF THE TESTNET, ON ANY THEORY OF LIABILITY, RESULTING FROM: (a)
          THE USE OR INABILITY TO USE THE TESTNET; (b) THE COST OF PROCUREMENT
          OF SUBSTITUTE GOODS OR SERVICES RESULTING FROM ANY GOODS, DATA,
          INFORMATION OR SERVICES PURCHASED OR OBTAINED; OR MESSAGES RECEIVED
          FOR TRANSACTIONS ENTERED INTO THROUGH THE TESTNET; (c) UNAUTHORIZED
          ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; (d) STATEMENTS
          OR CONDUCT OF ANY THIRD PARTY ON THE TESTNET; OR (e) ANY OTHER MATTER
          RELATED TO THE TESTNET, WHETHER BASED ON WARRANTY, COPYRIGHT,
          CONTRACT, TORT (INCLUDING NEGLIGENCE), PRODUCT LIABILITY OR ANY OTHER
          LEGAL THEORY.
        </Text>
        <Text>
          <strong>(b) Cap on Liability:</strong> TO THE FULLEST EXTENT PROVIDED
          BY LAW, VANA PARTIES WILL NOT BE LIABLE TO YOU FOR MORE THAN THE
          GREATER OF (I) $100; OR (II) THE REMEDY OR PENALTY IMPOSED BY THE
          STATUTE UNDER WHICH SUCH CLAIM ARISES. THE FOREGOING CAP ON LIABILITY
          SHALL NOT APPLY TO LIABILITY OF A VANA PARTY FOR (I) DEATH OR PERSONAL
          INJURY CAUSED BY A VANA PARTY’S NEGLIGENCE; OR FOR (II) ANY INJURY
          CAUSED BY A VANA PARTY’S FRAUD OR FRAUDULENT MISREPRESENTATION.
        </Text>
        <Text>
          <strong>(c) Exclusion of Damages:</strong> CERTAIN JURISDICTIONS DO
          NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE
          LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE EXCLUSIONS OR LIMITATIONS
          MAY NOT APPLY TO YOU, AND YOU MIGHT HAVE ADDITIONAL RIGHTS.
        </Text>
        <Text>
          <strong>(d) Basis of the Bargain:</strong> THE LIMITATIONS OF DAMAGES
          SET FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE BARGAIN
          BETWEEN VANA AND YOU.
        </Text>

        <Title order={5}>8. DISPUTE RESOLUTION BY BINDING ARBITRATION</Title>
        <Text>
          PLEASE READ THIS ARBITRATION AGREEMENT CAREFULLY. IT REQUIRES YOU TO
          ARBITRATE DISPUTES WITH VANA AND LIMITS THE MANNER IN WHICH YOU CAN
          SEEK RELIEF FROM US.
        </Text>
        <Text>
          <strong>(a) Governing Law:</strong> These Terms of Service and any
          action related thereto will be governed by the laws of the Cayman
          Islands without regard to its conflict of laws provisions. The
          exclusive jurisdiction for all disputes not subject to arbitration
          will be in the Cayman Islands and you and Vana each waive any
          objection to such jurisdiction and venue.
        </Text>
        <Text>
          <strong>(b) Agreement to Arbitrate:</strong> This Dispute Resolution
          by Binding Arbitration section is referred to in this Agreement as the
          “Arbitration Agreement.” You agree that any and all disputes or claims
          that have arisen or may arise between you and Vana, whether arising
          out of or relating to this Agreement (including any alleged breach
          thereof), the Testnet, and any aspect of the relationship or
          transactions between us, shall be resolved exclusively through final
          and binding arbitration, rather than a court, in accordance with the
          terms of this Arbitration Agreement, except that you may assert
          individual claims in small claims court, if your claims qualify.
          Further, this Arbitration Agreement does not preclude you from
          bringing issues to the attention of federal, state, or local agencies,
          and such agencies can, if the law allows, seek relief against us on
          your behalf. You agree that, by entering into this Agreement, you and
          Vana are each waiving the right to a trial by jury or to participate
          in a class action. Your rights will be determined by a neutral
          arbitrator, not a judge or jury.
        </Text>
        <Text>
          <strong>
            (c) Prohibition of Class and Representative Actions and
            Non-Individualized Relief:
          </strong>{" "}
          YOU AND VANA AGREE THAT EACH OF US MAY BRING CLAIMS AGAINST THE OTHER
          ONLY ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR CLASS MEMBER IN
          ANY PURPORTED CLASS OR REPRESENTATIVE ACTION OR PROCEEDING. UNLESS
          BOTH YOU AND VANA AGREE OTHERWISE, THE ARBITRATOR MAY NOT CONSOLIDATE
          OR JOIN MORE THAN ONE PERSON’S OR PARTY’S CLAIMS AND MAY NOT OTHERWISE
          PRESIDE OVER ANY FORM OF A CONSOLIDATED, REPRESENTATIVE, OR CLASS
          PROCEEDING. ALSO, THE ARBITRATOR MAY AWARD RELIEF (INCLUDING MONETARY,
          INJUNCTIVE, AND DECLARATORY RELIEF) ONLY IN FAVOR OF THE INDIVIDUAL
          PARTY SEEKING RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE
          RELIEF NECESSITATED BY THAT PARTY’S INDIVIDUAL CLAIM(S), EXCEPT THAT
          YOU MAY PURSUE A CLAIM FOR AND THE ARBITRATOR MAY AWARD PUBLIC
          INJUNCTIVE RELIEF UNDER APPLICABLE LAW TO THE EXTENT REQUIRED FOR THE
          ENFORCEABILITY OF THIS PROVISION.
        </Text>

        <Text>
          <strong>(d) Pre-Arbitration Dispute Resolution:</strong> Vana is
          always interested in resolving disputes amicably and efficiently, and
          most user concerns can be resolved quickly and to the user’s
          satisfaction by emailing support at hello@vana.com. If such efforts
          prove unsuccessful, a party who intends to seek arbitration must first
          send to the other, by certified mail, a written Notice of Dispute
          (“Notice”). The Notice to Vana should be sent to 548 Market St, PMB
          77861, San Francisco, CA 94104 (“Notice Address”). The Notice must (i)
          describe the nature and basis of the claim or dispute and (ii) set
          forth the specific relief sought. If Vana and you do not resolve the
          claim within sixty (60) calendar days after the Notice is received,
          you or Vana may commence an arbitration proceeding. During the
          arbitration, the amount of any settlement offer made by Vana or you
          shall not be disclosed to the arbitrator until after the arbitrator
          determines the amount, if any, to which you or Vana is entitled.
        </Text>
        <Text>
          <strong>(e) Arbitration Procedures:</strong> Arbitration will be
          conducted by a neutral arbitrator in accordance with the Cayman
          International Mediation and Arbitration Centre’s (“CIMAC”) rules and
          procedures (collectively, the “CIMAC Rules”), as modified by this
          Arbitration Agreement. If there is any inconsistency between any term
          of the CIMAC Rules and any term of this Arbitration Agreement, the
          applicable terms of this Arbitration Agreement will control unless the
          arbitrator determines that the application of the inconsistent
          Arbitration Agreement terms would not result in a fundamentally fair
          arbitration. The arbitrator must also follow the provisions of this
          Agreement as a court would. All issues are for the arbitrator to
          decide, including, but not limited to, issues relating to the scope,
          enforceability, and arbitrability of this Arbitration Agreement.
          Although arbitration proceedings are usually simpler and more
          streamlined than trials and other judicial proceedings, the arbitrator
          can award the same damages and relief on an individual basis that a
          court can award to an individual under this Agreement and applicable
          law. Decisions by the arbitrator are enforceable in court and may be
          overturned by a court only for very limited reasons. Unless Vana and
          you agree otherwise, any arbitration hearings will take place in a
          reasonably convenient location for both parties with due consideration
          of their ability to travel and other pertinent circumstances. If the
          parties are unable to agree on a location, the determination shall be
          made by the CIMAC.
        </Text>

        <Text>
          <strong>(f) Costs of Arbitration:</strong> Payment of all filing,
          administration, and arbitrator fees (collectively, the “Arbitration
          Fees”) will be governed by the CIMAC Rules, unless otherwise provided
          in this Arbitration Agreement. If the value of the relief sought is
          $75,000 or less, at your request, Vana will pay all Arbitration Fees.
          If the value of relief sought is more than $75,000 and you are able to
          demonstrate to the arbitrator that you are economically unable to pay
          your portion of the Arbitration Fees or if the arbitrator otherwise
          determines for any reason that you should not be required to pay your
          portion of the Arbitration Fees, Vana will pay your portion of such
          fees. In addition, if you demonstrate to the arbitrator that the costs
          of arbitration will be prohibitive as compared to the costs of
          litigation, Vana will pay as much of the Arbitration Fees as the
          arbitrator deems necessary to prevent the arbitration from being
          cost-prohibitive. Any payment of attorneys’ fees will be governed by
          the CIMAC Rules.
        </Text>
        <Text>
          <strong>(g) Confidentiality:</strong> All aspects of the arbitration
          proceeding, and any ruling, decision, or award by the arbitrator, will
          be strictly confidential for the benefit of all parties.
        </Text>
        <Text>
          <strong>(h) Severability:</strong> If a court or the arbitrator
          decides that any term or provision of this Arbitration Agreement
          (other than the subsection (c) titled “Prohibition of Class and
          Representative Actions and Non-Individualized Relief” above) is
          invalid or unenforceable, the parties agree to replace such term or
          provision with a term or provision that is valid and enforceable and
          that comes closest to expressing the intention of the invalid or
          unenforceable term or provision, and this Arbitration Agreement shall
          be enforceable as so modified. If a court or the arbitrator decides
          that any of the provisions of subsection (c) above titled “Prohibition
          of Class and Representative Actions and Non-Individualized Relief” are
          invalid or unenforceable, then the entirety of this Arbitration
          Agreement shall be null and void, unless such provisions are deemed to
          be invalid or unenforceable solely with respect to claims for public
          injunctive relief. The remainder of this Agreement will continue to
          apply.
        </Text>
        <Text>
          <strong>(i) Future Changes to Arbitration Agreement:</strong>{" "}
          Notwithstanding any provision in this Agreement to the contrary, Vana
          agrees that if it makes any future change to this Arbitration
          Agreement (other than a change to the Notice Address) while you are a
          user of the Testnet, you may reject any such change by sending Vana
          written notice within thirty (30) calendar days of the change to the
          Notice Address provided above. By rejecting any future change, you are
          agreeing that you will arbitrate any dispute between us in accordance
          with the language of this Arbitration Agreement as of the date you
          first accepted this Agreement (or accepted any subsequent changes to
          this Agreement).
        </Text>

        <Title order={5}>9. MISCELLANEOUS</Title>
        <List withPadding>
          <ListItem>
            <Text>
              <strong>(a) Entire Agreement:</strong> These terms constitute the
              entire agreement between you and us with respect to the subject
              matter hereof. This Agreement supersedes any and all prior or
              contemporaneous written and oral agreements, communications and
              other understandings (if any) relating to the subject matter of
              the terms.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(b) Assignment:</strong> You may not assign or transfer
              this Agreement, by operation of law or otherwise, without our
              prior written consent. Any attempt by you to assign or transfer
              this Agreement without our prior written consent shall be null and
              void. We may freely assign or transfer this Agreement. Subject to
              the foregoing, this Agreement will bind and inure to the benefit
              of the parties, their successors and permitted assigns.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(c) Notice:</strong> We may provide any notice to you
              under this Agreement using commercially reasonable means,
              including using public communication channels. Notices we provide
              by using public communication channels will be effective upon
              posting. Notices to Vana must be sent to [Notice].
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(d) Severability:</strong> If any provision of this
              Agreement shall be determined to be invalid or unenforceable under
              any rule, law, or regulation of any local, state, or federal
              government agency, such provision will be changed and interpreted
              to accomplish the objectives of the provision to the greatest
              extent possible under any applicable law and the validity or
              enforceability of any other provision of this Agreement shall not
              be affected.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>(e) No Waiver:</strong> Vana’s failure to enforce any
              right or provision of these Terms will not be considered a waiver
              of such right or provision. The waiver of any such right or
              provision will be effective only if in writing and signed by a
              duly authorized representative of Vana. Except as expressly set
              forth in these Terms, the exercise by either party of any of its
              remedies under these Terms will be without prejudice to its other
              remedies under these Terms or otherwise.
            </Text>
          </ListItem>
        </List>
      </Stack>
    </Container>
  );
}
