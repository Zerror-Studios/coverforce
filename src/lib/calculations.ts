export interface LOB {
  id: string;
  label: string;
  pct: number;
  cfHelp: boolean;
}

export const LOB_COMMERCIAL: LOB[] = [
  { id: 'wc', label: "Workers' Comp", pct: 18, cfHelp: true },
  { id: 'bop', label: 'BOP', pct: 16, cfHelp: true },
  { id: 'gl', label: 'General Liability', pct: 14, cfHelp: true },
  { id: 'cyber', label: 'Cyber', pct: 8, cfHelp: true },
  { id: 'im', label: 'Inland Marine', pct: 7, cfHelp: true },
  { id: 'epli', label: 'EPLI', pct: 6, cfHelp: true },
  { id: 'do', label: 'D&O', pct: 6, cfHelp: true },
  { id: 'cauto', label: 'Commercial Auto', pct: 25, cfHelp: true },
];

export const LOB_PERSONAL: LOB[] = [
  { id: 'pauto', label: 'Personal Auto', pct: 55, cfHelp: false },
  { id: 'home', label: 'Homeowners', pct: 30, cfHelp: false },
  { id: 'pumb', label: 'Personal Umbrella', pct: 10, cfHelp: false },
  { id: 'other', label: 'Other Personal', pct: 5, cfHelp: false },
];

export const SEGMENTS = {
  startup: { annualPremium: 5000000, quoteVol: 100, monthlyFee: 3000, implFee: 5000, buildYear1: 200000, buildAnnual: 60000, staffCount: 3, itHours: 30 },
  mid: { annualPremium: 50000000, quoteVol: 500, monthlyFee: 6000, implFee: 25000, buildYear1: 500000, buildAnnual: 200000, staffCount: 10, itHours: 80 },
  enterprise: { annualPremium: 500000000, quoteVol: 5000, monthlyFee: 25000, implFee: 100000, buildYear1: 3500000, buildAnnual: 1200000, staffCount: 50, itHours: 300 }
};

export interface LobStateItem {
  on: boolean;
  pct: number;
}

export interface CalculatorInputs {
  projYears: number;
  companyName: string;

  // Business Mix
  commPct: number;
  admittedPct: number;
  commercialLobs: Record<string, LobStateItem>;
  personalLobs: Record<string, LobStateItem>;
  otherLobName: string;
  otherLobPct: number;
  otherLobCF: boolean;

  // Business Profile
  annualPremium: number;
  commissionRate: number;
  newBizRate: number;
  renewalRate: number;

  // Quoting Operations
  quoteVol: number;
  bindCurrent: number;
  bindCF: number;
  minCurrent: number;
  minCF: number;
  hourlyCost: number;
  staffCount: number;

  // Quality & Compliance
  errorCurrent: number;
  errorCF: number;
  costPerError: number;

  // Tech Investment
  implFee: number;
  monthlyFee: number;
  buildYear1: number;
  buildAnnual: number;
  itRate: number;
  itHours: number;
  carrierIntegrations: number;
}

export interface YearResult {
  year: number;
  newBizThisYear: number;
  renewalsThisYear: number;
  incrementalPremium: number;
  cumNewPremium: number;
  commOnIncremental: number;
  addlBoundPerYear: number;
  addlRevBind: number;
  hoursSaved: number;
  timeSavingsVal: number;
  productivityReinvest: number;
  errorSavings: number;
  carrierVal: number;
  itSavings: number;
  totalValue: number;
  cfCost: number;
  buildCost: number;
  netROI: number;
}

export interface BreakdownItem extends LOB {
  premium: number;
  on: boolean;
}

export interface LOBBreakdown {
  commTotal: number;
  persTotal: number;
  admTotal: number;
  ensTotal: number;
  commLOBs: BreakdownItem[];
  persLOBs: BreakdownItem[];
  cfReachable: number;
  commSelectedPct: number;
  otherName: string;
  otherPct: number;
  otherCF: boolean;
  otherPrem: number;
}

