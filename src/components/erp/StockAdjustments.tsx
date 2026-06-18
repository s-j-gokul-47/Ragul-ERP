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
  MinusCircle,
  CheckCircle2,
  FileSignature
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
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Screen Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-5 rounded-2xl shadow-lg border border-indigo-500/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-indigo-400 uppercase font-mono tracking-widest font-bold flex items-center gap-2 mb-1.5">
            <Sliders size={12} /> WAREHOUSE AUDITING
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Stock Adjustments
          </h2>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="relative z-10 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
        >
          <Plus size={16} className="transition-transform group-hover/btn:rotate-90" /> New Log
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddForm(false)}
          ></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FileSignature size={18} />
                </div>
                Log Manual Discrepancy
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="adj-form" onSubmit={handleCreateAdjustment} className="space-y-5 text-sm text-slate-700">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Select Target SKU <span className="text-rose-500">*</span></label>
                  <select 
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-semibold transition-all"
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.sku} - {item.name} (Current: {item.qty} {item.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">Adjustment Category</label>
                    <select 
                      value={adjType}
                      onChange={(e) => setAdjType(e.target.value as AdjustmentType)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="Wastage">Wastage / Scrap</option>
                      <option value="Audit">Audit Discrepancy</option>
                      <option value="Damage">Damaged Goods</option>
                      <option value="Re-count">Recount Addition</option>
                      <option value="Location Move">Location Relocation</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">Quantity Delta <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="e.g. -5 or +15"
                        value={qtyDelta}
                        onChange={(e) => setQtyDelta(Number(e.target.value))}
                        required
                        className={`w-full bg-slate-50 border border-slate-200 py-3 pl-3 pr-20 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-extrabold text-lg transition-all ${qtyDelta < 0 ? 'text-rose-600' : 'text-emerald-600'}`}
                      />
                      <span className={`absolute right-3 top-3.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${qtyDelta < 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {qtyDelta < 0 ? 'Deduction' : 'Addition'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Authorized Staff Signature</label>
                  <input 
                    type="text" 
                    value={managerSign}
                    onChange={(e) => setManagerSign(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Notes & Discrepancy Proof <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows={3}
                    placeholder="Reason for adjustment, photo ID batch, cargo notes..."
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
                  />
                </div>

                {/* Warnings code */}
                <div className={`p-4 rounded-xl flex items-start gap-3 transition-colors ${qtyDelta < 0 ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                  {qtyDelta < 0 ? (
                    <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className={`font-bold ${qtyDelta < 0 ? 'text-rose-900' : 'text-emerald-900'}`}>
                      {qtyDelta < 0 ? 'Inventory Deduction Notice' : 'Inventory Addition Notice'}
                    </p>
                    <p className={`text-xs ${qtyDelta < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      This action will immediately reflect across all connected ERP dispatch nodes. Please ensure physical verification has been conducted.
                    </p>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="adj-form"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all"
                >
                  Commit Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjustments timeline log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-800">Historical Audit Timeline</h3>
            <p className="text-xs text-slate-500 font-medium">Record of all manual stock interventions</p>
          </div>
        </div>
        
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
          {adjustments.map((adj, idx) => {
            const isAdd = adj.qtyAdjusted > 0;
            return (
              <div key={adj.id} className="relative pl-8 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Timeline node */}
                <div className={`absolute -left-[13px] top-1 rounded-full p-1.5 border-[3px] border-white shadow-sm ${
                  isAdd ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {isAdd ? <PlusCircle size={12} /> : <MinusCircle size={12} />}
                </div>

                <div className="bg-white p-5 border border-slate-200/60 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {adj.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded">{adj.date}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-slate-800 text-base">{adj.itemName}</h4>
                  
                  <div className="flex items-center gap-3 my-3">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isAdd ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'bg-rose-50 text-rose-700 border border-rose-100/50'
                    }`}>
                      {isAdd ? '+' : ''}{adj.qtyAdjusted} items
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      {adj.type}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mt-3">
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{adj.reason}"
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <User size={12} /> Logged by <span className="font-bold text-slate-700">{adj.doneBy}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <CornerDownRight size={12} /> {adj.fromLocation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
