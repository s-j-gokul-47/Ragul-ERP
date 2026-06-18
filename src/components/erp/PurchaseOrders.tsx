import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  Calendar, 
  User, 
  Coins, 
  DollarSign,
  Briefcase,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { PurchaseOrder, POStatus } from '../../types';

interface PurchaseOrdersProps {
  purchaseOrders: PurchaseOrder[];
  setSelectedPOId: (id: string) => void;
  setActiveScreen: (screen: string) => void;
}

export default function PurchaseOrders({
  purchaseOrders,
  setSelectedPOId,
  setActiveScreen,
}: PurchaseOrdersProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<POStatus | 'All'>('All');

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.supplierName.toLowerCase().includes(search.toLowerCase()) || 
                          po.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || po.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPipelineVal = purchaseOrders
    .filter(po => po.status === 'Sent' || po.status === 'Partially Received')
    .reduce((acc, current) => acc + current.total, 0);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Screen Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-5 rounded-2xl shadow-lg border border-cyan-900/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-widest font-bold flex items-center gap-2 mb-1.5">
            <TrendingUp size={12} /> SUPPLY CHAIN PIPELINE
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Purchase Orders
          </h2>
        </div>
        <button 
          onClick={() => setActiveScreen('New Purchase Orders')}
          className="relative z-10 flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
        >
          <Plus size={16} className="transition-transform group-hover/btn:rotate-90" /> Draft PO
        </button>
      </div>

      {/* KPI Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-slate-700 shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none transform scale-150">
          <DollarSign size={120} />
        </div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold flex items-center gap-2 mb-2">
            Outstanding Pipeline Expense
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              ${totalPipelineVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-slate-400 font-medium text-sm">USD</span>
          </div>
          <span className="text-xs text-slate-400 block mt-1.5">Total committed capital for incoming stock</span>
        </div>
        
        <div className="relative z-10 p-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl text-cyan-400 border border-slate-700 shadow-inner">
          <Briefcase size={28} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/60 backdrop-blur-xl p-3 rounded-2xl border border-white/50 shadow-sm space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search PO code or supplier name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/80 border border-slate-200/60 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center px-1">
          {(['All', 'Draft', 'Sent', 'Partially Received', 'Received'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                selectedStatus === st 
                  ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20 translate-y-[-1px]' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders List mapping */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPOs.length > 0 ? (
          filteredPOs.map((po, idx) => {
            const lineCount = po.items.length;
            
            const statusConfig = {
              'Received': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'Partially Received': 'bg-indigo-50 text-indigo-700 border-indigo-200',
              'Sent': 'bg-cyan-50 text-cyan-700 border-cyan-200',
              'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
              'All': ''
            }[po.status];

            return (
              <div 
                key={po.id}
                id={`po-list-card-${po.id}`}
                onClick={() => {
                  setSelectedPOId(po.id);
                  setActiveScreen('PO Details');
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-4 group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-widest">{po.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusConfig}`}>
                        {po.status}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-cyan-700 transition-colors">{po.supplierName}</h3>
                  </div>
                  <div className="text-right bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Value</p>
                    <p className="text-sm font-extrabold text-slate-800">${po.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] border-t border-slate-100 pt-3 text-slate-500 font-medium">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-cyan-500" /> Ord: <span className="font-bold text-slate-700">{po.orderDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Receipt size={14} className="text-slate-400" /> {lineCount} Lines
                    </span>
                  </div>
                  <span className="text-cyan-600 font-bold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-slate-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Purchase Orders</h3>
            <p className="text-sm">We couldn't find any POs matching your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
