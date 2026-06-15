import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  User, 
  Layers, 
  AlertTriangle, 
  ClipboardCheck,
  X
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
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">GEOGRAPHIC ASSETS</span>
          <h2 className="text-sm font-bold text-slate-800">Warehouse Nodes ({warehouses.length})</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> New Warehouse
        </button>
      </div>

      {/* Warehouse items list mapping */}
      <div className="space-y-3">
        {warehouses.map((wh) => {
          // Calculate items stored here
          const localItemCount = items.filter(i => i.warehouseId === wh.id).length;
          const capacityColor = wh.capacityPercent > 90 ? 'bg-rose-500' : 
                                wh.capacityPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500';
          const capacityBg = wh.capacityPercent > 90 ? 'text-rose-600 bg-rose-50' : 
                             wh.capacityPercent > 70 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50';

          return (
            <div 
              key={wh.id}
              id={`warehouse-node-${wh.id}`}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3.5"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700 border border-slate-200">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{wh.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{wh.code}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${capacityBg}`}>
                  {wh.capacityPercent}% FILLED
                </span>
              </div>

              {/* Progress storage capacity bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${capacityColor}`} style={{ width: `${wh.capacityPercent}%` }}></div>
                </div>
              </div>

              {/* Warehouse physical specifications */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-50 pt-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-mono block">ZONE TOPOLOGY</span>
                  <p className="font-semibold text-slate-700 flex items-center gap-1"><Layers size={10} className="text-sky-500" /> {wh.zoneLayout}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-mono block">FACILITY MANAGER</span>
                  <p className="font-semibold text-slate-700 flex items-center gap-1"><User size={10} className="text-sky-500" /> {wh.manager}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-550 bg-slate-50 -mx-4 -mb-4 p-2.5 rounded-b-xl border-t border-slate-50">
                <span>Core items SKU classes: <span className="font-bold text-slate-700">{localItemCount}</span></span>
                {wh.capacityPercent > 90 && (
                  <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                    <AlertTriangle size={11} /> Overflow Critical Risk
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to register another warehouse */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="text-sky-600" size={16} /> Register New Logistics Facility
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateWarehouse} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-semibold block">Facility Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Phoenix Supply Port" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Unique Warehouse Code *</label>
                <input 
                  type="text" 
                  placeholder="e.g. WH-PHX-05" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Aisle/Mesa Zones Topology Layout description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aisles K1-M15, Cold Zone C3" 
                  value={newZones}
                  onChange={(e) => setNewZones(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Senior Site Manager</label>
                <input 
                  type="text" 
                  placeholder="Official caretaker name" 
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="submit-register-warehouse"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-sm text-center"
                >
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
