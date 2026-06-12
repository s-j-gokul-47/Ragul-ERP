import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  MapPin, 
  Package, 
  Tag, 
  AlertCircle,
  X
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
    <div className="space-y-4 pb-6">
      {/* Mini Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">STOCK REGISTRY</span>
          <h2 className="text-sm font-bold text-slate-800">Inventory Items ({filteredItems.length})</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> Add SKU
        </button>
      </div>

      {/* Advanced Search & Filtration Controls */}
      <div className="space-y-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by SKU or item name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500 transition outline-none"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </div>
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Carousel by Location & Category */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
          <select 
            value={selectedWarehouse} 
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-600 outline-none flex-shrink-0"
          >
            <option value="All">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <div className="flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border flex-shrink-0 transition ${
                  selectedCategory === cat 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of SKU items */}
      <div className="space-y-2.5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
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
                className={`p-3.5 bg-white border rounded-xl hover:border-slate-300 transition cursor-pointer flex flex-col gap-2 shadow-xs ${
                  isLowStock ? 'ring-1 ring-rose-200 border-rose-200 bg-rose-[1px]' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                      {item.sku}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">Value/Unit</p>
                    <p className="text-xs font-bold text-slate-800">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] border-t border-slate-50 pt-2 text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-sky-500" />
                    <span className="truncate max-w-[120px]">{whName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Package size={10} />
                      <span className={`font-semibold ${isLowStock ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                        {item.qty} {item.unit}
                      </span>
                    </div>
                    {isLowStock && (
                      <span className="flex items-center gap-0.5 text-rose-600 bg-rose-50 px-1 py-0.2 rounded font-semibold font-mono">
                        <AlertCircle size={8} /> LOW
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Package size={30} className="mx-auto text-slate-300" />
            <p className="text-xs font-medium">No SKU records match this query.</p>
            <button 
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedWarehouse('All');
              }}
              className="text-xs text-sky-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Create New SKU Form Modal overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5Packed">
                <Package className="text-sky-600" size={16} /> Direct Core SKU Entry
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">SKU Code *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SSD-NVME-2TB" 
                    value={newSKU}
                    onChange={(e) => setNewSKU(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
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

              <div className="space-y-1">
                <label className="font-semibold block">Item Title *</label>
                <input 
                  type="text" 
                  placeholder="Official component name" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Selling Price ($)</label>
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Acquisition Cost ($)</label>
                  <input 
                    type="number" 
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold block">Quantity</label>
                  <input 
                    type="number" 
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Min safety qty</label>
                  <input 
                    type="number" 
                    value={newMinQty}
                    onChange={(e) => setNewMinQty(Number(e.target.value))}
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Unit type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Units, Pcs" 
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Warehouse Assign</label>
                  <select 
                    value={newWarehouseId}
                    onChange={(e) => setNewWarehouseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Supplier Link</label>
                  <select 
                    value={newSupplierId}
                    onChange={(e) => setNewSupplierId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Zone (e.g., Zone A)</label>
                  <input 
                    type="text" 
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Shelf Shelf (e.g., Row 4)</label>
                  <input 
                    type="text" 
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-0.5">
                <input 
                  type="checkbox" 
                  id="serial_check"
                  checked={newSerial}
                  onChange={(e) => setNewSerial(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <label htmlFor="serial_check" className="font-semibold cursor-pointer">Require individual serial tracking codes?</label>
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">General Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Physical descriptions, handling guides..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="submit-inventory-sku"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-center"
                >
                  Confirm SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
