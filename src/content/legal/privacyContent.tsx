import Link from "next/link";
import type { LegalPageProps } from "@/components/legal/LegalPage";

const tableOfContents = [
  "Information We Collect",
  "Our Potential Use of Your Information",
  "Accessing, Editing and Removing Your Information",
  "Use of Cookies",
  "Interaction with Third Party Websites",
  "Third Party Access to Your Information",
  "Release of Your Information for Legal Purposes",
  "Commercial and Non-Commercial Communications",
  "CoverForce's Security Measures",
  "Our Policy Towards Children",
  "Your California Privacy Rights",
  "Amendments",
];

export const privacyContent: LegalPageProps = {
  eyebrow: "Privacy",
  title: "Privacy Policy",
  intro: (
    <>
      <p>
        Thank you for visiting coverforce.com. Please read our{" "}
        <Link href="/terms-of-service" className="text-[#3D3D3D] underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        and this Privacy Policy carefully, as your first use of the websites, products or services
        maintained or offered by CoverForce, Inc. (&quot;CoverForce&quot;) constitutes agreement to
        both. If you do not agree with any of these policies, you agree to discontinue use of our
        websites, products, or services immediately.
      </p>
      <p>
        This Privacy Policy describes the privacy practices of CoverForce. It sets out when and how
        CoverForce collects visitor or customer information, including personally identifiable
        information, how such information is used, and the circumstances under which information may
        be disclosed to others.
      </p>
    </>
  ),
  tableOfContents,
  sections: [
    {
      title: "Information Collected",
      paragraphs: [
        "If you are a visitor to a CoverForce website for any reason (including for purposes of obtaining a free trial) or a CoverForce customer who registers or signs into a website maintained by CoverForce, we may obtain various types of information from you concerning your access device. This information may include, but is not limited to, the following information that can itself be used to identify you and allow the holder to contact you:",
      ],
      bulletItems: [
        "Name",
        "Company Name",
        "Title",
        "Email Address",
        "Phone Number",
        "Employee Count",
        "Payroll Information",
        "Visitor Site Preferences",
      ],
    },
    {
      title: "Browser and Device Information",
      paragraphs: [
        "CoverForce may also receive information that is provided by your browser or mobile device. This information includes but is not limited to:",
      ],
      bulletItems: [
        "Browser Information",
        "Operating System Information",
        "Mobile Device Information (e.g., device identifier, mobile operating system, etc.)",
        "IP Address",
        "Pages Accessed",
        "Time of Visit",
        "Time of Last Visit",
        "Referring Site, Application, or Service, including the relevant Search Queries that led you to CoverForce's website.",
      ],
    },
    {
      title: "Our Potential Use of Your Information",
      paragraphs: ["You should be aware that CoverForce may use information we obtain about you to:"],
      bulletItems: [
        "Enhance or improve the functionality of our websites, products, or services.",
        "Process transactions.",
        "Send email messages and updates about CoverForce websites, products and services, including requests for your agreement on policies such as this Privacy Policy and our Terms of Service.",
        "Send commercial email messages about our websites, products or services, and respond to inquiries.",
        "Perform any other function that we believe in good faith is necessary to protect the security or proper functioning of CoverForce websites, products, or services.",
      ],
    },
    {
      title: "Accessing, Editing, and Removing Your Information",
      paragraphs: [
        "In certain instances, you may be able to review and edit the personal information provided to us through your logging onto your account through our websites and by editing your user account preferences. Although many of these account changes occur immediately, removed information may continue to be stored in your web browser cache. We take no responsibility for stored information in your cache, or locations not readily visible to us, and disclaim all liability regarding the existence or misuse of such information. You should be aware that CoverForce may, from time to time, itself retain residual information about you in our backup and/or user database.",
      ],
    },
    {
      title: "Use of Cookies",
      paragraphs: [
        "CoverForce uses cookies to allow us to remember your preferences. For this reason, it is necessary that you enable cookies in your browser settings, and by way of this Privacy Policy disclosure you are informed of our use of cookies and that by visiting our websites you consent to our use of cookies in relation to your computer system.",
      ],
    },
    {
      title: "Interaction with Third Party Websites",
      paragraphs: [
        "Websites, products, and services maintained by CoverForce may contain links to third party websites, products, or services. These third party websites are not screened for privacy or security by CoverForce, and by accessing our website and/or using our products or services you thereby release CoverForce from any liability for the conduct of the operators of these third party websites.",
        "Please be aware that this Privacy Policy, and any other policies published by CoverForce, including any amendments to them, are not intended to create rights enforceable by third parties or to require disclosure of any personal information relating to users of our websites or services. CoverForce bears no responsibility for the information collected or used by any third-party website, including those containing advertising or solicitation requests. Please review the privacy policy and terms of service for each site you visit through third party links before interacting with such sites.",
      ],
    },
    {
      title: "Third Party Access to Your Information",
      paragraphs: [
        "CoverForce uses the services of various individuals and organizations, including contractors, web hosting providers, and others, to assist us with the collection, interpretation and use of visitor or user data.",
        "While providing or maintaining our website, products, or services, we may delegate to others the authority to collect, access, use, and disseminate your information. For example, our web hosting provider stores the information that you provide us, and we may hire outside contractors to perform maintenance or assist us in securing our website.",
        "By way of the first use of CoverForce websites, products, or services, you grant to these individuals and organizations the same rights that you afford us under this Privacy Policy. For this reason, you further agree that for every authorization that you grant to us by way of this Privacy Policy, you also grant to any other individuals or organizations that we may hire, contract, or otherwise retain the services of for the purpose of operating, maintaining, repairing, or otherwise improving or preserving our website or its underlying systems. You further agree that CoverForce is not liable for the actions or omissions of any of these individuals or organizations, even if we might otherwise be held vicariously liable for their errors or omissions.",
        <>
          When you visit or log in to our website, cookies and similar technologies may be used by our
          online data partners or vendors to associate these activities with other personal
          information they or others have about you, including by association with your email or
          home address. We (or service providers on our behalf) may then send communications and
          marketing to these email or home addresses. You may opt out of receiving this advertising
          by visiting{" "}
          <a
            href="https://app.retention.com/optout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3D3D3D] underline underline-offset-2"
          >
            https://app.retention.com/optout
          </a>
          .
        </>,
      ],
    },
    {
      title: "Release of Your Information for Legal Purposes",
      paragraphs: [
        "From time-to-time it may become necessary or advisable for CoverForce to release your information for legal purposes, such as in response to a request from a governmental agency or a private litigant in a filed action. You agree that we may disclose your information to others if we believe, in good faith, that it is advisable to do so for the purposes of a civil action, criminal investigation, internal investigation, or other legal matter. If we receive a subpoena affecting your privacy, we may elect to notify you to give you an opportunity to file a motion to quash the subpoena, or we may attempt to quash it ourselves, but we are not obligated to do either. We may also release your information to others when we believe that it is prudent to do so, such as when we have a reasonable belief that you may have engaged in or been the victim of fraudulent or other illegal activities. At all events, by your first use of our websites, products, or services you release us from any damages that may arise from or relate to the release of your information in response to a request from law enforcement agencies or private litigants.",
      ],
    },
    {
      title: "Commercial and Non-Commercial Communications",
      paragraphs: [
        "By providing your contact information to CoverForce via our website, products, or services, you waive all rights to file complaints concerning unsolicited email messages from CoverForce as by providing such information, you agree to receive commercial or non-commercial communications from us, or anyone else covered by this Privacy Policy. However, you may discontinue receiving certain commercial communications by notifying CoverForce that you no longer wish to receive solicitations or information other than for account management purposes. Upon receipt of your request, we will remove you from our contact database.",
      ],
    },
    {
      title: "CoverForce's Security Measures",
      paragraphs: [
        "CoverForce has implemented reasonable security mechanisms to protect customer and user data that may be maintained on CoverForce servers against loss, misuse and unauthorized access, disclosure, alteration, and destruction. Examples of these security mechanisms include limited and password-protected access, high security public/private keys, encryption on processed data, and TLS encryption to protect transmission of data. No security system is totally impenetrable, including ours. Despite our best efforts, it may be possible for system invaders, human or robotic, to intercept or access customer information. CoverForce cannot and does not guarantee the security of your information and you agree to not hold CoverForce responsible for unauthorized access despite reasonable security measures being in place.",
      ],
    },
    {
      title: "Our Policy Toward Children",
      paragraphs: [
        <>
          Our websites, products, and services are not intended for the use of children under 13. We
          do not knowingly collect personally identifiable information from children under 13. If you
          are under 13, do not attempt to register or send any information about yourself to us,
          including your name, address, telephone number, or email address. If a parent or guardian
          becomes aware that a child has provided us with personally identifiable information,
          please contact us at{" "}
          <a
            href="mailto:support@cover-force.com"
            className="text-[#3D3D3D] underline underline-offset-2"
          >
            support@cover-force.com
          </a>
          . If we become aware that a child under 13 has provided us with personally identifiable
          information, we will delete such information from our servers.
        </>,
      ],
    },
    {
      title: "Your California Privacy Rights",
      paragraphs: [
        <>
          CoverForce, Inc. invites residents of California to use its websites, products, and
          services. Therefore, it is our intent to comply with the California Business and
          Professions Code §§ 22575-22579. If you are a California resident, you may request certain
          information regarding our disclosure of personal information to third parties for their
          direct marketing purposes. Various provisions throughout this Privacy Policy address
          requirements of these Californian privacy statutes. For compliance with California law,
          you may presume that CoverForce collects electronic information from all website visitors.
          You may contact us at{" "}
          <a
            href="mailto:support@cover-force.com"
            className="text-[#3D3D3D] underline underline-offset-2"
          >
            support@cover-force.com
          </a>{" "}
          for additional details.
        </>,
      ],
    },
    {
      title: "Amendments",
      paragraphs: [
        "CoverForce will update this Privacy Policy from time-to-time without prior notice as is appropriate and to comply with changes in the applicable laws. All such updates are binding upon you immediately upon posting. When we make material changes this policy, we may choose to notify you by email message and ask you to accept the changes. But in any event, we will publish notice of any such material changes on our website, and your continued use of any CoverForce website, product or service will constitute your affirmative acceptance of those changes.",
      ],
    },
    {
      title: "California Consumer Privacy Act Policy",
      paragraphs: [
        'This section of our Privacy Policy constitutes our California Privacy Act Policy. It supplements the terms contained in our Privacy Policy, but applies only to visitors, users, and all others who reside in the State of California ("consumers" or "you"). Where the terms of the CoverForce Privacy Policy conflict with this policy, this California Privacy Act Policy controls for those individuals. This section of our Privacy Policy is maintained to comply with the California Consumer Privacy Act of 2018 ("CCPA") and other laws as applicable. Any terms of art in this policy have the meaning defined in the CCPA.',
      ],
    },
    {
      title: "Information We Collect (CCPA)",
      paragraphs: [
        'Our business requires us to collect and to use information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer ("personal information"). The following categories of information may be collected by CoverForce:',
        "Category One: Identifiers, which may include: a real name, alias, postal address, unique personal identifier, online identifier, Internet Protocol address, email address, account name, social security number, driver's license number, passport number, or other similar identifiers.",
        "Category Two: Information corresponding to California Customer Records personal information categories, such as: a name, signature, social security number, physical characteristics or description, address, telephone number, passport number, driver's license or state identification card number, insurance policy number, education, employment, employment history, bank account number, credit card number, debit card number, or any other financial information, medical information, or health insurance information. Some personal information included in this category may overlap with other categories.",
        "Personal information does not include:",
      ],
      bulletItems: [
        "Publicly available information from government records.",
        "De-identified or aggregated consumer information.",
        "Information excluded under the CCPA, such as anything covered by certain sector-specific privacy laws, including the Fair Credit Reporting Act (FRCA), the Gramm-Leach-Bliley Act (GLBA) or California Financial Information Privacy Act (FIPA), and the Driver's Privacy Protection Act of 1994.",
      ],
    },
    {
      title: "Sources of Personal Information",
      paragraphs: ["We obtain the categories of personal information listed above from the following categories of sources:"],
      bulletItems: [
        "Directly from you or our business partners. For example, when you call us or our business partners for help to obtain a commercial insurance quote.",
        "Indirectly from agents and brokers of our clients. For example, the information from our clients who have received it and having been unable to fulfill your request for a commercial insurance quote, have passed it to us as part of us providing services to them.",
        "Directly and indirectly from activity on our website (www.coverforce.com) when users submit requests for commercial insurance quotes and website usage details are automatically collected.",
        "From third-parties that interact with us or provide support for the services we perform.",
      ],
    },
    {
      title: "Use of Personal Information",
      paragraphs: ["We may use or disclose the personal information we collect for one or more of the following business purposes:"],
      bulletItems: [
        "To fulfill or meet the reason for which the information is provided. For example, if you provide us with personal information in order for us to fulfill a request for a commercial insurance quote, we will use that information to prepare a fully qualified quote request and, if necessary, connect you to an appropriate business partner.",
        "To provide you with information, products or services that you request from us.",
        "To improve our website and to present its contents to you.",
        "For testing, research, analysis and product development.",
        "As necessary to protect the rights, property or safety of us, our business partners or others.",
        "To respond to law enforcement requests and as required by applicable law, court order, or governmental regulations.",
        "As described to you when collecting your personal information or as otherwise set forth in the CCPA.",
        "To evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by us is among the assets transferred.",
      ],
    },
    {
      title: "Notice of Collection Purpose",
      paragraphs: [
        "CoverForce will not collect additional categories of personal information or use the personal information we collected for substantially different or incompatible purposes without providing you notice through this policy.",
      ],
    },
    {
      title: "Sharing Personal Information",
      paragraphs: [
        "We may disclose your personal information to a third party for a business purpose. When we disclose personal information for a business purpose, we enter into a contract that describes the purpose and requires the recipient to both keep that personal information confidential and not use it for anything other than performance of the contract.",
        "We may disclose the following categories of personal information for a business purpose: Category One: Identifiers. Category Two: California Customer Records personal information categories.",
        "We may also disclose your personal information for a business purpose to the following categories of third parties:",
      ],
      bulletItems: [
        "Our affiliates.",
        "Service providers.",
        "Third parties to whom you or your agents authorize us to disclose your personal information in connection with products or services we provide to you.",
      ],
    },
    {
      title: "Sale of Personal Information",
      paragraphs: [
        "We may sell personal information only for the exclusive purpose of connecting you with a business partner capable of fulfilling your request for a commercial insurance quote.",
      ],
    },
    {
      title: "Your Rights and Choices",
      paragraphs: [
        "The CCPA provides California residents with specific rights. This section describes those rights and explains how to exercise them.",
      ],
    },
    {
      title: "Access to Specific Information and Data Portability Rights",
      paragraphs: [
        <>
          You have the right to request that we disclose certain information to you about the
          collection and use of your personal information over any preceding 12 month period by
          emailing us at{" "}
          <a
            href="mailto:support@cover-force.com"
            className="text-[#3D3D3D] underline underline-offset-2"
          >
            support@cover-force.com
          </a>
          . Once we receive and confirm your verifiable consumer request, we will disclose to you:
        </>,
      ],
      bulletItems: [
        "The categories of personal information we collected about you during the preceding 12 months.",
        "The categories of sources for the personal information we collected about you during the preceding 12 months.",
        "Our business or commercial purpose for collecting or selling that personal information.",
        "The categories of third parties with whom we shared that personal information.",
        "The specific pieces of personal information we collected about you (also called a data portability request).",
        "If we sold or disclosed your personal information for a business purpose, two separate lists disclosing: sales, identifying the personal information categories that each category of recipient purchased; and disclosures for a business purpose, identifying the personal information categories that each category of recipient obtained.",
      ],
    },
    {
      title: "Deletion Request Rights",
      paragraphs: [
        <>
          You have the right to request that we delete any of your personal information that we have
          collected from you and have retained, subject to certain exceptions, by sending us a
          request at{" "}
          <a
            href="mailto:support@cover-force.com"
            className="text-[#3D3D3D] underline underline-offset-2"
          >
            support@cover-force.com
          </a>
          . Once we have received and confirmed your verifiable consumer request, we will delete
          your personal information from our records, unless an exception applies.
        </>,
        "We may deny your deletion request if retaining the information is necessary for us or our service providers to:",
      ],
      numberedItems: [
        "Complete the transaction for which we collected the personal information, provide a good or service that you requested, take actions reasonably anticipated within the context of our ongoing business relationship with you, or otherwise perform actions you authorized.",
        "Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity, or prosecute those responsible for such activities.",
        "Debug products to identify and repair errors that impair existing intended functionality.",
        "Exercise free speech, ensure the right of another consumer to exercise their free speech rights, or exercise another right provided for by law.",
        "Comply with the California Electronic Communications Privacy Act (Cal. Penal Code § 1546 seq.).",
        "Engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when the information's deletion may likely render impossible or seriously impair the research's achievement, if you previously provided informed consent.",
        "Enable exclusively internal uses that are reasonably aligned with consumer expectations based on your relationship with us.",
        "Comply with a legal obligation.",
        "Make other lawful uses of your personal information that are compatible in the context of which you provided it.",
      ],
    },
    {
      title: "Sale of Personal Information Rights",
      paragraphs: [
        <>
          You have the right to request that we not sell your personal information that we have
          collected from you by sending us a request at{" "}
          <a
            href="mailto:support@cover-force.com"
            className="text-[#3D3D3D] underline underline-offset-2"
          >
            support@cover-force.com
          </a>
          . Once we have received and confirmed your verifiable consumer request, we will not sell
          your personal information.
        </>,
      ],
    },
    {
      title: "Exercising Access, Data Portability, and Deletion Rights",
      paragraphs: [
        "To exercise your rights regarding access, data portability, and deletion of personal information described above, you must submit a verifiable consumer request to us by:",
      ],
      bulletItems: [
        "Visiting http://www.coverforce.com/ and clicking on the links in this policy.",
        "Emailing us at support@cover-force.com",
      ],
    },
    {
      title: "Verifiable Consumer Requests",
      paragraphs: [
        "Only you or a person registered with the California Secretary of State that you authorize to act on your behalf, may make a verifiable consumer request related to your personal information. You may also make a verifiable consumer request on behalf of your minor child.",
        "You may only make a verifiable consumer request for access or data portability twice within a 12-month period. The verifiable consumer request must:",
      ],
      bulletItems: [
        "Provide sufficient information that allows us to reasonably verify you are the person about whom we collected personal information or an authorized representative.",
        "Describe your request with sufficient detail that allows us to properly understand, evaluate, and respond to it.",
      ],
    },
    {
      title: "Identity Verification",
      paragraphs: [
        "We cannot respond to your request or provide you with personal information if we cannot verify your identity or authority to make the request and confirm the personal information relates to you. Making a verifiable consumer request does not require you to create an account with us. We will only use personal information provided in a verifiable consumer request to verify the requestor's identity or authority to make the request.",
      ],
    },
    {
      title: "Response Timing and Format",
      paragraphs: [
        "Our goal is to respond to a verifiable consumer request within 45 days of its receipt. If we require more time (up to 90 days), we will inform you of the reason and extension period in writing. We will deliver our written response by mail or electronically, at your option, provided we have valid deliverable addresses for either method. Any disclosures we provide will only address the 12-month period preceding the verifiable consumer request's receipt. In our response, we may also explain the reasons why a request cannot be executed, if applicable. For data portability requests, we will use an ASCII text file or other suitable means to provide your personal information that is readily useable and should allow you to move the information from one entity to another.",
        "We do not charge a fee to process or respond to your verifiable consumer request unless it is excessive, repetitive, or entirely unfounded. If we determine that the request warrants a fee, we will tell you why and provide you with the costs before the request is executed.",
      ],
    },
    {
      title: "Non-Discrimination",
      paragraphs: [
        "We will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not:",
      ],
      bulletItems: [
        "Deny you goods or services.",
        "Charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties.",
        "Provide you a different level or quality of goods or services.",
        "Suggest that you may receive a different price or rate for goods or services or a different level or quality of goods or services.",
      ],
    },
    {
      title: "Changes to this Privacy Policy",
      paragraphs: [
        "We reserve the right to amend this California Privacy Policy at our discretion and at any time. All such amendments are binding upon you immediately upon posting to our website.",
      ],
    },
    {
      title: "Contact Information",
      paragraphs: [
        "If you have any questions or comments about this California Privacy Act Policy, our Privacy Policy generally, the ways in which we collect and use your personal information, your choices and rights regarding such use, or wish to exercise your rights under the CCPA, please contact us.",
      ],
    },
  ],
  footerNote: (
    <>
      Privacy questions and CCPA requests can be sent to{" "}
      <a
        href="mailto:support@cover-force.com"
        className="text-[#3D3D3D] underline underline-offset-2"
      >
        support@cover-force.com
      </a>{" "}
      or through our{" "}
      <Link href="/contact" className="text-[#3D3D3D] underline underline-offset-2">
        contact page
      </Link>
      .
    </>
  ),
};
