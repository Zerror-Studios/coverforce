export type ProcessStepIconKey = "mail" | "sparkle";

export type ProcessStepPoint = {
  id: string;
  icon: ProcessStepIconKey;
  text: string;
  highlighted?: boolean;
};

export type ProcessStepHeading = {
  pre: string;
  highlightLines: string[];
  postLines: string[];
};

export type ProcessStep = {
  id: string;
  tag: string;
  heading: ProcessStepHeading;
  desc: string;
  points: ProcessStepPoint[];
};

export const processSteps: ProcessStep[] = [
  {
    id: "intake-01",
    tag: "Intake 01",
    heading: {
      pre: "From",
      highlightLines: ["email to forms to", "documents"],
      postLines: ["every", "submission starts here."],
    },
    desc: "CoverForce accepts submissions however agents already work email, ACORD PDFs, loss runs, prior policies, manual entry, or direct AMS sync.",
    points: [
      {
        id: "accept",
        icon: "mail",
        text: "Accept submissions from email, ACORD PDFs, loss runs, prior policies, manual entry, or AMS sync.",
      },
      {
        id: "ai",
        icon: "sparkle",
        highlighted: true,
        text: "AI reads ACORDs, prior policies, and loss runs with 95%+ accuracy.",
      },
      {
        id: "customer",
        icon: "mail",
        text: "Customer details are saved and reused for future submissions.",
      },
    ],
  },
  {
    id: "step-02",
    tag: "Step 02",
    heading: {
      pre: "Placeholder",
      highlightLines: ["step 02 heading"],
      postLines: ["goes here."],
    },
    desc: "Placeholder description for step 02.",
    points: [
      { id: "p1", icon: "mail", text: "Placeholder point one." },
      { id: "p2", icon: "mail", text: "Placeholder point two." },
      { id: "p3", icon: "mail", text: "Placeholder point three." },
    ],
  },
  {
    id: "step-03",
    tag: "Step 03",
    heading: {
      pre: "Placeholder",
      highlightLines: ["step 03 heading"],
      postLines: ["goes here."],
    },
    desc: "Placeholder description for step 03.",
    points: [
      { id: "p1", icon: "mail", text: "Placeholder point one." },
      { id: "p2", icon: "mail", text: "Placeholder point two." },
      { id: "p3", icon: "mail", text: "Placeholder point three." },
    ],
  },
  {
    id: "step-04",
    tag: "Step 04",
    heading: {
      pre: "Placeholder",
      highlightLines: ["step 04 heading"],
      postLines: ["goes here."],
    },
    desc: "Placeholder description for step 04.",
    points: [
      { id: "p1", icon: "mail", text: "Placeholder point one." },
      { id: "p2", icon: "mail", text: "Placeholder point two." },
      { id: "p3", icon: "mail", text: "Placeholder point three." },
    ],
  },
  {
    id: "step-05",
    tag: "Step 05",
    heading: {
      pre: "Placeholder",
      highlightLines: ["step 05 heading"],
      postLines: ["goes here."],
    },
    desc: "Placeholder description for step 05.",
    points: [
      { id: "p1", icon: "mail", text: "Placeholder point one." },
      { id: "p2", icon: "mail", text: "Placeholder point two." },
      { id: "p3", icon: "mail", text: "Placeholder point three." },
    ],
  },
];

