import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  User, 
  Layers, 
  AlertTriangle, 
  ClipboardCheck,
  X,
  Globe,
  Gauge
} from 'lucide-react';
import { Warehouse, InventoryItem } from '../../types';

interface WarehouseLocationsProps {
  warehouses: Warehouse[];
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
  items: InventoryItem[];
}

export default function WarehouseLocations({
  warehouses,
  setWarehouses,
  items,
}: WarehouseLocationsProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newZones, setNewZones] = useState('Aisles A1-C10');

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const newWh: Warehouse = {
      id: `wh-${Date.now().toString().slice(-3)}`,
      name: newName,
      code: newCode.toUpperCase(),
      manager: newManager || 'Sarah Jenkins',
      capacityPercent: 12, // New warehouse starts thin
      activeAlerts: 0,
      zoneLayout: newZones
    };

    setWarehouses(prev => [...prev, newWh]);

    // Resets
    setNewName('');
    setNewCode('');
    setNewManager('');
    setNewZones('Aisles A1-C10');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Screen Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 rounded-2xl shadow-lg border border-sky-900/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-sky-400 uppercase font-mono tracking-widest font-bold flex items-center gap-2 mb-1.5">
            <Globe size={12} /> GEOGRAPHIC ASSETS
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Warehouse Nodes
            <span className="bg-sky-500/20 text-sky-200 text-xs py-1 px-3 rounded-full backdrop-blur-md border border-sky-400/30 font-mono">
              {warehouses.length} Facilities
            </span>
          </h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
        >
          <Plus size={16} className="transition-transform group-hover/btn:rotate-90" /> Register Node
        </button>
      </div>

      {/* Warehouse items list mapping */}
      <div className="grid grid-cols-1 gap-6">
        {warehouses.map((wh, idx) => {
          // Calculate items stored here
          const localItemCount = items.filter(i => i.warehouseId === wh.id).length;
          const isCritical = wh.capacityPercent > 90;
          const isWarning = wh.capacityPercent > 70 && !isCritical;
          
          const capacityColor = isCritical ? 'from-rose-500 to-rose-600' : 
                                isWarning ? 'from-amber-400 to-amber-500' : 'from-emerald-400 to-emerald-500';
          const capacityBg = isCritical ? 'text-rose-700 bg-rose-50 border-rose-200' : 
                             isWarning ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
          const glowColor = isCritical ? 'shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 
                            isWarning ? 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'shadow-[0_0_15px_rgba(16,185,129,0.5)]';

          return (
            <div 
              key={wh.id}
              id={`warehouse-node-${wh.id}`}
              className={`bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${isCritical ? 'hover:border-rose-300' : 'hover:border-sky-200'}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative z-10 space-y-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 border border-slate-200/60 shadow-inner">
                      <Building2 size={24} className="group-hover:text-sky-600 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 leading-tight">{wh.name}</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold tracking-widest uppercase">{wh.code}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border font-mono tracking-widest ${capacityBg}`}>
                    {wh.capacityPercent}% FULL
                  </span>
                </div>

                {/* Progress storage capacity bar */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5"><Gauge size={14} /> Storage Capacity</span>
                    <span>{100 - wh.capacityPercent}% Free</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${capacityColor} ${glowColor}`} style={{ width: `${wh.capacityPercent}%` }}></div>
                  </div>
                </div>

                {/* Warehouse physical specifications */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="space-y-1 bg-white border border-slate-100 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Topology Layout</span>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5"><Layers size={14} className="text-sky-500" /> <span className="truncate">{wh.zoneLayout}</span></p>
                  </div>
                  <div className="space-y-1 bg-white border border-slate-100 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Site Manager</span>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5"><User size={14} className="text-sky-500" /> <span className="truncate">{wh.manager}</span></p>
                  </div>
                </div>

                <div className={`flex justify-between items-center text-xs font-medium p-4 rounded-xl border ${isCritical ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                  <span className="flex items-center gap-1.5">
                    <ClipboardCheck size={14} /> Core SKUs: <span className="font-extrabold">{localItemCount}</span>
                  </span>
                  {isCritical && (
                    <span className="text-rose-600 font-bold flex items-center gap-1 animate-pulse text-[10px] uppercase tracking-wider">
                      <AlertTriangle size={14} /> Overflow Risk
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to register another warehouse */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg">
                  <Building2 size={18} />
                </div>
                New Facility Node
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="wh-form" onSubmit={handleCreateWarehouse} className="space-y-5 text-sm text-slate-700">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Facility Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Phoenix Supply Port" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Unique Node Code <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. WH-PHX-05" 
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono text-xs uppercase transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Aisle/Mesa Zones Layout</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aisles K1-M15, Cold Zone C3" 
                    value={newZones}
                    onChange={(e) => setNewZones(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Senior Site Manager</label>
                  <input 
                    type="text" 
                    placeholder="Official caretaker name" 
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="wh-form"
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg transition-all"
                >
                  Register Node
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
