import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Coins, 
  Percent, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { Expense, AccountsReceivable } from '../../types';

interface FinancialAnalyticsProps {
  expenses: Expense[];
  receivables: AccountsReceivable[];
  currency: string;
}

export default function FinancialAnalytics({
  expenses,
  receivables,
  currency,
}: FinancialAnalyticsProps) {
  const [selectedHorizon, setSelectedHorizon] = useState<'Q2' | 'YTD'>('YTD');

  // Hardcode statistical aggregations
  const coreRevenueYTD = 412500.00;
  const coreLogisticsCostYTD = 145000.00;
  const grossMarginSpread = coreRevenueYTD - coreLogisticsCostYTD;
  const grossMarginPercentYTD = ((grossMarginSpread / coreRevenueYTD) * 100).toFixed(1);

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">BUSINESS INTELLIGENCE</span>
          <h2 className="text-sm font-bold text-slate-800">Financial Analytics</h2>
        </div>
      </div>

      {/* Horizon selector options */}
      <div className="flex bg-slate-100 p-1 rounded-lg text-xs leading-none">
        {['Q2 (Forecast)', 'YTD (Actuals)'].map((hz) => {
          const isSelected = selectedHorizon === hz.split(' ')[0];
          return (
            <button
              key={hz}
              onClick={() => setSelectedHorizon(hz.split(' ')[0] as 'Q2' | 'YTD')}
              className={`flex-1 text-center py-1.5 rounded font-bold transition ${
                isSelected 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {hz}
            </button>
          );
        })}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1">
          <span className="text-[9px] text-slate-400 font-bold font-mono">GROSS PROFIT MATRIX</span>
          <p className="font-extrabold text-slate-800 text-base font-mono">
           {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
           {grossMarginSpread.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5"><ArrowUpRight size={10} /> +12.4% vs L-Yr</span>
        </div>

        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1">
          <span className="text-[9px] text-slate-400 font-bold font-mono">RETAINED MARGIN %</span>
          <p className="font-extrabold text-indigo-600 text-base font-mono">
            {grossMarginPercentYTD}%
          </p>
          <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5"><ArrowUpRight size={10} /> Safe threshold</span>
        </div>
      </div>

      {/* Dynamic line chart SVG representing Growth analysis */}
      <div className="bg-slate-900 border border-sky-950 text-white p-4 rounded-xl space-y-2.5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] text-sky-400 font-mono tracking-wider block">YTD GROWTH OVERVIEW</span>
            <h4 className="text-xs font-bold text-slate-100 mt-0.5">Revenue stream vs Operational Cost lag</h4>
          </div>
          <div className="text-right text-[10px] space-y-0.5">
            <span className="inline-block h-2.5 w-2.5 bg-sky-410 rounded-full mr-1" />
            <span className="text-sky-300 font-bold font-mono">Income</span>
          </div>
        </div>

        {/* Double multi-line interactive SVG chart layout */}
        <div className="h-32 pt-2">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            {/* Grid references */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1,1" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1,1" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1,1" />

            {/* Income line plot */}
            <path 
              d="M 0 35 L 20 28 L 40 18 L 60 22 L 80 12 L 100 5" 
              fill="none" 
              stroke="#0ea5e9" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            {/* Cost level line plot */}
            <path 
              d="M 0 38 L 20 34 L 40 31 L 60 30 L 80 26 L 100 24" 
              fill="none" 
              stroke="#6366f1" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeDasharray="2,2"
            />
          </svg>
        </div>

        <div className="flex justify-between font-mono text-[8px] text-slate-500 pt-1.5 border-t border-slate-800">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun (Est)</span>
        </div>
      </div>

      {/* Expense Allocation breakdowns bento circle layout */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Operational Category Breakdowns</h3>
        
        <div className="flex items-center gap-6">
          {/* Circular donut chart mock done with modern SVG */}
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* background full track */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              {/* Freight segment - 55% */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#0ea5e9" strokeWidth="3.2" strokeDasharray="55 45" strokeDashoffset="0" />
              {/* Logistics segment - 30% */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#6366f1" strokeWidth="3.2" strokeDasharray="30 70" strokeDashoffset="-55" />
              {/* Miscellaneous - 15% */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-85" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold font-mono text-slate-800">100%</span>
              <span className="text-[7px] text-slate-400 font-medium">Overhead</span>
            </div>
          </div>

          {/* Core captions grid */}
          <div className="flex-1 space-y-1.5 text-[11px] text-slate-650">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 font-semibold"><span className="h-2 w-2 rounded-full bg-sky-500 block" /> Ocean/Freight Cargo</span>
              <span className="font-mono text-slate-800 font-bold">55%</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-50 pt-1">
              <span className="flex items-center gap-1 font-semibold"><span className="h-2 w-2 rounded-full bg-indigo-500 block" /> Ground Courier (3PL)</span>
              <span className="font-mono text-slate-800 font-bold">30%</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-50 pt-1">
              <span className="flex items-center gap-1 font-semibold"><span className="h-2 w-2 rounded-full bg-amber-500 block" /> Packaging Writeoffs</span>
              <span className="font-mono text-slate-800 font-bold">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
