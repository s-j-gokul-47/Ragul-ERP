import React, { useState } from 'react';
import { 
  FileBox, 
  Search, 
  Plus, 
  ChevronRight,
  Settings,
  Layers,
  Clock,
  X
} from 'lucide-react';
import { BillOfMaterial, InventoryItem } from '../../types';

interface BillOfMaterialsProps {
  boms: BillOfMaterial[];
  items: InventoryItem[];
  setActiveScreen: (screen: string) => void;
}

export default function BillOfMaterials({
  boms,
  items,
  setActiveScreen
}: BillOfMaterialsProps) {
  const [search, setSearch] = useState('');
  
  const filteredBoms = boms.filter(bom => {
    const product = items.find(i => i.id === bom.productId);
    return bom.id.toLowerCase().includes(search.toLowerCase()) || 
           (product?.name.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="relative min-h-full pb-20 bg-slate-950 font-sans text-slate-200">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl pt-5 pb-4 px-5 border-b border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <FileBox size={22} className="text-emerald-500" /> BoM
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Bill of Materials</p>
          </div>
          <button 
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl shadow-lg transition flex items-center gap-1.5 font-bold text-xs px-3 opacity-50 cursor-not-allowed"
          >
            <Plus size={16} /> New BoM
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search BoMs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-800 transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-6 flex flex-col gap-4">
        {filteredBoms.length > 0 ? (
          filteredBoms.map(bom => {
            const product = items.find(i => i.id === bom.productId);
            
            return (
              <div 
                key={bom.id}
                className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl hover:bg-slate-900/80 transition"
              >
                <div className="flex justify-between items-start mb-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">
                      {product?.name || 'Unknown Product'}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">{bom.id}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                      <Layers size={12} /> Components
                    </h4>
                    <div className="space-y-1.5">
                      {bom.components.map((comp, idx) => {
                        const compItem = items.find(i => i.id === comp.itemId);
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs bg-slate-950 p-2 rounded-lg border border-slate-800/50">
                            <span className="text-slate-300 truncate pr-2">{compItem?.name || comp.itemId}</span>
                            <span className="font-mono text-slate-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">
                              {comp.qty}x
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                      <Settings size={12} /> Operations
                    </h4>
                    <div className="space-y-1.5">
                      {bom.operations.map((op, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-slate-950 p-2 rounded-lg border border-slate-800/50">
                          <span className="text-slate-300 truncate pr-2">{op.name}</span>
                          <span className="font-mono text-slate-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock size={10} /> {op.duration}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 text-slate-600">
              <FileBox size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No BoMs Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Define a BoM to start manufacturing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
