import React, { useState } from 'react';
import { 
  Factory, 
  Search, 
  Plus, 
  ChevronRight,
  Package,
  CheckCircle,
  PlayCircle,
  Clock,
  X
} from 'lucide-react';
import { ManufacturingOrder, InventoryItem, BillOfMaterial } from '../../types';

interface ManufacturingOrdersProps {
  manufacturingOrders: ManufacturingOrder[];
  setManufacturingOrders: React.Dispatch<React.SetStateAction<ManufacturingOrder[]>>;
  items: InventoryItem[];
  boms: BillOfMaterial[];
  setActiveScreen: (screen: string) => void;
}

export default function ManufacturingOrders({
  manufacturingOrders,
  setManufacturingOrders,
  items,
  boms,
  setActiveScreen
}: ManufacturingOrdersProps) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New MO Form
  const [selectedBomId, setSelectedBomId] = useState('');
  const [newQty, setNewQty] = useState(1);

  const filteredOrders = manufacturingOrders.filter(mo => {
    const product = items.find(i => i.id === mo.finishedProductId);
    return mo.id.toLowerCase().includes(search.toLowerCase()) || 
           (product?.name.toLowerCase().includes(search.toLowerCase()));
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-700';
      case 'Confirmed': return 'bg-sky-100 text-sky-700';
      case 'In Progress': return 'bg-amber-100 text-amber-700';
      case 'Done': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <Clock size={12} />;
      case 'Confirmed': return <CheckCircle size={12} />;
      case 'In Progress': return <PlayCircle size={12} />;
      case 'Done': return <CheckCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const handleCreateMO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBomId) return;

    const bom = boms.find(b => b.id === selectedBomId);
    if (!bom) return;

    const newMo: ManufacturingOrder = {
      id: `MO-${new Date().getFullYear()}-${String(manufacturingOrders.length + 1).padStart(3, '0')}`,
      finishedProductId: bom.productId,
      quantity: newQty,
      status: 'Draft',
      orderDate: new Date().toISOString().split('T')[0],
      assignee: 'Unassigned',
      workCenter: 'Main Assembly'
    };

    setManufacturingOrders(prev => [newMo, ...prev]);
    setShowAddModal(false);
    setNewQty(1);
    setSelectedBomId('');
  };

  return (
    <div className="relative min-h-full pb-20 bg-slate-950 font-sans text-slate-200">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl pt-5 pb-4 px-5 border-b border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Factory size={22} className="text-amber-500" /> Manufacturing
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Order Pipeline</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl shadow-lg transition flex items-center gap-1.5 font-bold text-xs px-3"
          >
            <Plus size={16} /> New MO
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search MOs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-800 transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-6 flex flex-col gap-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(mo => {
            const product = items.find(i => i.id === mo.finishedProductId);
            
            return (
              <div 
                key={mo.id}
                className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl hover:bg-slate-900/80 transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-100">{mo.id}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{mo.orderDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${getStatusColor(mo.status)}`}>
                    {getStatusIcon(mo.status)}
                    {mo.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Package size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-200 truncate">{product?.name || 'Unknown Product'}</p>
                    <p className="text-[10px] text-slate-500">Qty: {mo.quantity} {product?.unit}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-500" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 text-slate-600">
              <Factory size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Create a new MO to get started.</p>
          </div>
        )}
      </div>

      {/* Add MO Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-md mx-auto bg-slate-950 rounded-t-3xl shadow-2xl flex flex-col border border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Factory size={16} className="text-amber-500" /> New Manufacturing Order
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-300 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateMO} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Product (BoM)</label>
                <select 
                  value={selectedBomId} 
                  onChange={(e) => setSelectedBomId(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-amber-500 outline-none"
                  required
                >
                  <option value="">Select a Bill of Material...</option>
                  {boms.map(bom => {
                    const product = items.find(i => i.id === bom.productId);
                    return (
                      <option key={bom.id} value={bom.id}>
                        {product?.name} ({bom.id})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Quantity to Build</label>
                <input 
                  type="number" 
                  min="1"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-amber-500 outline-none"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition mt-4"
              >
                Create MO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
