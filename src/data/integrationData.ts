// Auto-generated integration/carrier data
// Source: 2026 Carrier API Index sheet

export type Market = "AD" | "ES";
export type ProductAvailability = "live" | "request";

export type CarrierProduct = {
  market: Market;
  name: string;
  availability: ProductAvailability;
};

export type CarrierStatus = "Live on CoverForce" | "API available";

export type Carrier = {
  name: string;
  logoSrc?: string;
  website?: string;
  status: CarrierStatus;
  products: CarrierProduct[];
};

export const INTEGRATION_DATA: Carrier[] = [
  {
    name: "Accident Fund",
    logoSrc: "",
    website: "https://www.accidentfund.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Acuity",
    logoSrc: "",
    website: "https://www.acuity.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "request" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Amtrust",
    logoSrc: "",
    website: "https://amtrustfinancial.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Cyber", availability: "live" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Arch",
    logoSrc: "",
    website: "https://www.archinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Crime", availability: "request" },
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "D&O", availability: "request" },
      { market: "AD", name: "EPLI", availability: "request" },
      { market: "AD", name: "Fiduciary", availability: "request" },
      { market: "AD", name: "K&R", availability: "request" },
      { market: "AD", name: "Professional Liability", availability: "request" },
    ],
  },
  {
    name: "At-Bay",
    logoSrc: "",
    website: "https://www.at-bay.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Ategrity",
    logoSrc: "",
    website: "https://www.ategrity.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Atlantic Casualty",
    logoSrc: "",
    website: "https://www.atlanticcasualty.net/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Inland Marine", availability: "request" },
    ],
  },
  {
    name: "Attune",
    logoSrc: "",
    website: "https://www.attuneinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Axis",
    logoSrc: "",
    website: "https://www.axiscapital.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "Professional Liability", availability: "request" },
      { market: "AD", name: "Tech E&O", availability: "request" },
    ],
  },
  {
    name: "Beazley",
    logoSrc: "",
    website: "https://www.beazley.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "Professional Liability", availability: "request" },
    ],
  },
  {
    name: "Berkeley Management Protection",
    logoSrc: "",
    website: "https://www.berkleymp.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Crime", availability: "request" },
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "D&O", availability: "request" },
      { market: "AD", name: "EPLI", availability: "request" },
      { market: "AD", name: "Fiduciary", availability: "request" },
    ],
  },
  {
    name: "BerkleyNet",
    logoSrc: "",
    website: "https://berkleynet.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "BiBerk",
    logoSrc: "",
    website: "https://www.biberk.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Blitz",
    logoSrc: "",
    website: "https://www.blitzinsurance.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Inland Marine", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Btis",
    logoSrc: "",
    website: "https://marketplace.btisinc.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Burlington IFG",
    logoSrc: "",
    website: "https://www.ifgcompanies.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Century Surety",
    logoSrc: "",
    website: "https://www.centurysurety.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "CFC",
    logoSrc: "",
    website: "https://www.cfc.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "Tech E&O", availability: "request" },
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Chubb",
    logoSrc: "",
    website: "https://www.chubb.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Cyber", availability: "live" },
      { market: "AD", name: "D&O", availability: "request" },
      { market: "AD", name: "EPLI", availability: "request" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "MPL", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "CNA",
    logoSrc: "",
    website: "https://www.cna.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Coaction",
    logoSrc: "",
    website: "https://www.coactionspecialty.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Coliation",
    logoSrc: "",
    website: "https://www.coalitioninc.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Cyber", availability: "live" },
      { market: "AD", name: "D&O", availability: "request" },
      { market: "AD", name: "EPLI", availability: "request" },
      { market: "AD", name: "Tech E&O", availability: "request" },
      { market: "ES", name: "Cyber", availability: "live" },
    ],
  },
  {
    name: "CompWest",
    logoSrc: "",
    website: "",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Core Specialty",
    logoSrc: "",
    website: "https://corespecialty.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Corvus",
    logoSrc: "",
    website: "https://www.corvusinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "Tech E&O", availability: "request" },
    ],
  },
  {
    name: "Coterie",
    logoSrc: "",
    website: "https://coterieinsurance.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Professional Liability", availability: "live" },
    ],
  },
  {
    name: "Counterpart",
    logoSrc: "",
    website: "https://yourcounterpart.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Crime", availability: "request" },
      { market: "AD", name: "D&O", availability: "request" },
      { market: "AD", name: "EPLI", availability: "request" },
      { market: "AD", name: "Fiduciary", availability: "request" },
      { market: "AD", name: "Professional Liability", availability: "request" },
    ],
  },
  {
    name: "Cowbell",
    logoSrc: "",
    website: "https://cowbell.insure/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Cyber", availability: "live" },
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Crum & Forster",
    logoSrc: "",
    website: "https://www.cfins.com/",
    status: "Live on CoverForce",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "live" },
      { market: "ES", name: "Cyber", availability: "request" },
      { market: "ES", name: "General Liability", availability: "live" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Doe & Emuss",
    logoSrc: "",
    website: "https://doeandemuss.com/",
    status: "API available",
    products: [
      { market: "ES", name: "MPL", availability: "request" },
    ],
  },
  {
    name: "Elpha Secure",
    logoSrc: "",
    website: "https://www.elphasecure.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Employers",
    logoSrc: "",
    website: "https://www.employers.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "First",
    logoSrc: "",
    website: "https://myfirstinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Gaig",
    logoSrc: "",
    website: "https://www.greatamericaninsurancegroup.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Inland Marine", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "General Star",
    logoSrc: "",
    website: "https://www.generalstar.com/",
    status: "API available",
    products: [
      { market: "ES", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Guard",
    logoSrc: "",
    website: "https://www.guard.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Hanover",
    logoSrc: "",
    website: "https://www.hanover.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Hiscox",
    logoSrc: "",
    website: "https://www.hiscox.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Cyber", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Professional Liability", availability: "live" },
      { market: "AD", name: "Tech E&O", availability: "request" },
    ],
  },
  {
    name: "Homesite",
    logoSrc: "",
    website: "https://go.homesite.com/",
    status: "API available",
    products: [
      { market: "AD", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Hsb",
    logoSrc: "",
    website: "https://www.munichre.com/hsb/en.html",
    status: "API available",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "IAT Specialty",
    logoSrc: "",
    website: "https://www.iatinsurancegroup.com/",
    status: "Live on CoverForce",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "live" },
      { market: "ES", name: "Property", availability: "live" },
    ],
  },
  {
    name: "Killara",
    logoSrc: "",
    website: "https://killaracyber.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Liberty Mutual",
    logoSrc: "",
    website: "https://www.libertymutual.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Commercial Auto", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Inland Marine", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Main Street America Insurance",
    logoSrc: "",
    website: "https://msainsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "request" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Umbrella", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Markel",
    logoSrc: "",
    website: "https://www.markel.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Contractors' Pollution Liability", availability: "request" },
      { market: "AD", name: "Excess Liability", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Professional Liability", availability: "request" },
      { market: "AD", name: "Special Events", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "live" },
      { market: "ES", name: "Inland Marine", availability: "request" },
      { market: "ES", name: "Property", availability: "live" },
    ],
  },
  {
    name: "Merchants",
    logoSrc: "",
    website: "https://www.merchantsgroup.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Music",
    logoSrc: "",
    website: "https://www.music-ins.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Nationwide",
    logoSrc: "",
    website: "https://www.nationwide.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Umbrella", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "live" },
      { market: "ES", name: "Property", availability: "live" },
    ],
  },
  {
    name: "Nautilus Group",
    logoSrc: "",
    website: "https://www.nautilusinsgroup.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Navigators (E&S)",
    logoSrc: "",
    website: "",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Northfield",
    logoSrc: "",
    website: "https://www.northfieldins.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Other Excess and Surplus Lines of Business", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Penn America",
    logoSrc: "",
    website: "https://penn-america.com/",
    status: "Live on CoverForce",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "live" },
      { market: "ES", name: "General Liability", availability: "live" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Pie",
    logoSrc: "",
    website: "https://www.pieinsurance.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Republic Indemnity",
    logoSrc: "",
    website: "https://www.republicindemnity.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "RSUI",
    logoSrc: "",
    website: "https://www.rsui.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Seneca",
    logoSrc: "",
    website: "https://www.senecainsurance.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "State Auto Insurance",
    logoSrc: "",
    website: "https://www.stateauto.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Thimble",
    logoSrc: "",
    website: "https://www.thimble.com/",
    status: "API available",
    products: [
      { market: "AD", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Travelers",
    logoSrc: "",
    website: "https://www.travelers.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "USLI",
    logoSrc: "",
    website: "https://www.usli.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Umbrella", availability: "request" },
      { market: "ES", name: "Business Owner's Policy", availability: "live" },
      { market: "ES", name: "General Liability", availability: "live" },
    ],
  },
  {
    name: "Westchester Surplus",
    logoSrc: "",
    website: "https://www.chubb.com/",
    status: "Live on CoverForce",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "Contractors' Pollution Liability", availability: "live" },
      { market: "ES", name: "General Liability", availability: "live" },
      { market: "ES", name: "Property", availability: "live" },
    ],
  },
  {
    name: "Western World (AIG)",
    logoSrc: "",
    website: "https://www.westernworld.com/home",
    status: "API available",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Westfield",
    logoSrc: "",
    website: "https://www.westfieldinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "request" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
      { market: "AD", name: "General Liability", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
];