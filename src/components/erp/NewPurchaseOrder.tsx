import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  FilePlus2, 
  Calendar, 
  Truck, 
  Settings,
  X
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
    alert(`Successfully generated purchase order request ${finalizedPO.id} to supplier ${finalizedPO.supplierName}.`);
    setActiveScreen('Purchase Orders');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Detail header */}
      <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-lg -mx-4 -mt-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">SUPPLY CHAIN REQUISITIONS</span>
          <h2 className="text-sm font-bold text-slate-800">Draft Purchase Order</h2>
        </div>
      </div>

      <form onSubmit={handleCreatePODraft} className="space-y-4 text-xs text-slate-700">
        {/* Step 1: Supplier & terms */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest border-b border-slate-5s pb-1">Supplier Profile & Terms</h3>
          
          <div className="space-y-1">
            <label className="font-semibold block">Destination Vendor *</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none font-semibold text-slate-800"
            >
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name} ({sup.contactPerson})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold block">Billing terms</label>
              <select
                value={billingTerms}
                onChange={(e) => setBillingTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none"
              >
                <option value="Net 30">Net 30 terms</option>
                <option value="Net 60">Net 60 terms</option>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="COD (Cash on Lead)">Cash on Delivery</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold block">Guaranteed Lead-time (Days)</label>
              <input 
                type="number" 
                min="1" 
                value={expectedDaysLag}
                onChange={(e) => setExpectedDaysLag(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Line items list builder */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Requisition Item Lines</h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="text-[10px] text-sky-600 bg-sky-50 px-2 py-1 rounded font-bold hover:bg-sky-100 transition flex items-center gap-0.5"
            >
              <Plus size={10} /> Add material line
            </button>
          </div>

          <div className="space-y-2.5">
            {lines.map((line, idx) => {
              const matchedItem = items.find(i => i.id === line.itemId);
              const costEst = matchedItem?.cost || 0;
              const subtotalEst = line.qty * costEst;

              return (
                <div key={line.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>LINE ITEM {idx + 1}</span>
                    {lines.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveLine(line.id)}
                        className="text-rose-500 hover:text-rose-700 transition"
                      >
                        Remove block
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] text-slate-450 block font-semibold">Inventory Item SKU</label>
                      <select
                        value={line.itemId}
                        onChange={(e) => handleLineChange(line.id, 'itemId', e.target.value)}
                        className="w-full bg-white border border-slate-200 p-1.5 rounded outline-none text-slate-800"
                      >
                        {items.map(item => (
                          <option key={item.id} value={item.id}>{item.sku} - {item.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 block font-semibold">Order Qty</label>
                      <input 
                        type="number" 
                        min="1"
                        value={line.qty}
                        onChange={(e) => handleLineChange(line.id, 'qty', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 p-1.5 rounded outline-none font-bold text-center"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span>Cost per SKU: <span className="font-semibold text-slate-700">${costEst.toFixed(2)}</span></span>
                    <span>Line Total: <span className="font-extrabold text-slate-800">${subtotalEst.toFixed(2)}</span></span>
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
              <div className="bg-slate-900 text-white p-3.5 rounded-lg flex justify-between items-center mt-3 shadow-inner">
                <span className="text-xs font-semibold text-sky-400">Aggregated Cost Valuation</span>
                <span className="text-base font-extrabold text-slate-100">${sum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            );
          })()}
        </div>

        <button 
          type="submit" 
          id="btn-submit-new-po"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-lg py-2 shadow-sm transition"
        >
          Issue & Authorize Requisition
        </button>
      </form>
    </div>
  );
}
