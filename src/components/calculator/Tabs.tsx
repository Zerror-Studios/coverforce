import React, { useState } from 'react';
import { CalculationResult } from '@/lib/calculations';

// We'll import individual tab components here as they are built
import RevenueMapTab from './tabs/RevenueMapTab';
import OverviewTab from './tabs/OverviewTab';
import CompoundingTab from './tabs/CompoundingTab';
import ProductivityTab from './tabs/ProductivityTab';
import BuildVsBuyTab from './tabs/BuildVsBuyTab';
import InactionTab from './tabs/InactionTab';
import FullModelTab from './tabs/FullModelTab';
import { Map, TrendingUp, RefreshCw, Zap, Scale, Coins, Table } from 'lucide-react';

interface Props {
  results: CalculationResult;
}

export type TabId = 'revmap' | 'overview' | 'compounding' | 'productivity' | 'buildvbuy' | 'inaction' | 'model';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'revmap', label: 'Revenue Map', icon: <Map className="w-4 h-4" /> },
  { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'compounding', label: 'Compounding Growth', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'productivity', label: 'Productivity Unlock', icon: <Zap className="w-4 h-4" /> },
  { id: 'buildvbuy', label: 'Build vs. Buy', icon: <Scale className="w-4 h-4" /> },
  { id: 'inaction', label: 'Cost of Inaction', icon: <Coins className="w-4 h-4" /> },
  { id: 'model', label: 'Full Model', icon: <Table className="w-4 h-4" /> },
];

export default function Tabs({ results }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="flex-1 w-full">
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-heading font-semibold tracking-tight transition-colors border rounded-lg ${activeTab === tab.id
              ? 'bg-[#3834a4] text-white border-[#3834a4] shadow-sm'
              : 'bg-white text-[#121C49] border-[#3834a4] hover:bg-gray-50 hover:text-[#0a143b]'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'revmap' && <RevenueMapTab results={results} />}
        {activeTab === 'overview' && <OverviewTab results={results} />}
        {activeTab === 'compounding' && <CompoundingTab results={results} />}
        {activeTab === 'productivity' && <ProductivityTab results={results} />}
        {activeTab === 'buildvbuy' && <BuildVsBuyTab results={results} />}
        {activeTab === 'inaction' && <InactionTab results={results} />}
        {activeTab === 'model' && <FullModelTab results={results} />}
      </div>
    </div>
  );
}
