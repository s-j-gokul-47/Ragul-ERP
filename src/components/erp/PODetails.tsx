import React from 'react';
import { 
  FileText, 
  ChevronLeft, 
  User, 
  DollarSign, 
  Calendar, 
  Check, 
  Truck, 
  Clock, 
  AlertCircle,
  ShieldAlert,
  Box,
  CheckCircle2,
  FileCheck2,
  CreditCard
} from 'lucide-react';
import { PurchaseOrder, InventoryItem } from '../../types';

interface PODetailsProps {
  selectedPOId: string | null;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setActiveScreen: (screen: string) => void;
}

export default function PODetails({
  selectedPOId,
  purchaseOrders,
  setPurchaseOrders,
  items,
  setItems,
  setActiveScreen,
}: PODetailsProps) {
  // Find current PO
  const po = purchaseOrders.find(p => p.id === selectedPOId) || purchaseOrders[0];

  if (!po) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 min-h-[400px]">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-700">No Purchase Order Selected</h3>
          <p className="text-sm font-medium text-slate-500">Please select an order from the pipeline to view details.</p>
        </div>
        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className="mt-4 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 hover:shadow-md transition-all duration-300"
        >
          Return to PO Pipeline
        </button>
      </div>
    );
  }

  // Handle Receiving PO items
  const handleReceivePO = () => {
    // 1. Mark PO as Received
    setPurchaseOrders(prev => prev.map(p => {
      if (p.id === po.id) {
        return { ...p, status: 'Received' };
      }
      return p;
    }));

    // 2. Increment stock level qty in InventoryItem list matching product SKU
    setItems(currentItems => {
      return currentItems.map(item => {
        // Find if this specific item SKU is listed on the PO
        const poLine = po.items.find(line => line.sku === item.sku);
        if (poLine) {
          // Found match! Increment quantities
          return {
            ...item,
            qty: item.qty + poLine.qty
          };
        }
        return item;
      });
    });
  };

  const statusConfig = {
    'Received': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Partially Received': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Sent': 'bg-cyan-100 text-cyan-700 border-cyan-200 animate-pulse',
    'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
    'All': ''
  }[po.status];

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-right-8 duration-500 fade-in">
      {/* Detail screen sub-header with back */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/60 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all duration-300 hover:-translate-x-1 border border-slate-200/50"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <span className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest flex items-center gap-1.5 mb-0.5">
            <FileText size={12} /> SECURE ARCHIVE DETAIL
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{po.id}</h2>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${statusConfig}`}>
              {po.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* PO Overview Details block */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase block mb-2 w-fit border border-slate-200/50">PARTNER SUPPLIER</span>
                <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">{po.supplierName}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-slate-100 pt-5 relative z-10">
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5"><Calendar size={12} className="text-cyan-500" /> ORDERED</span>
                <p className="font-bold text-slate-700">{po.orderDate}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5"><Clock size={12} className="text-cyan-500" /> EST LANDING</span>
                <p className="font-bold text-slate-700">{po.expectedDate}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5"><CreditCard size={12} className="text-cyan-500" /> BILLING TERMS</span>
                <p className="font-bold text-slate-700">{po.billingTerms}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5"><User size={12} className="text-emerald-500" /> ERP APPROVAL</span>
                <p className="font-bold text-slate-700">{po.approvedBy || 'SYSTEM'}</p>
              </div>
            </div>
          </div>

          {/* Item summary lines */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                  <Box size={16} />
                </div>
                Cargo Manifest Line Items
              </h3>
            </div>
            
            <div className="divide-y divide-slate-50 p-2">
              {po.items.map((line, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-500 font-mono bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded uppercase tracking-wider">SKU: {line.sku}</span>
                    </div>
                    <p className="font-bold text-slate-800 text-base">{line.itemName}</p>
                    <p className="text-xs text-slate-500 font-medium">{line.qty} Units requested &times; <span className="font-bold text-slate-600">${line.cost.toFixed(2)}</span> cost</p>
                  </div>
                  <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 sm:hidden">Line Total</p>
                    <p className="font-extrabold text-slate-800 text-lg">${(line.qty * line.cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* PO Total math */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Committed PO Total</span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">${po.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Received Intake registration trigger */}
          {po.status !== 'Received' ? (
            <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-200 rounded-3xl p-6 shadow-[0_8px_30px_rgb(79,70,229,0.08)] relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <Truck size={120} />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner mb-4">
                  <FileCheck2 size={24} />
                </div>
                
                <div>
                  <h4 className="text-lg font-extrabold text-indigo-900 leading-tight mb-2">Authorize Stock Intake</h4>
                  <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                    Verifying shipment delivery? Confirming intake will automatically register these quantities into the physical warehouse ledger.
                  </p>
                </div>
                
                <button 
                  id="btn-confirm-intake-po"
                  onClick={handleReceivePO}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  <CheckCircle2 size={18} /> Confirm Cargo Intake
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 transform translate-x-4 -translate-y-4">
                <CheckCircle2 size={120} />
              </div>
              
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner mb-4">
                  <Check size={24} />
                </div>
                
                <h4 className="text-lg font-extrabold text-emerald-900 leading-tight">Intake Logged & Sealed</h4>
                <p className="text-xs text-emerald-700/80 leading-relaxed font-medium">
                  This shipment was fully verified, stored, and integrated into active inventory ledger records.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
