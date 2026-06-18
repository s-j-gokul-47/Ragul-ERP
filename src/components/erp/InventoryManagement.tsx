import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  MapPin, 
  Package, 
  Tag, 
  AlertCircle,
  X,
  ChevronRight,
  Box
} from 'lucide-react';
import { InventoryItem, Warehouse, Supplier } from '../../types';

interface InventoryManagementProps {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  warehouses: Warehouse[];
  suppliers: Supplier[];
  setActiveScreen: (screen: string) => void;
  setSelectedItemId: (id: string) => void;
}

export default function InventoryManagement({
  items,
  setItems,
  warehouses,
  suppliers,
  setActiveScreen,
  setSelectedItemId,
}: InventoryManagementProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newSKU, setNewSKU] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Processors');
  const [newQty, setNewQty] = useState(10);
  const [newMinQty, setNewMinQty] = useState(20);
  const [newPrice, setNewPrice] = useState(100);
  const [newCost, setNewCost] = useState(70);
  const [newUnit, setNewUnit] = useState('Units');
  const [newWarehouseId, setNewWarehouseId] = useState('wh-1');
  const [newSupplierId, setNewSupplierId] = useState('sup-1');
  const [newSerial, setNewSerial] = useState(false);
  const [newZone, setNewZone] = useState('Zone A');
  const [newShelf, setNewShelf] = useState('Ais-1 / Row-A');
  const [newDesc, setNewDesc] = useState('');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  // Filtering logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesWarehouse = selectedWarehouse === 'All' || item.warehouseId === selectedWarehouse;
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSKU || !newName) return;

    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      sku: newSKU,
      name: newName,
      category: newCategory,
      qty: newQty,
      minQty: newMinQty,
      price: newPrice,
      cost: newCost,
      unit: newUnit,
      warehouseId: newWarehouseId,
      supplierId: newSupplierId,
      serialTracked: newSerial,
      zone: newZone,
      shelf: newShelf,
      description: newDesc || `${newName} enterprise physical asset registered inside ERP database inventory logs.`,
      tags: ['Manual Add']
    };

    setItems(prev => [newItem, ...prev]);
    
    // Reset state & close
    setNewSKU('');
    setNewName('');
    setNewQty(10);
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mini Screen Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl shadow-lg border border-slate-700/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-sky-400 uppercase font-mono tracking-widest font-bold flex items-center gap-2 mb-1.5">
            <Box size={12} /> GLOBAL STOCK REGISTRY
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Inventory Assets 
            <span className="bg-white/10 text-sky-300 text-xs py-1 px-2.5 rounded-full backdrop-blur-md border border-white/10">
              {filteredItems.length} Records
            </span>
          </h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 flex items-center gap-2 bg-white text-slate-900 hover:bg-sky-50 hover:text-sky-700 text-sm font-semibold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
        >
          <Plus size={16} className="transition-transform group-hover/btn:rotate-90" /> Add New SKU
        </button>
      </div>

      {/* Advanced Search & Filtration Controls */}
      <div className="bg-white/60 backdrop-blur-xl p-3 rounded-2xl border border-white/50 shadow-sm space-y-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search catalog by SKU, product name, or attributes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/80 border border-slate-200/60 rounded-xl py-3 pl-11 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-100 transition-all duration-300 outline-none"
          />
          {search && (
            <button 
              onClick={() => setSearch('')} 
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Carousel by Location & Category */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl p-1 shrink-0">
            <SlidersHorizontal size={14} className="text-slate-400 ml-2" />
            <select 
              value={selectedWarehouse} 
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="bg-transparent border-none py-1.5 px-2 text-xs font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
            >
              <option value="All">Global Warehouses</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-slate-200 shrink-0 mx-1"></div>

          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20 translate-y-[-1px]' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of SKU items */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => {
            const isLowStock = item.qty <= item.minQty;
            const whName = warehouses.find(w => w.id === item.warehouseId)?.name || 'Direct Depot';
            return (
              <div 
                key={item.id}
                id={`inv-item-${item.id}`}
                onClick={() => {
                  setSelectedItemId(item.id);
                  setActiveScreen('Item Details');
                }}
                className={`group cursor-pointer bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ${
                  isLowStock ? 'border-rose-200/60 bg-gradient-to-br from-rose-50/30 to-white' : 'border-slate-200/60'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100/80 border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
                          {item.sku}
                        </span>
                        {isLowStock && (
                          <span className="flex items-center gap-1 text-[9px] text-rose-600 bg-rose-100/80 border border-rose-200/50 px-1.5 py-0.5 rounded-md font-bold font-mono animate-pulse">
                            <AlertCircle size={10} /> LOW STOCK
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight pt-1 group-hover:text-sky-700 transition-colors">{item.name}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Value/Unit</p>
                      <p className="text-sm font-extrabold text-slate-800">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Stock Level</p>
                      <p className={`text-sm font-extrabold flex items-center justify-end gap-1 ${isLowStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {item.qty} <span className="text-[10px] text-slate-500 font-normal">{item.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center text-[11px] mt-4 pt-3 border-t border-slate-100 text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-sky-500" />
                    <span className="truncate max-w-[120px]">{whName}</span>
                  </div>
                  <div className="flex items-center text-sky-600 font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Details <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No SKUs Found</h3>
            <p className="text-sm">We couldn't find any items matching your current filters.</p>
            <button 
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedWarehouse('All');
              }}
              className="mt-4 bg-white border border-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Create New SKU Slide-over Panel */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>
          
          {/* Sliding Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out border-l border-white/20">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg">
                    <Package size={18} />
                  </div>
                  Direct Core SKU Entry
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Add a new physical asset to the global registry</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
              <form id="add-sku-form" onSubmit={handleAddItem} className="space-y-6 text-sm text-slate-700">
                
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Identity</h4>
                  
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800 block">Item Title <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Official component name" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block">SKU Code <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. SSD-NVME-2TB" 
                        value={newSKU}
                        onChange={(e) => setNewSKU(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-xs transition-all outline-none uppercase"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block">Category</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none"
                      >
                        <option value="Processors">Processors</option>
                        <option value="Graphics Cards">Graphics Cards</option>
                        <option value="Memory">Memory</option>
                        <option value="Storage">Storage</option>
                        <option value="Metal Works">Metal Works</option>
                        <option value="Cabling">Cabling</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Financials Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">2. Financials & Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="font-semibold text-slate-800 block">Selling Price</label>
                      <span className="absolute left-3 top-[34px] text-slate-400 font-semibold">$</span>
                      <input 
                        type="number" 
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 py-3 pl-7 pr-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="font-semibold text-slate-800 block">Acquisition Cost</label>
                      <span className="absolute left-3 top-[34px] text-slate-400 font-semibold">$</span>
                      <input 
                        type="number" 
                        value={newCost}
                        onChange={(e) => setNewCost(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 py-3 pl-7 pr-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block text-xs">Initial Qty</label>
                      <input 
                        type="number" 
                        value={newQty}
                        onChange={(e) => setNewQty(Number(e.target.value))}
                        min="0"
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center font-bold focus:ring-2 focus:ring-sky-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block text-xs">Min Safety</label>
                      <input 
                        type="number" 
                        value={newMinQty}
                        onChange={(e) => setNewMinQty(Number(e.target.value))}
                        min="0"
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center text-slate-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block text-xs">Unit Type</label>
                      <input 
                        type="text" 
                        placeholder="Units" 
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center focus:ring-2 focus:ring-sky-500/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Topology Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">3. Topology & Tracking</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block">Warehouse Assign</label>
                      <select 
                        value={newWarehouseId}
                        onChange={(e) => setNewWarehouseId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none"
                      >
                        {warehouses.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block">Supplier Link</label>
                      <select 
                        value={newSupplierId}
                        onChange={(e) => setNewSupplierId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none"
                      >
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block">Zone</label>
                      <input 
                        type="text" 
                        value={newZone}
                        onChange={(e) => setNewZone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 block">Shelf</label>
                      <input 
                        type="text" 
                        value={newShelf}
                        onChange={(e) => setNewShelf(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                    <div className="pt-0.5">
                      <input 
                        type="checkbox" 
                        checked={newSerial}
                        onChange={(e) => setNewSerial(e.target.checked)}
                        className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-indigo-900 text-sm">Individual Serial Tracking</p>
                      <p className="text-xs text-indigo-700/70 mt-0.5">Require unique barcodes for every unit of this SKU.</p>
                    </div>
                  </label>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800 block">General Notes</label>
                    <textarea 
                      rows={3}
                      placeholder="Physical descriptions, handling guides..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                    />
                  </div>
                </div>

              </form>
            </div>
            
            {/* Sticky Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
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
                  form="add-sku-form"
                  className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg transition-all"
                >
                  Confirm SKU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
