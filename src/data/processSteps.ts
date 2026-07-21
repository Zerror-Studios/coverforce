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
  videoSrc: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "intake-01",
    tag: "01 Smart Intake",
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
    videoSrc: "/videos/process1.mp4",
  },
  {
    id: "step-02",
    tag: "02 Smart Enrichment",
    heading: "AI enriches every submission from ACORD forms and classifications.",
    points: [
      { id: "p1", text: "AI extracts and enriches data from ACORD forms into complete application fields." },
      { id: "p2", text: "Classification codes and underwriting answers are mapped intelligently." },
      { id: "p3", text: "Intelligent prefill completes applications across carrier formats — using 350k+ datapoints." },
    ],
    videoSrc: "/videos/process2.mp4",
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
    videoSrc: "/videos/process3.mp4",
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
    videoSrc: "/videos/process4.mp4",
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
    videoSrc: "/videos/process5.mp4",
  },
];
