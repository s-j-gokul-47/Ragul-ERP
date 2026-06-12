import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Calendar, 
  User, 
  Tag, 
  AlertTriangle, 
  CornerDownRight, 
  Boxes,
  X,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { StockAdjustment, InventoryItem, AdjustmentType } from '../../types';

interface StockAdjustmentsProps {
  adjustments: StockAdjustment[];
  setAdjustments: React.Dispatch<React.SetStateAction<StockAdjustment[]>>;
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

export default function StockAdjustments({
  adjustments,
  setAdjustments,
  items,
  setItems,
}: StockAdjustmentsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form fields state
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [adjType, setAdjType] = useState<AdjustmentType>('Wastage');
  const [qtyDelta, setQtyDelta] = useState(-1);
  const [reasonCode, setReasonCode] = useState('');
  const [managerSign, setManagerSign] = useState('Sarah Jenkins');

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !reasonCode || qtyDelta === 0) return;

    const itemObj = items.find(i => i.id === selectedItemId);
    if (!itemObj) return;

    const newAdjustment: StockAdjustment = {
      id: `ADJ-${Date.now().toString().slice(-3)}`,
      itemId: selectedItemId,
      itemName: itemObj.name,
      date: new Date().toISOString().split('T')[0],
      qtyAdjusted: qtyDelta,
      type: adjType,
      reason: reasonCode,
      doneBy: managerSign,
      fromLocation: `${itemObj.zone} - ${itemObj.shelf}`
    };

    // Update historical logs
    setAdjustments(prev => [newAdjustment, ...prev]);

    // Live update items quantity in inventory
    setItems(currentItems => currentItems.map(item => {
      if (item.id === selectedItemId) {
        return { ...item, qty: Math.max(0, item.qty + qtyDelta) };
      }
      return item;
    }));

    // Cleanup and exit
    setReasonCode('');
    setQtyDelta(-1);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">WAREHOUSE AUDITING</span>
          <h2 className="text-sm font-bold text-slate-800">Stock Adjustments</h2>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> New Adjust
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="text-indigo-600" size={16} /> Log Manual Discrepancy
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAdjustment} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-semibold block">Select Target SKU *</label>
                <select 
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                >
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} (Current: {item.qty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Adjustment Category</label>
                  <select 
                    value={adjType}
                    onChange={(e) => setAdjType(e.target.value as AdjustmentType)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none"
                  >
                    <option value="Wastage">Wastage / Scrap</option>
                    <option value="Audit">Audit Discrepancy</option>
                    <option value="Damage">Damaged Goods</option>
                    <option value="Re-count">Recount Addition</option>
                    <option value="Location Move">Location Relocation</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="font-semibold block">Quantity Delta *</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="e.g. -5 or +15"
                      value={qtyDelta}
                      onChange={(e) => setQtyDelta(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none font-bold"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-slate-400">
                      {qtyDelta < 0 ? 'Deduction' : 'Addition'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Authorized Staff Signature</label>
                <input 
                  type="text" 
                  value={managerSign}
                  onChange={(e) => setManagerSign(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Notes & Discrepancy Proof *</label>
                <textarea 
                  rows={3}
                  placeholder="Reason for adjustment, photo ID batch, cargo notes..."
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none"
                />
              </div>

              {/* Warnings code */}
              {qtyDelta < 0 && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-1.5 text-amber-850">
                  <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Deducting inventory counts will reflect immediately across all connected ERP dispatch nodes.</span>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="submit-stock-adjust"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-sm text-center"
                >
                  Commit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjustments timeline log */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest pl-1">Historical Audit Timeline</h3>
        
        <div className="relative border-l border-slate-200 pl-3.5 ml-2 space-y-4">
          {adjustments.map((adj) => {
            const isAdd = adj.qtyAdjusted > 0;
            return (
              <div key={adj.id} className="relative text-xs">
                {/* Timeline node */}
                <div className={`absolute -left-[20px] top-1 rounded-full p-0.5 border-2 ${
                  isAdd ? 'bg-emerald-500 border-white text-white' : 'bg-rose-500 border-white text-white'
                }`}>
                  <Sliders size={8} />
                </div>

                <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] bg-slate-100 border text-slate-600 px-1 py-0.2 rounded font-bold">
                      {adj.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{adj.date}</span>
                  </div>
                  
                  <h4 className="font-semibold text-slate-800 mt-1 lines-clamp-1">{adj.itemName}</h4>
                  
                  <div className="flex items-center gap-2 py-0.5">
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isAdd ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}>
                      {isAdd ? <PlusCircle size={9} /> : <MinusCircle size={9} />}
                      {isAdd ? '+' : ''}{adj.qtyAdjusted} items ({adj.type})
                    </span>
                    <span className="text-[10px] text-slate-450 truncate font-medium">Logged by {adj.doneBy}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal bg-slate-50 p-1.5 rounded font-mono italic">
                    {adj.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
