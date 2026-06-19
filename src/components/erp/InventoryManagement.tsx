import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Package,
  AlertCircle,
  X,
  ChevronRight,
  TrendingUp,
  Box,
  Cpu,
  Monitor,
  Database,
  Layers
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

  // Extract unique categories
  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(item => item.category)))], [items]);

  // Filtering logic
  const filteredItems = useMemo(() => items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesWarehouse = selectedWarehouse === 'All' || item.warehouseId === selectedWarehouse;
    return matchesSearch && matchesCategory && matchesWarehouse;
  }), [items, search, selectedCategory, selectedWarehouse]);

  // KPIs
  const totalValue = items.reduce((acc, item) => acc + (item.qty * item.cost), 0);
  const lowStockCount = items.filter(item => item.qty <= item.minQty).length;

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
      serialTracked: false,
      zone: 'Zone A',
      shelf: 'Ais-1 / Row-A',
      description: 'Newly added SKU.',
      tags: ['Manual Add']
    };

    setItems(prev => [newItem, ...prev]);

    // Reset state & close
    setNewSKU('');
    setNewName('');
    setNewQty(10);
    setShowAddModal(false);
  };

  // Helper for Category Icons
  const getCategoryIcon = (category: string) => {
    if (category.includes('Processor') || category.includes('CPU')) return <Cpu size={18} />;
    if (category.includes('Graphic') || category.includes('GPU')) return <Monitor size={18} />;
    if (category.includes('Memory') || category.includes('Storage')) return <Database size={18} />;
    return <Layers size={18} />;
  };

  return (
    <div className="relative min-h-full pb-20 bg-slate-950 font-sans text-slate-200">

      {/* Sticky Header & KPIs */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl pt-5 pb-4 px-5 border-b border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Box size={22} className="text-sky-400" /> Inventory
            </h1>
            <center><p className="text-xs text-slate-400 font-medium mt-1">Global Stock Registry</p></center>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Total Value</p>
            <p className="text-xl font-black text-emerald-400">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* KPI row */}
        <div className="flex gap-4 mb-10">
          {/* Total SKUs Card */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-lg shadow-black/20 flex items-center justify-center">
            <div className="absolute -top-2 -right-2 p-4 opacity-[0.03]">
              <Package size={56} />
            </div>
            <div className="absolute left-0 top-3.5 -translate-y-1/2 w-12 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/1 shrink-0">
              <Box size={20} className="text-sky-400" />
            </div>
            <div className="flex items-center gap-5 relative z-10 pl-6">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Total SKUs</span>
              <span className="text-xl font-black text-slate-100 tracking-tight ml-0.5">{items.length}</span>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-rose-950/40 to-slate-950 border border-rose-900/40 rounded-2xl p-4 shadow-lg shadow-rose-900/10 flex items-center justify-center">
            <div className="absolute -top-2 -right-2 p-4 opacity-[0.03]">
              <AlertCircle size={56} />
            </div>
            <div className="absolute left-0 top-3.5 -translate-y-1/2 w-12 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/1 shrink-0">
              <AlertCircle size={20} className="text-rose-400" />
            </div>
            <div className="flex items-center gap-5 relative z-10 pl-6">
              <span className="text-[11px] text-rose-400/90 font-bold uppercase tracking-wider whitespace-nowrap">Low Stock</span>
              <span className="text-xl font-black text-rose-400 tracking-tight ml-0.5">{lowStockCount}</span>
            </div>
          </div>
        </div>

        {/* Integrated Search Bar */}
        <div className="relative mb-2">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="         Search items by SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-800 transition-all outline-none shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none items-center -mx-5 px-5 mt-8 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[12px] font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors shadow-sm ${selectedCategory === cat
                ? 'bg-sky-500 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modern List View */}
      <div className="px-4 pt-8 pb-6 flex flex-col gap-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isLowStock = item.qty <= item.minQty;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItemId(item.id);
                  setActiveScreen('Item Details');
                }}
                className={`group flex items-center p-4 rounded-2xl border transition-colors cursor-pointer shadow-sm ${isLowStock
                  ? 'bg-rose-950/10 border-rose-900/30 hover:bg-rose-950/20'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                  }`}
              >
                {/* Left: Avatar/Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 shadow-inner ${isLowStock ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-sky-400'
                  }`}>
                  {getCategoryIcon(item.category)}
                </div>

                {/* Center: Details */}
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-[15px] font-bold text-slate-200 truncate group-hover:text-sky-400 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-slate-500">{item.sku}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-[11px] text-slate-500 truncate">{item.category}</span>
                  </div>
                </div>

                {/* Right: Numbers */}
                <div className="text-right shrink-0 flex flex-col items-end">
                  <div className={`text-[15px] font-black flex items-center gap-1.5 ${isLowStock ? 'text-rose-400' : 'text-slate-200'
                    }`}>
                    {isLowStock && <AlertCircle size={12} className="animate-pulse" />}
                    {item.qty}
                    <span className="text-[10px] font-normal opacity-60 ml-0.5 uppercase tracking-wider">{item.unit}</span>
                  </div>
                  <span className="text-[11px] text-emerald-500/80 font-medium mt-1">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 text-slate-600">
              <Package size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Inventory Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Adjust your filters or search terms to find items.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-lg shadow-sky-500/30 flex items-center justify-center z-30 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Slide-Up Add SKU Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>

          <div className="relative w-full max-w-md mx-auto bg-slate-950 h-[85vh] rounded-t-3xl shadow-2xl flex flex-col border border-slate-800 animate-in slide-in-from-bottom duration-300">
            {/* Form Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Add New SKU</h3>
                  <p className="text-[10px] text-slate-500">Global Registry</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
              <form id="mobile-add-sku" onSubmit={handleAddItem} className="space-y-5 text-sm">

                {/* Identity */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest pl-1">1. Product Identity</h4>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 ml-1">Item Title</label>
                      <input
                        type="text"
                        value={newName} onChange={(e) => setNewName(e.target.value)} required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-sm text-slate-100 focus:border-sky-500 outline-none transition-colors"
                        placeholder="e.g. Server Rack Mount"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">SKU</label>
                        <input
                          type="text"
                          value={newSKU} onChange={(e) => setNewSKU(e.target.value)} required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-xs font-mono uppercase text-slate-100 focus:border-sky-500 outline-none transition-colors"
                          placeholder="RCK-MNT-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">Category</label>
                        <select
                          value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-xs text-slate-100 focus:border-sky-500 outline-none transition-colors"
                        >
                          <option>Processors</option>
                          <option>Graphics Cards</option>
                          <option>Memory</option>
                          <option>Storage</option>
                          <option>Metal Works</option>
                          <option>Cabling</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest pl-1">2. Stock & Pricing</h4>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">Cost ($)</label>
                        <input
                          type="number" step="0.01" value={newCost} onChange={(e) => setNewCost(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-sm text-slate-100 outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">Price ($)</label>
                        <input
                          type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-sm text-emerald-400 font-bold outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/3">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">Stock</label>
                        <input
                          type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-sm text-center text-slate-100 outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">Min Safety</label>
                        <input
                          type="number" value={newMinQty} onChange={(e) => setNewMinQty(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-sm text-center text-rose-400 outline-none focus:border-rose-500"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="text-[11px] font-medium text-slate-400 ml-1">Unit</label>
                        <input
                          type="text" value={newUnit} onChange={(e) => setNewUnit(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl mt-1 p-2.5 text-xs text-center text-slate-100 outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Bottom Sticky Button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <button
                type="submit"
                form="mobile-add-sku"
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-colors"
              >
                Save New SKU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
