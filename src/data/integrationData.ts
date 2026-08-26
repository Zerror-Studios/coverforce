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
    logoSrc: "/images/integration-logos/Accident Fund.svg",
    website: "https://www.accidentfund.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Acuity",
    logoSrc: "/images/integration-logos/Acuity.svg",
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
    logoSrc: "/images/integration-logos/AmTrust.svg",
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
    logoSrc: "/images/integration-logos/Arch.svg",
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
    logoSrc: "/images/integration-logos/At Bay.svg",
    website: "https://www.at-bay.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Ategrity",
    logoSrc: "/images/integration-logos/Ategrity.svg",
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
    logoSrc: "/images/integration-logos/Atlantic.svg",
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
    logoSrc: "/images/integration-logos/Attune.svg",
    website: "https://www.attuneinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Axis",
    logoSrc: "/images/integration-logos/Axis.svg",
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
    logoSrc: "/images/integration-logos/Beazley.svg",
    website: "https://www.beazley.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "Professional Liability", availability: "request" },
    ],
  },
  {
    name: "Berkeley Management Protection",
    logoSrc: "/images/integration-logos/Berkeley Management.svg",
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
    logoSrc: "/images/integration-logos/BerkleyNet.svg",
    website: "https://berkleynet.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "BiBerk",
    logoSrc: "/images/integration-logos/BiBerk.svg",
    website: "https://www.biberk.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Blitz",
    logoSrc: "/images/integration-logos/Blitz.svg",
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
    logoSrc: "/images/integration-logos/Btis.svg",
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
    logoSrc: "/images/integration-logos/Burlington ifg.svg",
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
    logoSrc: "/images/integration-logos/Century.svg",
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
    logoSrc: "/images/integration-logos/CFC.svg",
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
    logoSrc: "/images/integration-logos/Chubbs.svg",
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
    logoSrc: "/images/integration-logos/CNA.svg",
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
    logoSrc: "/images/integration-logos/CoAction.svg",
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
    logoSrc: "/images/integration-logos/Coliation.svg",
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
    logoSrc: "/images/integration-logos/CompWest.svg",
    website: "",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Core Specialty",
    logoSrc: "/images/integration-logos/Core Specialty.svg",
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
    logoSrc: "/images/integration-logos/Corvus.svg",
    website: "https://www.corvusinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
      { market: "AD", name: "Tech E&O", availability: "request" },
    ],
  },
  {
    name: "Coterie",
    logoSrc: "/images/integration-logos/Coterie.svg",
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
    logoSrc: "/images/integration-logos/Counterpart.svg",
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
    logoSrc: "/images/integration-logos/Cowbell.svg",
    website: "https://cowbell.insure/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Cyber", availability: "live" },
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Crum & Forster",
    logoSrc: "/images/integration-logos/Crum.svg",
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
    logoSrc: "/images/integration-logos/Doe Emuss.svg",
    website: "https://doeandemuss.com/",
    status: "API available",
    products: [
      { market: "ES", name: "MPL", availability: "request" },
    ],
  },
  {
    name: "Elpha Secure",
    logoSrc: "/images/integration-logos/Elpha.svg",
    website: "https://www.elphasecure.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Employers",
    logoSrc: "/images/integration-logos/Employers.svg",
    website: "https://www.employers.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "First",
    logoSrc: "/images/integration-logos/First.svg",
    website: "https://myfirstinsurance.com/",
    status: "API available",
    products: [
      { market: "AD", name: "General Liability", availability: "live" },
    ],
  },
  {
    name: "Gaig",
    logoSrc: "/images/integration-logos/Gaig.svg",
    website: "https://www.greatamericaninsurancegroup.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Inland Marine", availability: "live" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "General Star",
    logoSrc: "/images/integration-logos/General Star.svg",
    website: "https://www.generalstar.com/",
    status: "API available",
    products: [
      { market: "ES", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Guard",
    logoSrc: "/images/integration-logos/Guard.svg",
    website: "https://www.guard.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Hanover",
    logoSrc: "/images/integration-logos/Hanover.svg",
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
    logoSrc: "/images/integration-logos/Hiscox.svg",
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
    logoSrc: "/images/integration-logos/Homesite.svg",
    website: "https://go.homesite.com/",
    status: "API available",
    products: [
      { market: "AD", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Hsb",
    logoSrc: "/images/integration-logos/HSB.svg",
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
    logoSrc: "/images/integration-logos/IAT.svg",
    website: "https://www.iatinsurancegroup.com/",
    status: "Live on CoverForce",
    products: [
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Killara",
    logoSrc: "/images/integration-logos/Killara.svg",
    website: "https://killaracyber.com/",
    status: "API available",
    products: [
      { market: "ES", name: "Cyber", availability: "request" },
    ],
  },
  {
    name: "Liberty Mutual",
    logoSrc: "/images/integration-logos/Liberty Mutual.svg",
    website: "https://www.libertymutual.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Inland Marine", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Main Street America Insurance",
    logoSrc: "/images/integration-logos/Main Street.svg",
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
    logoSrc: "/images/integration-logos/Markel.svg",
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
    logoSrc: "/images/integration-logos/Merchants.svg",
    website: "https://www.merchantsgroup.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "General Liability", availability: "live" },
    ],
  },
  {
    name: "Music",
    logoSrc: "/images/integration-logos/Music.svg",
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
    logoSrc: "/images/integration-logos/Nationwide.svg",
    website: "https://www.nationwide.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Business Owner's Policy", availability: "live" },
      { market: "AD", name: "Commercial Auto", availability: "request" },
      { market: "AD", name: "General Liability", availability: "live" },
      { market: "AD", name: "Umbrella", availability: "request" },
      { market: "AD", name: "Worker's Compensation", availability: "request" },
      { market: "ES", name: "Business Owner's Policy", availability: "request" },
      { market: "ES", name: "General Liability", availability: "request" },
      { market: "ES", name: "Property", availability: "request" },
    ],
  },
  {
    name: "Nautilus Group",
    logoSrc: "/images/integration-logos/Nautilus.svg",
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
    logoSrc: "/images/integration-logos/navigators.svg",
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
    logoSrc: "/images/integration-logos/Northfield.svg",
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
    logoSrc: "/images/integration-logos/Penn American.svg",
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
    logoSrc: "/images/integration-logos/pie.svg",
    website: "https://www.pieinsurance.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "Republic Indemnity",
    logoSrc: "/images/integration-logos/Republic.svg",
    website: "https://www.republicindemnity.com/",
    status: "Live on CoverForce",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "live" },
    ],
  },
  {
    name: "RSUI",
    logoSrc: "/images/integration-logos/RSUI.svg",
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
    logoSrc: "/images/integration-logos/seneca-insurance.svg",
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
    logoSrc: "/images/integration-logos/State Auto Insurance.svg",
    website: "https://www.stateauto.com/",
    status: "API available",
    products: [
      { market: "AD", name: "Worker's Compensation", availability: "request" },
    ],
  },
  {
    name: "Thimble",
    logoSrc: "/images/integration-logos/thimble.svg",
    website: "https://www.thimble.com/",
    status: "API available",
    products: [
      { market: "AD", name: "General Liability", availability: "request" },
    ],
  },
  {
    name: "Travelers",
    logoSrc: "/images/integration-logos/Travelers.svg",
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
    logoSrc: "/images/integration-logos/USLI.svg",
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
    logoSrc: "/images/integration-logos/westchester.svg",
    website: "https://www.westchester.com/en/home.html",
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
    logoSrc: "/images/integration-logos/Western World.svg",
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
    logoSrc: "/images/integration-logos/Westfield.svg",
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