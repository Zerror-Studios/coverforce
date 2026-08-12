import Link from "next/link";
import type { LegalPageProps } from "@/components/legal/LegalPage";

export const termsContent: LegalPageProps = {
  eyebrow: "Legal",
  title: "Terms of Service",
  siteCovered: "CoverForce.com and all of its subdomains.",
  notice:
    "THIS PARAGRAPH CONTAINS AN IMPORTANT NOTICE. PLEASE READ IT CAREFULLY. SECTION 19 AND SECTION 20 OF THIS DOCUMENT CONTAIN A BINDING ARBITRATION PROVISION THAT REQUIRES ARBITRATION ON AN INDIVIDUAL BASIS (RATHER THAN JURY TRIALS OR CLASS ACTIONS) AND LIMITS THE TIME PERIOD WITHIN WHICH YOU MAY BRING A CLAIM AGAINST US.",
  subtitle: "CoverForce Terms of Service",
  lastUpdated: "November 20, 2023",
  sections: [
    {
      title: "1. The Agreement.",
      paragraphs: [
        'These CoverForce Terms of Service are entered into by and between you (acting in your capacity as an individual or an employee or other representative of your company or other entity, if applicable), and CoverForce Inc. ("Company," "our" or "us"). The following terms and conditions, together with any documents they expressly incorporate by reference (collectively, the "Agreement"), govern your access to and use of our website and online platform (the "Website") and the content, platforms, APIs, data, functionality, products and services offered by Company on or through the Website ("Services").',
      ],
    },
    {
      title: "2. Assent & Acceptance.",
      paragraphs: [
        <>
          Please read this Agreement carefully before you start to use the Website or procuring Services through the Website. By using the Website, procuring Services through the Website, or by clicking to accept or agree to this Agreement, you warrant that you have read and reviewed this Agreement and that you agree to be bound by this Agreement and our{" "}
          <Link href="/privacy" className="text-[#3D3D3D] underline underline-offset-2">
            Privacy Policy
          </Link>
          . If you do not agree to be bound by this Agreement, please leave the Website and do not attempt to purchase Services. The Company only agrees to provide the Services and use of this Website to you if you assent to this Agreement. This Agreement shall remain in full force and effect until terminated as set forth in this Agreement.
        </>,
      ],
    },
    {
      title: "3. Changes to these Terms.",
      paragraphs: [
        <>
          We reserve the right to change this Agreement at any time upon notice. We may give notice by posting the updated Agreement on the Website or by any other reasonable means. You can review the most current version of this Agreement at any time at{" "}
          <Link href="/terms-of-service" className="text-[#3D3D3D] underline underline-offset-2">
            coverforce.com/terms-of-service
          </Link>
          . The Agreement in effect at the time of your use of the Website and purchase of the Services will apply. Updated Agreements are binding on you with respect to your use of the Website or purchase of Services on or after the date indicated in the updated Agreement. If you do not agree to the updated Agreement, you must stop using the Website and may not continue to purchase Services. Your continued use of the Website and purchase of Services after the date of the updated Agreement will constitute your acceptance of the updated Agreement.
        </>,
      ],
    },
    {
      title: "4. License to Use Website.",
      paragraphs: [
        'The Company may provide you with certain information as a result of your use of the Website and receipt of Services. Such information may include, but is not limited to, documentation, data, or information developed by the Company or its third-party licensors, third-party providers, consultants, agents or brokers, and other materials which may assist in your use of the Website or receipt of the Services ("Company Materials"). Subject to the terms of this Agreement, the Company hereby grants you a non-exclusive, limited, non-transferable, non-sublicensable, and revocable license to use the Company Materials solely in connection with your use of the Website and receipt of the Services. The Company Materials may not be used for any other purpose, and this license terminates upon your cessation of use of the Website and receipt of the Services or at the termination of this Agreement.',
      ],
    },
    {
      title: "5. Intellectual Property.",
      paragraphs: [
        'You agree that the Website and the Services provided by Company is the property of the Company or its third-party licensors, third-party providers, consultants, agents or brokers, including all copyrights, trademarks, trade secrets, patents, and other intellectual property ("Company IP"). You agree that the Company owns all right, title and interest in and to the Company IP and that you will not use the Company IP for any unlawful or infringing purpose. You agree not to reproduce or distribute the Company IP in any way, including electronically or via registration of any new trademarks, trade names, service marks or Uniform Resource Locators (URLs), without express written permission from the Company.',
      ],
    },
    {
      title: "6. Accessing the Website.",
      paragraphs: [
        "We reserve the right to withdraw or amend this Website, and any Service we provide through the Website, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Website is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Website, or the entire Website, to users, including registered users. If you choose, or are provided with, a user name, password, or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity. If you are an entity, you may disclose your username and password to your employees with a need to know this information to use the Website on your behalf. You must ensure that all such employees that are authorized by you to access and use the Website are aware of and comply with this Agreement. You also acknowledge that your account is personal to you and agree not to provide any other person with access to this Website or portions of it using your user name, password, or other security information. You agree to notify us immediately of any unauthorized access to or use of your user name or password or any other breach of security. You also agree to ensure that you exit from your account at the end of each session. You should use particular caution when accessing your account from a public or shared computer so that others are not able to view or record your password or other personal information. You are responsible for all activities that occur under your account. You accept all risks of unauthorized access of your account. We may disable any user name, password, or other identifier, whether chosen by you or provided by us, at any time, in our sole discretion for any or no reason, including if, in our opinion, you have violated any provision of this Agreement.",
      ],
    },
    {
      title: "7. Confidential Information.",
      paragraphs: [
        "You agree to treat as strictly confidential and proprietary any information or materials that may be disclosed to you through your use of, or access to, the Website or receipt of the Services. You also agree that neither you nor your authorized representatives will disclose to anyone, directly or indirectly, any such confidential or proprietary matters, or use them other than as permitted under this Agreement. All documents that we prepare or which you may be given access to through the Website shall be deemed the property of Company and shall remain subject to confidentiality obligations under this Agreement. Under no circumstances shall any such information or material be disclosed to any third party without Company's prior written consent.",
      ],
    },
    {
      title: "8. Use of Information Provided by You.",
      paragraphs: [
        'You consent to all actions we or our third-party licensors and licensees, third-party providers, consultants, agents or brokers ("Third Parties") take consistent with our Privacy Policy with respect to all information you provide to us through the Website and any information provided by you related to the Services, including but not limited to through the use of any interactive features on the Website ("User Submissions"). You represent and warrant that you have the right to disclose the User Submissions to us and such Third Parties, and that we and our Third Parties may use the User Submissions for provision of the Services and Website, product development, benchmarking, data analysis, marketing activities, and for other purposes. It is a condition of your use of the Website and receipt of Services that all User Submissions are correct, current, and complete, and that you have the authorization and consents necessary to disclose User Submissions to us pursuant to the terms of this Agreement. We can use User Submissions to contact you about our products or services. You acknowledge, represent and agree that any User Submission is submitted voluntarily, and that your User Submission does not establish a relationship between you and us or between you and any Third Parties. You grant Company and its sublicensees a worldwide, royalty-free, non-exclusive, transferable, perpetual and irrevocable license to use, distribute, transmit, reproduce, modify, publish, translate, publicly perform and display and create derivative works of your User Submissions, except as otherwise prohibited by applicable law or this Agreement. You waive any right to compensation of any type for your User Submissions. You represent and warrant that you have all the rights necessary to grant the rights in this Section 8 and that use of User Submissions by us does not violate any law. You may not upload to, distribute, or otherwise publish through the Website any content that is libelous, defamatory, obscene, threatening, invasive of privacy or publicity rights, abusive, illegal, or otherwise objectionable, or that may constitute or encourage a criminal offense, violate the rights of any party or that may otherwise give rise to liability or violate any law. In our sole discretion, at any time, for any reason, and without further notice to you, we may monitor, censor, edit, move, delete, and remove any Website content and any content transmitted by direct messaging or by any other method to or from your user account.',
      ],
    },
    {
      title: "9. Authorization; Acceptable Use.",
      paragraphs: [
        "You represent and warrant that (i) you are at least 18 years of age; (ii) you have full power and authority to agree to this Agreement; (iii) you are not located in, under the control of, or a national or resident of any country subject to sanctions by the United States; (iv) you have not been placed on the U.S. Department of Commerce's Denied Persons List; (v) you are not identified as a \"Specially Designated National\" by the United States government; and (vi) you will not access the Website if you have previously been prohibited from doing so or if any laws prohibit you from doing so. We do not intend for the Website to be used by persons or entities in countries or jurisdictions that require us to obtain a registration or license. If you are in such a country or jurisdiction, you are not authorized to and agree that you will not use the Website. You agree not to use the Website for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Website in any way that could damage the Website or general business of the Company. You further agree not to use the Website:",
      ],
      listItems: [
        "to harass, abuse, or threaten others or otherwise violate any person's legal rights;",
        "to violate any intellectual property rights of the Company or any third party;",
        "to upload or otherwise disseminate any computer viruses or other software that may damage the property of another;",
        "to perpetrate any fraud;",
        "to engage in or create any unlawful gambling, sweepstakes, or pyramid scheme;",
        "to publish or distribute any obscene or defamatory material;",
        "to publish or distribute any material that incites violence, hate, or discrimination towards any group;",
        "to unlawfully gather information about others; or",
        "to reverse engineer, or attempt to reverse engineer or disassemble any code or software from or on the Website; violate the security of the Website through any unauthorized access, circumvention of encryption or other security tools, data mining or interference to any host, user or network.",
      ],
    },
    {
      title: "10. Referral Policy.",
      paragraphs: [
        "To qualify, your referee must sign up for CoverForce and submit five or more submissions for quote. Within 30 calendar days of your referee's fifth submission, you will receive a $50 Amazon gift card and your referee will receive a $50 Amazon gift card. You cannot participate in pay-per-click advertising on trademarked terms, including any derivations, variations or misspellings thereof, for search or content-based campaigns on Google, MSN, or Yahoo. For the purposes of these terms, trademarked terms include CoverForce, CoverForce Portal, Coverforce.com and Cover-force.com (all keywords apply as broad match).",
      ],
    },
    {
      title: "11. Sales.",
      paragraphs: [
        "The Company may sell Services or allow third parties to sell services on the Website. The Company undertakes to be as accurate as possible with all information regarding the Services, including product descriptions and images. However, the Company does not guarantee the accuracy or reliability of any product information, and you acknowledge and agree that you purchase such products at your own risk. If you are unhappy with a service being sold on the Website, you may request a refund.",
      ],
    },
    {
      title: "12. Indemnification.",
      paragraphs: [
        "You agree to defend and indemnify the Company including its parent, subsidiaries directors, officers, members, owners, and employees from any third party claims and resulting liability, including attorney's fees, judgments, penalties, fines, expenses, court costs, and amounts paid arising out of or relating to use: (a) your use or misuse of the Website or Services, (b) your breach of this Agreement, or (c) your violation of any other party's rights or applicable law. The foregoing indemnification provision shall in all instances be deemed to be subordinate to any third-party insurance coverage that may cover all or any portion of any indemnified claim. As a condition precedent to indemnification, we will inform you within thirty (30) days after we receive notice of any claim, loss, liability, or demand for which we seek indemnification from you; and we will cooperate in the investigation and defense of any such matter.",
      ],
    },
    {
      title: "13. Spam Policy.",
      paragraphs: [
        "You are strictly prohibited from using the Website or any of the Company's Services for illegal spam activities, including gathering email addresses and personal information from others or sending any mass commercial emails.",
      ],
    },
    {
      title: "14. Third Party Links & Content.",
      paragraphs: [
        "The Company may occasionally post links to third party websites or other services. The information presented on or through the Website is made available solely for general information purposes, and does not constitute any type of advice, whether financial, legal, investment, accounting, tax or otherwise. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Website, or by anyone who may be informed of any of its contents. The content on this Website is updated frequently, including based on interaction with users of the Website, but the Website's content is not necessarily complete or up-to-date. Any of the material on the Website may be out of date at any given time, and we are under no obligation to update such material. You agree that the Company is not responsible or liable for any loss or damage caused as a result of your use of any third party services linked to from the Website.",
      ],
    },
    {
      title: "15. Entire Agreement.",
      paragraphs: [
        "This Agreement constitutes the entire understanding between the parties with respect to any and all use of this Website and receipt of the Services. This Agreement supersedes and replaces all prior or contemporaneous agreements or understandings, written or oral, regarding the use of this Website or receipt of the Services. To the extent any part or sub-part of this Agreement is held ineffective or invalid by any court of law, you agree that the prior, effective version of this Agreement shall be considered enforceable and valid to the fullest extent. You agree to routinely monitor this Agreement and refer to the effective date posted at the top of this Agreement to note modifications or variations. You further agree to clear your cache when doing so to avoid accessing a prior version of this Agreement. You agree that your continued use of the Website and receipt of the Services after any modifications to or variations of this Agreement is a manifestation of your continued assent to this Agreement. In the event that you fail to monitor any modifications to or variations of this Agreement, you agree that such failure shall be considered an affirmative waiver of your right to review the modified Agreement.",
      ],
    },
    {
      title: "16. Term, Termination & Suspension.",
      paragraphs: [
        "The Company may terminate this Agreement with you at any time for any reason, with or without cause. The Company specifically reserves the right to terminate this Agreement if you violate any of the terms outlined herein, including, but not limited to, violating the intellectual property rights of the Company or a third party, failing to comply with applicable laws or other legal obligations, and/or publishing or distributing illegal material. If you have registered for an account with Company, you may also terminate this Agreement at any time by contacting Company and requesting termination. At the termination of this Agreement, any provisions that would be expected to survive termination by their nature shall remain in full force and effect.",
      ],
    },
    {
      title: "17. No Warranties.",
      paragraphs: [
        'Your use of the Website, its content, and any services or items obtained through the Website are at your own risk. The Website, its content, and any services or items obtained through the Website are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. Neither Company, nor any person associated with Company, makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the Website, Services or information made available on the Website or by us as part of the Services. Without limiting the foregoing, neither Company nor anyone associated with Company represents or warrants that the Website, its content, or any services obtained through the Website will be accurate, secure, reliable, error-free, or uninterrupted, that defects will be corrected, that our Website or the server that makes it available are free of viruses or other harmful components, or that the Website or any services or items obtained through the Website will otherwise meet your needs or expectations. To the fullest extent provided by law, Company hereby disclaims all warranties of any kind, whether express or implied, statutory, or otherwise, including, but not limited to, any warranties of merchantability, non-infringement, and fitness for particular purpose.',
      ],
    },
    {
      title: "18. Limitation on Liability.",
      paragraphs: [
        "To the fullest extent provided by law, in no event will Company, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for any indirect, special, incidental, consequential, or punitive damages related to your use, or inability to use, the Website, any websites linked to it, any content on the Website or such other websites, the receipt or provision of the Services, including but not limited to personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable. The aggregate liability of Company to you for all claims and damages related to this Agreement, the Services, your use or inability to use the Website, any websites linked to it, any content on the Website or such other websites, or any dispute between the parties will not exceed $100 USD.",
        "Some jurisdictions do not allow the exclusion or limitation of direct, incidental, or consequential damage, loss, or liability from intentional acts (including fraud, fraudulent misrepresentation, and failure to disclose defects), product liability, or for death or personal injury. Nothing in this Section 18 will be interpreted as excluding liability that cannot under applicable law be excluded in those jurisdictions. If you live, or are otherwise subject to the laws in one of those jurisdictions, any statutory entitlement available to you will be deemed limited to the extent (if at all) permissible under that law, and, if limitation is not permitted, the limitations and exclusions in this section may not apply to you.",
      ],
    },
    {
      title: "19. Arbitration and Governing Law.",
      paragraphs: [
        "The parties agree to submit any disputes arising from, or related to, this Agreement, the Services, or use of the Website, and any disputes between the parties, including disputes arising from or concerning their interpretation, violation, invalidity, non-performance, or termination, to final and binding arbitration under the rules of arbitration of the American Arbitration Association applying New York law. The seat or legal place of arbitration will be New York City, New York. You agree to arbitrate in your individual capacity only – not as a representative or member of a class – and you expressly waive any right to file a class action or seek relief on a class action basis. Furthermore, unless you and Company agree in writing, the arbitrator may not consolidate more than one person's claims, and may not otherwise preside over any form of a representative or class proceeding. All arbitration proceedings are confidential, unless both you and Company agree otherwise. Arbitration orders and awards required to be filed with applicable courts of competent jurisdiction are not confidential and may be disclosed by the parties to such courts. A party who improperly discloses confidential information will be subject to sanctions. The arbitrator and forum may disclose case filings, case dispositions, and other case information as required by a court order of proper jurisdiction. Notwithstanding the foregoing, the parties may seek injunctive relief or specific performance in any court in the State of New York in order to protect its intellectual property rights or to enforce the confidentiality obligations under this Agreement without the requirement to submit the dispute to arbitration, prove monetary damages or post bond. This Agreement will be governed by and construed in accordance with the laws of the State of New York, without giving effect to its conflict of laws provisions.",
      ],
    },
    {
      title: "20. Limitation on Time to File Claims.",
      paragraphs: [
        "Any cause of action or claim you may have arising out of or relating to this Agreement, the Services, or use of the Website, and any disputes between the parties, including disputes arising from or concerning their interpretation, violation, invalidity, non-performance, or termination, must be commenced within one year after the cause of action accrues. Otherwise, such cause of action or claim is permanently barred.",
      ],
    },
    {
      title: "21. Assignment.",
      paragraphs: [
        "This Agreement, or the rights granted hereunder, may not be assigned, sold, leased or otherwise transferred in whole or part by you. Should this Agreement, or the rights granted hereunder, be assigned, sold, leased or otherwise transferred by the Company, the rights and liabilities of the Company will bind and inure to any assignees, administrators, successors, and executors.",
      ],
    },
    {
      title: "22. Severability.",
      paragraphs: [
        "If any part or sub-part of this Agreement is held invalid or unenforceable by a court of law or competent arbitrator, the remaining parts and sub-parts will be enforced to the maximum extent possible. In such condition, the remainder of this Agreement shall continue in full force.",
      ],
    },
    {
      title: "23. No Waiver.",
      paragraphs: [
        "In the event that we fail to enforce any provision of this Agreement, this shall not constitute a waiver of any future enforcement of that provision or of any other provision. Waiver of any part or sub-part of this Agreement will not constitute a waiver of any other part or sub-part.",
      ],
    },
    {
      title: "24. No Agency, Partnership or Joint Venture.",
      paragraphs: [
        "No agency, partnership, or joint venture has been created between the parties as a result of this Agreement. No party has any authority to bind the other to third parties.",
      ],
    },
    {
      title: "25. Geographic Restrictions.",
      paragraphs: [
        "The owner of the Website is based in the state of New York in the United States. We provide this Website for use only by persons located in the United States. We make no claims that the Website or any of its content is accessible or appropriate outside of the United States. Access to the Website may not be legal by certain persons or in certain countries. If you access the Website from outside the United States, you do so on your own initiative and are responsible for compliance with local laws.",
      ],
    },
    {
      title: "26. Force Majeure.",
      paragraphs: [
        "The Company is not liable for any failure to perform due to causes beyond its reasonable control including, but not limited to, acts of God, acts of civil authorities, acts of military authorities, riots, embargoes, acts of nature and natural disasters, and other acts which may be due to unforeseen circumstances.",
      ],
    },
    {
      title: "27. Electronic Communications Permitted.",
      paragraphs: [
        "Electronic communications are permitted to both parties under this Agreement, including e-mail or fax. For any questions or concerns, please email Company at the following address: info@coverforce.com.",
      ],
    },
    {
      title: "28. California Residents.",
      paragraphs: [
        "The provider of Services is CoverForce Inc., with the following contact information: [insert address], [insert telephone], info@coverforce.com. If you are a California resident, in accordance with Cal. Civ. Code §1789.3, you may report complaints to the Complaint Assistance Unit of the Division of Consumer Sites of the California Department of Consumer Affairs by contacting them in writing at 1625 North Market Blvd., Suite N 112 Sacramento, CA 95834, or by telephone at (800) 952-5210 or (916) 445-1254.",
      ],
    },
  ],
};
