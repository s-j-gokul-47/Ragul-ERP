import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FolderLock
} from 'lucide-react';
import { Expense, AccountsReceivable } from '../../types';

interface FinancialOverviewProps {
  expenses: Expense[];
  receivables: AccountsReceivable[];
  currency: string;
  setActiveScreen: (screen: string) => void;
}

export default function FinancialOverview({
  expenses,
  receivables,
  currency,
  setActiveScreen,
}: FinancialOverviewProps) {
  // Financial valuations calculation
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalEarnedAndSettled = receivables
    .filter(rec => rec.status === 'Paid')
    .reduce((acc, rec) => acc + rec.amountPaid, 0);

  const outstandingInvoices = receivables
    .filter(rec => rec.status !== 'Paid')
    .reduce((acc, rec) => acc + (rec.amount - rec.amountPaid), 0);

  // Hardcode static operational ledger starting balances
  const initialOperatingCash = 185000.00;
  const currentLiquidCash = initialOperatingCash + totalEarnedAndSettled - totalExpenses;

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">TREASURY MANAGEMENT</span>
          <h2 className="text-sm font-bold text-slate-800">Financial Overview</h2>
        </div>
      </div>

      {/* Main Corporate Treasury Card */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-sky-950 space-y-3.5 relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
          <Wallet size={120} />
        </div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] text-sky-400 font-mono tracking-widest block uppercase">LIQUID OPERATING RESERVE ({currency})</span>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">
            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
            {currentLiquidCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-450 block leading-none pt-0.5">Dallas physical vault & vault reserve checks</span>
        </div>
      </div>

      {/* Dual Income Expense Widget stats */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
            <span>TOTAL EARNED & PAID</span>
            <TrendingUp size={12} className="text-emerald-500" />
          </div>
          <p className="font-bold text-slate-800 text-base font-mono">
            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
            {totalEarnedAndSettled.toLocaleString()}
          </p>
          <span className="text-[9px] text-slate-400">Paid invoices settled</span>
        </div>

        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
            <span>OPERATING OVERHEAD</span>
            <TrendingDown size={12} className="text-rose-500" />
          </div>
          <p className="font-bold text-slate-800 text-base font-mono">
            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
            {totalExpenses.toLocaleString()}
          </p>
          <span className="text-[9px] text-slate-400 font-semibold text-rose-600 block hover:underline cursor-pointer" onClick={() => setActiveScreen('Expense Tracking')}>
            View itemized book →
          </span>
        </div>
      </div>

      {/* Receivables block widget */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Ledger Aging Balances</h3>
          <button 
            onClick={() => setActiveScreen('Accounts Receivable')}
            className="text-xs text-sky-600 font-bold hover:underline"
          >
            Manage Book →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5 border-r border-slate-50">
            <span className="text-[10px] text-slate-400">Claims Outstanding</span>
            <p className="text-base font-extrabold text-slate-800 font-mono">
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
              {outstandingInvoices.toLocaleString()}
            </p>
          </div>
          <div className="space-y-0.5 pl-2">
            <span className="text-[10px] text-slate-400">Aging Ratio Overdue</span>
            <p className="text-base font-extrabold text-rose-500 font-mono">18.4%</p>
          </div>
        </div>
      </div>

      {/* Interactive Quick navigation card links */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setActiveScreen('Expense Tracking')}
          className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left hover:bg-slate-100 hover:border-slate-300 transition flex justify-between items-center"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">LOGISTICS</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">Record Expense</p>
          </div>
          <div className="p-1.5 bg-sky-100 text-sky-800 rounded">
            <TrendingDown size={14} />
          </div>
        </button>

        <button 
          onClick={() => setActiveScreen('Financial Analytics')}
          className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left hover:bg-slate-100 hover:border-slate-300 transition flex justify-between items-center"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">REPORTING</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">P&L Analytics</p>
          </div>
          <div className="p-1.5 bg-indigo-100 text-indigo-800 rounded">
            <TrendingUp size={14} />
          </div>
        </button>
      </div>

      {/* Safety audit shield */}
      <div className="bg-slate-50 rounded-xl border p-3 border-slate-100 text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <FolderLock size={12} className="text-slate-400 flex-shrink-0" />
        <span>Federal Corporate Audit Compliant Ledger, encrypted and logged daily.</span>
      </div>
    </div>
  );
}
