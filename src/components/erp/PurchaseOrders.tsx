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
  Briefcase
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
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">SUPPLY CHAIN PIPELINE</span>
          <h2 className="text-sm font-bold text-slate-800">Purchase Orders</h2>
        </div>
        <button 
          onClick={() => setActiveScreen('New Purchase Orders')}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> Draft PO
        </button>
      </div>

      {/* KPI Panel */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-sky-950 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-sky-400 font-mono tracking-wider">OUTSTANDING PIPELINE EXPENSE</span>
          <p className="text-lg font-bold text-slate-100 mt-1">${totalPipelineVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <span className="text-[9px] text-slate-400 leading-none block mt-0.5">Committed capital to vendors</span>
        </div>
        <div className="p-2.5 bg-slate-800 rounded-lg text-sky-500 border border-slate-700">
          <Briefcase size={20} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search PO code or supplier name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500 transition outline-none"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg gap-0.5 overflow-x-auto scrollbar-none">
          {(['All', 'Draft', 'Sent', 'Partially Received', 'Received'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`flex-shrink-0 px-3 py-1 text-center rounded text-[10px] sm:text-xs font-semibold transition ${
                selectedStatus === st 
                  ? 'bg-white text-slate-800 shadow-xs font-bold' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders List mapping */}
      <div className="space-y-2.5">
        {filteredPOs.length > 0 ? (
          filteredPOs.map((po) => {
            const lineCount = po.items.length;
            return (
              <div 
                key={po.id}
                id={`po-list-card-${po.id}`}
                onClick={() => {
                  setSelectedPOId(po.id);
                  setActiveScreen('PO Details');
                }}
                className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs hover:border-slate-300 transition cursor-pointer flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-mono text-slate-800">{po.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        po.status === 'Received' ? 'bg-emerald-50 text-emerald-700' :
                        po.status === 'Partially Received' ? 'bg-indigo-50 text-indigo-700' :
                        po.status === 'Sent' ? 'bg-sky-50 text-sky-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{po.supplierName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Cost Value</p>
                    <p className="text-xs font-bold text-slate-800">${po.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] border-t border-slate-50 pt-2 text-slate-500">
                  <span className="font-mono flex items-center gap-1">
                    <Calendar size={10} className="text-sky-500" /> Ord: {po.orderDate}
                  </span>
                  <span className="font-semibold text-slate-600">
                    {lineCount} {lineCount === 1 ? 'item line' : 'item lines'}
                  </span>
                  <span className="text-sky-600 font-bold flex items-center gap-0.5 hover:underline" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPOId(po.id);
                    setActiveScreen('PO Details');
                  }}>
                    Details <ChevronRight size={10} />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <FileText size={30} className="mx-auto text-slate-300" />
            <p className="text-xs font-medium">No purchase order matches this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