export function getLOBBreakdown(inputs: CalculatorInputs): LOBBreakdown {
  const { annualPremium: totalPremium, commPct, admittedPct, commercialLobs, personalLobs, otherLobName, otherLobPct, otherLobCF } = inputs;
  const commTotal = totalPremium * (commPct / 100);
  const persTotal = totalPremium * ((100 - commPct) / 100);
  const admTotal = commTotal * (admittedPct / 100);
  const ensTotal = commTotal * ((100 - admittedPct) / 100);

  // Normalize commercial LOB pcts to sum to 100 (within active only for proportioning)
  let commActPctSum = LOB_COMMERCIAL.reduce((s, l) => s + (commercialLobs[l.id]?.pct || 0), 0);
  if (otherLobName && otherLobPct > 0) {
    commActPctSum += otherLobPct;
  }
  if (commActPctSum === 0) commActPctSum = 100;

  const commLOBs: BreakdownItem[] = LOB_COMMERCIAL.map(l => {
    const st = commercialLobs[l.id] || { on: true, pct: l.pct };
    return {
      ...l,
      premium: commTotal * (st.pct / commActPctSum),
      on: st.on,
      pct: st.pct,
    };
  });

  let persActPctSum = LOB_PERSONAL.reduce((s, l) => s + (personalLobs[l.id]?.pct || 0), 0);
  if (persActPctSum === 0) persActPctSum = 100;

  const persLOBs: BreakdownItem[] = LOB_PERSONAL.map(l => {
    const st = personalLobs[l.id] || { on: true, pct: l.pct };
    return {
      ...l,
      premium: persTotal * (st.pct / persActPctSum),
      on: st.on,
      pct: st.pct,
    };
  });

  // CoverForce-reachable = commercial LOBs that are toggled ON
  let cfReachable = commLOBs.filter(l => l.on).reduce((s, l) => s + l.premium, 0);
  
  // Other LOB - manually entered
  let otherPrem = 0;
  if (otherLobName && otherLobPct > 0) {
    otherPrem = commTotal * (otherLobPct / commActPctSum);
    commLOBs.push({ id: 'other', label: otherLobName, premium: otherPrem, on: true, cfHelp: otherLobCF, pct: otherLobPct });
    if (otherLobCF) cfReachable += otherPrem;
  }

  const commSelectedPct = commTotal > 0 ? (cfReachable / commTotal) * 100 : 0;

  return {
    commTotal, persTotal, admTotal, ensTotal, commLOBs, persLOBs, cfReachable, commSelectedPct,
    otherName: otherLobName, otherPct: otherLobPct, otherCF: otherLobCF, otherPrem
  };
}

export interface CalculationResult {
  years: YearResult[];
  totalROI: number;
  totalCFSpend: number;
  roiMult: number;
  payback: number;
  doNothing: number;
  buildTotal: number;
  monthlyVal: number;
  itSavingsTotal: number;
  commTotal: number;
  inputs: CalculatorInputs;
  lobBreakdown: LOBBreakdown;
  integrationComplexityMultiplier: number;
  integrationBuildCost: number;
  integrationAnnualCost: number;
}

