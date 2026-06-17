export type ProcessStepPoint = {
  id: string;
  text: string;
  highlighted?: boolean;
};

export type ProcessStep = {
  id: string;
  tag: string;
  heading: string;
  points: ProcessStepPoint[];
};

export const processSteps: ProcessStep[] = [
  {
    id: "intake-01",
    tag: "01 Intake",
    heading: "Every submission starts here, however your team works today.",
    points: [
      {
        id: "accept",
        text: "Accept submissions from email, ACORD PDFs, loss runs, prior policies, manual entry, or AMS sync.",
      },
      {
        id: "ai",
        highlighted: true,
        text: "AI reads ACORDs, prior policies, and loss runs with 95%+ accuracy.",
      },
      {
        id: "customer",
        text: "Customer details are saved and reused for future submissions.",
      },
    ],
  },
  {
    id: "step-02",
    tag: "02 ACORD Automation",
    heading: "The form fills itself in the moment a submission arrives.",
    points: [
      { id: "p1", text: "AI extracts data from ACORD forms and fills missing application fields." },
      { id: "p2", text: "Classification codes and underwriting answers are mapped automatically." },
      { id: "p3", text: "Applications are pre-filled across carrier formats with less manual entry." },
    ],
  },
  {
    id: "step-03",
    tag: "03 Carrier Submission",
    heading: "One submission reaches every appointed carrier at once.",
    points: [
      { id: "p1", text: "One completed application is sent to 40+ carriers at the same time." },
      { id: "p2", text: "Carrier-specific questions and requirements are handled automatically." },
      { id: "p3", text: "No portal logins, repeated typing, or switching between carrier websites." },
    ],
  },
  {
    id: "step-04",
    tag: "04 Compare Quotes",
    heading: "Bindable quotes, compared side by side in one view.",
    points: [
      { id: "p1", text: "View bindable quotes from multiple carriers side by side." },
      { id: "p2", text: "Compare premium, deductible, limits, coverage, and quote status clearly." },
      { id: "p3", text: "Generate customer-ready quote proposals in seconds." },
    ],
  },
  {
    id: "step-05",
    tag: "05 Bind",
    heading: "From quote to bound policy — in one click.",
    points: [
      { id: "p1", text: "Select the best quote and bind the policy in one click." },
      { id: "p2", text: "Complete payment and premium finance inside the same workflow." },
      { id: "p3", text: "Policy documents are delivered instantly after binding." },
    ],
  },
];
