import { CalculationResult } from '@/lib/calculations';
import { fmtM, fmt } from '@/lib/formatters';

/**
 * Generates a CSV file containing the Full Model data
 */
export function exportToCSV(results: CalculationResult, companyName: string) {
  const { years, inputs, lobBreakdown } = results;
  const dateStr = new Date().toISOString().split('T')[0];

  let csv = `CoverForce ROI Analysis - ${companyName},,\nPrepared: ${dateStr},,\n,,\n`;

  // 1. INPUTS
  csv += `METRIC,VALUE,NOTES\nBUSINESS PROFILE,,\n`;
  csv += `Annual Premium (CF Reachable),"${fmtM(lobBreakdown.cfReachable)}",Total addressable premium in CF reach\n`;
  csv += `Commission Rate,${inputs.commissionRate}%,Avg blended commission rate\n`;
  csv += `New Business Growth Rate / Year,${inputs.newBizRate}%,Producer-driven new business annually\n`;
  csv += `Renewal Retention Rate,${inputs.renewalRate}%,% of book renewing each year\n,,\n`;

  csv += `QUOTING OPERATIONS,,\n`;
  csv += `Monthly Quote Volume,${inputs.quoteVol},Quotes generated per month\n`;
  csv += `Current Bind Rate,${inputs.bindCurrent}%,Current quote-to-bind conversion\n`;
  csv += `Bind Rate With CoverForce,${inputs.bindCF}%,Expected bind rate with CF\n`;
  csv += `Minutes per Quote - Current,${inputs.minCurrent},Time per quote today\n`;
  csv += `Minutes per Quote - CoverForce,${inputs.minCF},Time per quote with CF\n`;
  csv += `Blended Staff Hourly Cost,"${fmtM(inputs.hourlyCost).replace('M', '')}",Blended hourly rate\n`;
  csv += `Number of Producers / Underwriters,${inputs.staffCount},Staff generating quotes\n,,\n`;

  csv += `QUALITY & COMPLIANCE,,\n`;
  csv += `Manual Error Rate - Current,${inputs.errorCurrent}%,% of quotes with errors\n`;
  csv += `Manual Error Rate - CoverForce,${inputs.errorCF}%,Expected error rate with CF\n`;
  csv += `Cost per Error / Rework,"${fmtM(inputs.costPerError).replace('M', '')}",Rework + compliance cost per error\n,,\n`;

  csv += `TECHNOLOGY INVESTMENT,,\n`;
  csv += `CoverForce Implementation Fee,"${fmtM(inputs.implFee)}",One-time onboarding fee\n`;
  csv += `CoverForce Monthly Platform Fee,"${fmtM(inputs.monthlyFee)}",Monthly subscription\n`;
  csv += `In-House Build Cost - Year 1,"${fmtM(inputs.buildYear1)}",Estimated custom build cost\n`;
  csv += `In-House Annual Maintenance,"${fmtM(inputs.buildAnnual)}",Annual maintenance & support\n`;
  csv += `IT Hourly Rate,"${fmtM(inputs.itRate).replace('M', '')}",Internal IT / dev hourly rate\n`;
  csv += `IT Hours / Month,${inputs.itHours},Monthly IT overhead for platform\n`;
  csv += `Carrier API Integrations (Current),${inputs.carrierIntegrations},Non-linear complexity multiplier applied\n,,\n`;

  csv += `PROJECTION,,\n`;
  csv += `Projection Period (Years),${inputs.projYears},Years to model\n,,\n`;

  // 2. WATERFALL
  csv += `CoverForce ROI Waterfall - ${companyName},,,,,,,,,,,,\n,,,,,,,,,,,,\n`;
  csv += `Year,New Business Premium,Renewal Premium,Incremental Premium,Commission Earned,Bind Lift Revenue,Time Savings Value,Productivity Reinvestment,Error Reduction,IT Labor Savings,Total Annual Value,CoverForce Cost,Net ROI\n`;

  years.forEach(yr => {
    csv += `Year ${yr.year},"${fmtM(yr.newBizThisYear)}","${fmtM(yr.renewalsThisYear)}","${fmtM(yr.incrementalPremium)}","${fmtM(yr.commOnIncremental)}","${fmtM(yr.addlRevBind)}","${fmtM(yr.timeSavingsVal)}","${fmtM(yr.productivityReinvest)}","${fmtM(yr.errorSavings)}","${fmtM(yr.itSavings)}","${fmtM(yr.totalValue)}","${fmtM(yr.cfCost)}","${fmtM(yr.netROI)}"\n`;
  });

  // Waterfall Totals
  const sum = (fn: (y: any) => number) => fmtM(years.reduce((s, y) => s + fn(y), 0));
  csv += `${inputs.projYears}-YEAR TOTAL,"${sum(y => y.newBizThisYear)}","${sum(y => y.renewalsThisYear)}","${sum(y => y.incrementalPremium)}","${sum(y => y.commOnIncremental)}","${sum(y => y.addlRevBind)}","${sum(y => y.timeSavingsVal)}","${sum(y => y.productivityReinvest)}","${sum(y => y.errorSavings)}","${sum(y => y.itSavings)}","${fmtM(results.doNothing)}","${fmtM(results.totalCFSpend)}","${fmtM(results.totalROI)}"\n,,\n`;

  // 3. BUILD VS BUY
  csv += `Build vs. Buy Analysis - ${companyName},,,,\n${inputs.projYears}-Year Total Cost Comparison,,,,\n,,,,\n`;
  csv += `Line Item,Build In-House,CoverForce,Savings,Notes\n`;
  const itAnn = inputs.itHours * 12 * inputs.itRate;
  csv += `Year 1 Dev & Setup,"${fmtM(inputs.buildYear1)}","${fmtM(inputs.implFee + inputs.monthlyFee * 12)}","${fmtM(inputs.buildYear1 - (inputs.implFee + inputs.monthlyFee * 12))}",Custom engineering + QA\n`;
  csv += `Yr 2–${inputs.projYears} Maintenance,"${fmtM(inputs.buildAnnual * (inputs.projYears - 1))}","${fmtM(inputs.monthlyFee * 12 * (inputs.projYears - 1))}","${fmtM((inputs.buildAnnual - inputs.monthlyFee * 12) * (inputs.projYears - 1))}",Annual maintenance × ${inputs.projYears - 1} yrs\n`;
  csv += `IT Labor (${inputs.projYears} yrs),"${fmtM(itAnn * inputs.projYears)}","$0","${fmtM(itAnn * inputs.projYears)}",${inputs.itHours} hrs/mo × $${inputs.itRate}/hr\n`;
  csv += `${inputs.carrierIntegrations} Carrier API Integrations,"${fmtM(results.integrationBuildCost + results.integrationAnnualCost * (inputs.projYears - 1))}","Included in platform","${fmtM(results.integrationBuildCost + results.integrationAnnualCost * (inputs.projYears - 1))}",${results.integrationComplexityMultiplier.toFixed(2)}x complexity multiplier\n`;
  csv += `TOTAL,"${fmtM(results.buildTotal)}","${fmtM(results.totalCFSpend)}","${fmtM(results.buildTotal - results.totalCFSpend)}",\n,,,,\n`;

  // COST OF INACTION
  csv += `COST OF INACTION,,,,\nYear,Value Left on Table,Cumulative Missed Value,,\n`;
  years.forEach(yr => {
    const cum = years.slice(0, yr.year).reduce((s, yy) => s + yy.totalValue, 0);
    csv += `Year ${yr.year},"${fmtM(yr.totalValue)}","${fmtM(cum)}",,\n`;
  });
  csv += `${inputs.projYears}-YR TOTAL MISSED,"${fmtM(results.doNothing)}","${fmtM(results.doNothing)}",,\n,,\n`;

  // 4. SUMMARY
  csv += `CoverForce ROI Summary - ${companyName},,\nPrepared: ${dateStr} | ${inputs.projYears}-Year Projection,,\n,,\n`;
  csv += `KEY METRICS,,\n`;
  csv += `5-Year Net ROI,"${fmtM(results.totalROI)}",Total value minus CoverForce spend\n`;
  csv += `ROI Multiple,${results.roiMult.toFixed(1)}x,Return on every dollar invested\n`;
  csv += `Payback Period,${results.payback.toFixed(1)} months,Time to break even on CF investment\n`;
  csv += `Year 1 Net ROI,"${fmtM(years[0].netROI)}",First year return\n`;
  csv += `Monthly Value (Yr 1),"${fmtM(results.monthlyVal)}",Avg monthly impact in Year 1\n,,\n`;

  csv += `INVESTMENT,,\n`;
  csv += `Total CoverForce Spend,"${fmtM(results.totalCFSpend)}",Impl + monthly fees over projection\n`;
  csv += `Cost if You Build,"${fmtM(results.buildTotal)}",All-in build + maintain cost\n`;
  csv += `Build vs. Buy Savings,"${fmtM(results.buildTotal - results.totalCFSpend)}",CoverForce advantage over building\n`;
  csv += `Cost of Inaction,"${fmtM(results.doNothing)}",Value left on table with no CF\n,,\n`;

  csv += `YEAR 1 VALUE BREAKDOWN,,\n`;
  csv += `Incremental Commission,"${fmtM(years[0].commOnIncremental)}",\n`;
  csv += `Bind Rate Lift Revenue,"${fmtM(years[0].addlRevBind)}",\n`;
  csv += `Time Savings Value,"${fmtM(years[0].timeSavingsVal)}",\n`;
  csv += `Productivity Reinvestment,"${fmtM(years[0].productivityReinvest)}",\n`;
  csv += `Error Reduction Savings,"${fmtM(years[0].errorSavings)}",\n`;
  csv += `IT Labor Savings,"${fmtM(years[0].itSavings)}",\n`;
  csv += `YEAR 1 TOTAL VALUE,"${fmtM(years[0].totalValue)}",\n`;

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CoverForce_ROI_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers the browser's native print dialog to generate a PDF.
 */
export function exportToPDF(containerId: string, companyName: string) {
  setTimeout(() => {
    window.print();
  }, 100);
}

/**
 * Copies a text summary to the clipboard
 */
export function copyShareText(results: CalculationResult, companyName: string) {
  const { projYears, commissionRate } = results.inputs;
  const yr1 = results.years[0];

  const text = `CoverForce ROI Summary - ${companyName}

${projYears}-Year Net ROI: ${fmtM(results.totalROI)}
ROI Multiple: ${results.roiMult.toFixed(1)}x
Payback Period: ${results.payback.toFixed(1)} months
Year 1 Value: ${fmtM(yr1.totalValue)}
Hours Freed (Year 1): ${fmt(yr1.hoursSaved)}h
IT Labor Savings (${projYears}yr): ${fmtM(results.itSavingsTotal)}
Build vs. Buy Savings: ${fmtM(results.buildTotal - results.totalCFSpend)}
Monthly Cost of Inaction: ${fmtM(results.monthlyVal)}

Key Insight: At a ${commissionRate}% commission rate on ${fmtM(results.inputs.annualPremium)} current premium, CoverForce generates ${fmtM(results.totalROI)} net over ${projYears} years. Every month of delay costs ${fmtM(results.monthlyVal)}.`;

  navigator.clipboard.writeText(text).then(() => {
    alert('Executive summary copied to clipboard!');
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
    alert("Failed to copy to clipboard.");
  });
}
