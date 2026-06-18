import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  FilePlus2, 
  Calendar, 
  Truck, 
  Settings,
  X,
  CreditCard,
  Building2,
  Box,
  DollarSign
} from 'lucide-react';
import { PurchaseOrder, Supplier, InventoryItem } from '../../types';

interface NewPurchaseOrderProps {
  suppliers: Supplier[];
  items: InventoryItem[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  setActiveScreen: (screen: string) => void;
}

interface POLineItem {
  id: string;
  itemId: string;
  qty: number;
}

export default function NewPurchaseOrder({
  suppliers,
  items,
  setPurchaseOrders,
  setActiveScreen,
}: NewPurchaseOrderProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || 'sup-1');
  const [billingTerms, setBillingTerms] = useState('Net 30');
  const [expectedDaysLag, setExpectedDaysLag] = useState(7);
  
  // Custom draft lines inside composition
  const [lines, setLines] = useState<POLineItem[]>([
    { id: 'l-01', itemId: items[0]?.id || '', qty: 50 }
  ]);

  const handleAddLine = () => {
    setLines([...lines, { id: `l-${Date.now()}`, itemId: items[0]?.id || '', qty: 10 }]);
  };

  const handleRemoveLine = (id: string) => {
    if (lines.length === 1) return; // Maintain at least one line
    setLines(lines.filter(l => l.id !== id));
  };

  const handleLineChange = (id: string, field: 'itemId' | 'qty', value: string | number) => {
    setLines(lines.map(l => {
      if (l.id === id) {
        return { ...l, [field]: value };
      }
      return l;
    }));
  };

  const handleCreatePODraft = (e: React.FormEvent) => {
    e.preventDefault();

    const currentSupplierObj = suppliers.find(s => s.id === selectedSupplierId);
    if (!currentSupplierObj) return;

    // Build the sub-items representing the items listed
    const matchedItemsList = lines.map(line => {
      const dbItem = items.find(i => i.id === line.itemId);
      return {
        sku: dbItem?.sku || 'UNKNOWN-SKU',
        itemName: dbItem?.name || 'Raw Component Item',
        qty: line.qty,
        cost: dbItem?.cost || 10.00
      };
    });

    const calculatedTotalSum = matchedItemsList.reduce((acc, curr) => acc + (curr.qty * curr.cost), 0);
    
    // Dates math
    const ordDate = new Date().toISOString().split('T')[0];
    const expDateObj = new Date();
    expDateObj.setDate(expDateObj.getDate() + expectedDaysLag);
    const expDate = expDateObj.toISOString().split('T')[0];

    const finalizedPO: PurchaseOrder = {
      id: `PO-2026-${Math.floor(Math.random() * 900 + 100)}`,
      supplierId: selectedSupplierId,
      supplierName: currentSupplierObj.name,
      orderDate: ordDate,
      expectedDate: expDate,
      status: 'Sent',  // Sent represents outgoing immediately
      items: matchedItemsList,
      total: calculatedTotalSum,
      billingTerms: billingTerms,
      approvedBy: 'Sarah Jenkins'
    };

    setPurchaseOrders(prev => [finalizedPO, ...prev]);
    setActiveScreen('Purchase Orders');
  };

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-right-8 duration-500 fade-in">
      {/* Screen Header */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/60 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all duration-300 hover:-translate-x-1 border border-slate-200/50"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <span className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest flex items-center gap-1.5 mb-0.5">
            <FilePlus2 size={12} /> SUPPLY CHAIN REQUISITIONS
          </span>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Draft Purchase Order</h2>
        </div>
      </div>

      <form onSubmit={handleCreatePODraft} className="max-w-4xl space-y-6 text-sm text-slate-700">
        {/* Step 1: Supplier & terms */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-cyan-100 text-cyan-600 rounded-lg">
              <Building2 size={16} />
            </div>
            Supplier Profile & Terms
          </h3>
          
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Destination Vendor <span className="text-rose-500">*</span></label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none font-bold text-slate-800 transition-all cursor-pointer"
            >
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name} ({sup.contactPerson})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block flex items-center gap-1.5"><CreditCard size={14} className="text-slate-400" /> Billing Terms</label>
              <select
                value={billingTerms}
                onChange={(e) => setBillingTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all cursor-pointer font-medium"
              >
                <option value="Net 30">Net 30 terms</option>
                <option value="Net 60">Net 60 terms</option>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="COD (Cash on Lead)">Cash on Delivery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block flex items-center gap-1.5"><Truck size={14} className="text-slate-400" /> Guaranteed Lead-time</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1" 
                  value={expectedDaysLag}
                  onChange={(e) => setExpectedDaysLag(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 py-3 pl-3 pr-16 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all font-bold"
                />
                <span className="absolute right-4 top-3.5 text-[10px] uppercase font-bold text-slate-400">Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Line items list builder */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-cyan-100 text-cyan-600 rounded-lg">
                <Box size={16} />
              </div>
              Requisition Item Lines
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="text-xs text-white bg-slate-800 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-900 shadow-md shadow-slate-800/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus size={14} /> Add material line
            </button>
          </div>

          <div className="space-y-4">
            {lines.map((line, idx) => {
              const matchedItem = items.find(i => i.id === line.itemId);
              const costEst = matchedItem?.cost || 0;
              const subtotalEst = line.qty * costEst;

              return (
                <div key={line.id} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/60 space-y-4 transition-all hover:shadow-md hover:border-cyan-200 group">
                  <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase font-mono text-slate-400">
                    <span className="bg-slate-200/50 px-2 py-1 rounded text-slate-500">LINE ITEM {idx + 1}</span>
                    {lines.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveLine(line.id)}
                        className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Remove block
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Inventory Item SKU</label>
                      <select
                        value={line.itemId}
                        onChange={(e) => handleLineChange(line.id, 'itemId', e.target.value)}
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-800 font-semibold cursor-pointer shadow-sm transition-all"
                      >
                        {items.map(item => (
                          <option key={item.id} value={item.id}>{item.sku} - {item.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Order Qty</label>
                      <input 
                        type="number" 
                        min="1"
                        value={line.qty}
                        onChange={(e) => handleLineChange(line.id, 'qty', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-bold text-center shadow-sm transition-all text-cyan-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-3 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Est. Cost per SKU: <span className="font-bold text-slate-700">${costEst.toFixed(2)}</span></span>
                    <span className="text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">Line Total: <span className="font-extrabold text-cyan-700 text-sm">${subtotalEst.toFixed(2)}</span></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sum math rendering */}
          {(() => {
            const sum = lines.reduce((acc, line) => {
              const matchedItem = items.find(i => i.id === line.itemId);
              const cost = matchedItem?.cost || 0;
              return acc + (line.qty * cost);
            }, 0);
            return (
              <div className="bg-gradient-to-r from-slate-900 to-cyan-950 text-white p-5 rounded-2xl flex justify-between items-center mt-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform -translate-y-4 translate-x-4">
                  <DollarSign size={100} />
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">
                    <Settings size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">Aggregated Cost Valuation</span>
                    <span className="text-xs text-slate-400">Pre-tax estimate</span>
                  </div>
                </div>
                <div className="relative z-10 text-right">
                  <span className="text-2xl font-extrabold text-white tracking-tight">${sum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            );
          })()}
        </div>

        <button 
          type="submit" 
          id="btn-submit-new-po"
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 text-base flex items-center justify-center gap-2"
        >
          <FilePlus2 size={20} /> Issue & Authorize Requisition
        </button>
      </form>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}} />
    </div>
  );
}
