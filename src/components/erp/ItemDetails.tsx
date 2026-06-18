import React from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Truck, 
  Coins, 
  Tag, 
  FileText, 
  TrendingUp, 
  Barcode, 
  AlertTriangle,
  Info,
  Box,
  Layers,
  Activity
} from 'lucide-react';
import { InventoryItem, Warehouse, Supplier } from '../../types';

interface ItemDetailsProps {
  selectedItemId: string | null;
  items: InventoryItem[];
  warehouses: Warehouse[];
  suppliers: Supplier[];
  setActiveScreen: (screen: string) => void;
}

export default function ItemDetails({
  selectedItemId,
  items,
  warehouses,
  suppliers,
  setActiveScreen,
}: ItemDetailsProps) {
  const item = items.find(i => i.id === selectedItemId) || items[0];

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 min-h-[400px]">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <Info size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-700">No SKU Selected</h3>
          <p className="text-sm font-medium text-slate-500">Please select an item from the stock catalog to view details.</p>
        </div>
        <button 
          onClick={() => setActiveScreen('Inventory Management')}
          className="mt-4 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 hover:shadow-md transition-all duration-300"
        >
          Return to Stock Catalog
        </button>
      </div>
    );
  }

  // Lookups
  const wh = warehouses.find(w => w.id === item.warehouseId);
  const sup = suppliers.find(s => s.id === item.supplierId);

  // Financial calculations
  const grossProfitMargin = item.price - item.cost;
  const marginPercent = ((grossProfitMargin / item.price) * 100).toFixed(1);
  const totalSkuValuation = item.qty * item.cost;
  const isLowStock = item.qty <= item.minQty;

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-right-8 duration-500 fade-in">
      {/* Screen Header */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/60 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => setActiveScreen('Inventory Management')}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all duration-300 hover:-translate-x-1 border border-slate-200/50"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <span className="text-[10px] text-sky-500 uppercase font-bold tracking-widest flex items-center gap-1.5 mb-0.5">
            <Activity size={12} /> SKU METE-GUIDE
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{item.sku}</h2>
            {isLowStock && (
              <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-200 animate-pulse">
                CRITICAL STOCK
              </span>
            )}
          </div>
        </div>
        <button className="hidden sm:flex bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-2 px-5 rounded-xl shadow-md shadow-sky-500/20 transition-all text-sm gap-2 items-center">
           Edit Asset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Info & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main product overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative z-10 space-y-4">
              <span className="inline-block text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-slate-200/80">
                {item.category}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">{item.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{item.description}</p>
              
              {/* Dynamic Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[11px] bg-sky-50 text-sky-700 px-3 py-1 rounded-lg font-bold border border-sky-100/50 transition-colors hover:bg-sky-100">
                    <Tag size={10} /> {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Matrix */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <span className="text-[10px] text-slate-400 font-bold tracking-widest block mb-2 uppercase">Unit Cost</span>
              <p className="text-xl font-extrabold text-slate-800">${item.cost.toFixed(2)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <span className="text-[10px] text-slate-400 font-bold tracking-widest block mb-2 uppercase">Selling Price</span>
              <p className="text-xl font-extrabold text-slate-800">${item.price.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5 rounded-2xl text-emerald-900 shadow-sm transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-emerald-200/40 transform translate-x-4 translate-y-4">
                <TrendingUp size={60} />
              </div>
              <span className="relative z-10 text-[10px] text-emerald-600/80 font-bold tracking-widest block mb-2 uppercase">Gross Margin</span>
              <p className="relative z-10 text-xl font-extrabold text-emerald-700">+{marginPercent}%</p>
            </div>
          </div>

          {/* Beautiful stock trend graph SVG mock */}
          <div className="bg-[#0B1120] text-white p-6 rounded-3xl border border-sky-900/50 shadow-2xl relative overflow-hidden group">
            {/* Grid background effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-sky-400 font-bold tracking-widest block uppercase mb-1 flex items-center gap-2">
                    <Activity size={12} /> LEAN LOGISTICS ANALYTICS
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">Cyclic Stock Drainage Curve</h4>
                </div>
                <div className="text-right bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Total Valuation</p>
                  <p className="font-extrabold text-emerald-400 text-lg leading-none">${totalSkuValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

              {/* SVG Drawing curve line represent stock */}
              <div className="pt-4 h-32 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Area path */}
                  <path 
                    d="M 0 35 Q 20 10 40 25 T 80 5 T 100 30 L 100 40 L 0 40 Z" 
                    fill="url(#chartGrad)" 
                    className="animate-in fade-in duration-1000"
                  />
                  {/* Outline curve path */}
                  <path 
                    d="M 0 35 Q 20 10 40 25 T 80 5 T 100 30" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="1.5"
                    strokeLinecap="round" 
                    filter="url(#glow)"
                    className="path-draw"
                  />
                  {/* Interactive points mock */}
                  <circle cx="0" cy="35" r="1.5" fill="#fff" stroke="#38bdf8" strokeWidth="0.5" />
                  <circle cx="40" cy="25" r="1.5" fill="#fff" stroke="#38bdf8" strokeWidth="0.5" />
                  <circle cx="80" cy="5" r="1.5" fill="#fff" stroke="#38bdf8" strokeWidth="0.5" />
                  <circle cx="100" cy="30" r="1.5" fill="#fff" stroke="#38bdf8" strokeWidth="0.5" />
                  
                  {/* Grid base line */}
                  <line x1="0" y1="38" x2="100" y2="38" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,2" />
                </svg>
              </div>

              <div className="flex justify-between font-mono text-[9px] text-slate-400 pt-2 border-t border-slate-800 uppercase tracking-widest">
                <span>Wk 1 (Received)</span>
                <span>Wk 2 (Fulfillment)</span>
                <span className="text-sky-400 font-bold">Today (Buffer Qty: {item.qty})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Topology & Settings */}
        <div className="space-y-4">
          
          {/* Tracking and serial config widgets */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
              <Barcode size={100} />
            </div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Barcode size={16} className="text-indigo-200" />
                  <span className="font-bold text-sm">Serial Tracking</span>
                </div>
                <p className="text-[11px] text-indigo-200 leading-tight">Individual barcode logging required?</p>
              </div>
              <span className={`inline-block font-bold text-[10px] px-2.5 py-1 rounded-lg border backdrop-blur-md ${
                item.serialTracked ? 'bg-white/20 border-white/30 text-white' : 'bg-black/20 border-black/30 text-indigo-100'
              }`}>
                {item.serialTracked ? 'SERIALIZED ON' : 'BATCH ONLY'}
              </span>
            </div>
          </div>

          {/* Warehouse and supplier linked cards */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers size={12} /> Topology & Supply Channels
            </h4>

            <div className="space-y-4">
              <div className="group flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{wh?.name || 'Grand Central Depot'}</p>
                  <div className="text-xs text-slate-500 mt-1 flex flex-col gap-0.5">
                    <span className="font-medium text-slate-600">Shelving Location:</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] inline-block w-fit text-slate-600 border border-slate-200">
                      {item.zone} &middot; {item.shelf}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 mx-2"></div>

              <div className="group flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{sup?.name || 'Primary Solder Vendor'}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Contract Lead Time: <span className="font-bold text-slate-700">{sup?.deliveryDays || 14} Days</span>
                  </p>
                </div>
              </div>
            </div>
            
            <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors border border-slate-200">
              View Full Logistics Trace
            </button>
          </div>
          
        </div>
      </div>
      
      {/* CSS needed for specific animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .path-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}} />
    </div>
  );
}
