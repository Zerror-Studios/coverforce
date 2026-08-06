import { useState, useMemo, useCallback } from 'react';
import { 
  CalculatorInputs, 
  CalculationResult, 
  compute, 
  LOB_COMMERCIAL, 
  LOB_PERSONAL, 
  SEGMENTS, 
  LobStateItem
} from '@/lib/calculations';

const defaultCommercialLobs: Record<string, LobStateItem> = Object.fromEntries(
  LOB_COMMERCIAL.map(l => [l.id, { on: true, pct: l.pct }])
);

const defaultPersonalLobs: Record<string, LobStateItem> = Object.fromEntries(
  LOB_PERSONAL.map(l => [l.id, { on: true, pct: l.pct }])
);

const initialInputs: CalculatorInputs = {
  projYears: 5,
  companyName: 'Your Company',

  // Business Mix
  commPct: 60,
  admittedPct: 70,
  commercialLobs: defaultCommercialLobs,
  personalLobs: defaultPersonalLobs,
  otherLobName: '',
  otherLobPct: 0,
  otherLobCF: false,

  // Default to 'mid' segment values
  ...SEGMENTS.mid,

  // Remaining standard defaults
  commissionRate: 10,
  newBizRate: 20,
  renewalRate: 80,
  bindCurrent: 15,
  bindCF: 22,
  minCurrent: 30,
  minCF: 8,
  hourlyCost: 65,
  errorCurrent: 5,
  errorCF: 1,
  costPerError: 250,
  itRate: 95,
  carrierIntegrations: 5,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const applySegment = useCallback((segmentId: keyof typeof SEGMENTS) => {
    setInputs(prev => ({ ...prev, ...SEGMENTS[segmentId] }));
  }, []);

  const toggleCommercialLob = useCallback((id: string) => {
    setInputs(prev => ({
      ...prev,
      commercialLobs: {
        ...prev.commercialLobs,
        [id]: {
          ...prev.commercialLobs[id],
          on: !prev.commercialLobs[id].on
        }
      }
    }));
  }, []);

  const setCommercialLobPct = useCallback((id: string, pct: number) => {
    setInputs(prev => ({
      ...prev,
      commercialLobs: {
        ...prev.commercialLobs,
        [id]: {
          ...prev.commercialLobs[id],
          pct
        }
      }
    }));
  }, []);

  const setPersonalLobPct = useCallback((id: string, pct: number) => {
    setInputs(prev => ({
      ...prev,
      personalLobs: {
        ...prev.personalLobs,
        [id]: {
          ...prev.personalLobs[id],
          pct
        }
      }
    }));
  }, []);

  const results: CalculationResult = useMemo(() => {
    return compute(inputs);
  }, [inputs]);

  return {
    inputs,
    updateInput,
    applySegment,
    toggleCommercialLob,
    setCommercialLobPct,
    setPersonalLobPct,
    results,
  };
}