export function compute(inputs: CalculatorInputs): CalculationResult {
  const lobData = getLOBBreakdown(inputs);
  
  // Use CF-reachable premium for ROI (commercial LOBs that are toggled on)
  const annualPremium = lobData.cfReachable > 0 ? lobData.cfReachable : inputs.annualPremium;
  
  const commRate = inputs.commissionRate / 100;
  const newBizRate = inputs.newBizRate / 100;
  const renewalRate = inputs.renewalRate / 100;
  const quoteVol = inputs.quoteVol;
  const bindCurrent = inputs.bindCurrent / 100;
  const bindCF = inputs.bindCF / 100;
  const minCurrent = inputs.minCurrent;
  const minCF = inputs.minCF;
  const hourly = inputs.hourlyCost;
  const errorCurrent = inputs.errorCurrent / 100;
  const errorCF = inputs.errorCF / 100;
  const costPerError = inputs.costPerError;
  const implFee = inputs.implFee;
  const monthlyFee = inputs.monthlyFee;
  const buildYear1 = inputs.buildYear1;
  const buildAnnual = inputs.buildAnnual;
  const itRate = inputs.itRate;
  const itHours = inputs.itHours;
  const carrierIntegrations = inputs.carrierIntegrations || 5;

  // Carrier integration complexity cost model:
  const integrationComplexityMultiplier = 1 + (carrierIntegrations - 1) * 0.08; 
  const perIntegrationBuildCost = 15000;
  const perIntegrationAnnualMaint = 8000;
  const integrationBuildCost = carrierIntegrations * perIntegrationBuildCost * integrationComplexityMultiplier;
  const integrationAnnualCost = carrierIntegrations * perIntegrationAnnualMaint * integrationComplexityMultiplier;

  // annual revenue per bound policy (implied)
  const totalBound = quoteVol * 12 * bindCurrent;
  const revPerPolicy = totalBound > 0 ? (annualPremium * commRate) / totalBound : 500;

  const years: YearResult[] = [];
  let cumNewPremium = 0;

  for (let y = 1; y <= inputs.projYears; y++) {
    const newBizThisYear = annualPremium * newBizRate * y;
    const renewalsThisYear = cumNewPremium * renewalRate;
    const incrementalPremium = newBizThisYear + renewalsThisYear;
    cumNewPremium += newBizThisYear;

    const commOnIncremental = incrementalPremium * commRate;

    // Bind lift
    const addlBoundPerYear = quoteVol * 12 * (bindCF - bindCurrent);
    const addlRevBind = addlBoundPerYear * revPerPolicy;

    // Time savings
    const hoursSaved = ((minCurrent - minCF) * quoteVol * 12) / 60;
    const timeSavingsVal = hoursSaved * hourly;

    // Productivity reinvestment - hours freed × 40% redeployed to revenue-gen at 50% productivity uplift
    const productivityReinvest = hoursSaved * hourly * 0.4;

    // Error reduction
    const errorSavings = (errorCurrent - errorCF) * quoteVol * 12 * costPerError;

    const carrierVal = 0; // Carrier expansion removed

    // IT labor saved
    const itSavings = itHours * 12 * itRate;

    const cfCost = y === 1 ? (implFee + monthlyFee * 12) : monthlyFee * 12;
    const itLaborAnnual = itHours * 12 * itRate;
    const buildCost = y === 1
      ? (buildYear1 + buildAnnual + integrationBuildCost + itLaborAnnual)
      : (buildAnnual + integrationAnnualCost + itLaborAnnual);

    const totalValue = commOnIncremental + addlRevBind + timeSavingsVal + productivityReinvest + errorSavings + carrierVal + itSavings;
    const netROI = totalValue - cfCost;

    years.push({
      year: y,
      newBizThisYear, renewalsThisYear, incrementalPremium,
      cumNewPremium, commOnIncremental,
      addlBoundPerYear, addlRevBind,
      hoursSaved, timeSavingsVal, productivityReinvest,
      errorSavings, carrierVal, itSavings,
      totalValue, cfCost, buildCost, netROI
    });
  }

  const totalROI = years.reduce((s, y) => s + y.netROI, 0);
  const totalCFSpend = years.reduce((s, y) => s + y.cfCost, 0);
  const roiMult = totalCFSpend > 0 ? totalROI / totalCFSpend : 0;
  const monthlyVal = years[0].totalValue / 12;
  const payback = totalCFSpend > 0 && monthlyVal > 0 ? (implFee + monthlyFee * 12) / monthlyVal : 0;
  const doNothing = years.reduce((s, y) => s + y.totalValue, 0);
  const buildTotal = years.reduce((s, y) => s + y.buildCost, 0);
  const itSavingsTotal = years.reduce((s, y) => s + y.itSavings, 0);
  const commTotal = years.reduce((s, y) => s + y.commOnIncremental, 0);

  return {
    years, totalROI, totalCFSpend, roiMult, payback, doNothing, buildTotal, monthlyVal, itSavingsTotal, commTotal,
    inputs, lobBreakdown: lobData, integrationComplexityMultiplier, integrationBuildCost, integrationAnnualCost
  };
}
