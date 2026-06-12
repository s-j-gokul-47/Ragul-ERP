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
  Info
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
      <div className="p-8 text-center space-y-3">
        <Info className="mx-auto text-slate-350" size={30} />
        <p className="text-xs font-semibold text-slate-500">No SKU item selected.</p>
        <button 
          onClick={() => setActiveScreen('Inventory Management')}
          className="text-xs text-sky-600 font-bold hover:underline"
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

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-lg -mx-4 -mt-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveScreen('Inventory Management')}
          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">SKU METE-GUIDE</span>
          <h2 className="text-sm font-bold text-slate-800">{item.sku}</h2>
        </div>
      </div>

      {/* Main product overview */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-2.5">
        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded">
          {item.category}
        </span>
        <h3 className="text-sm font-bold text-slate-800 leading-snug">{item.name}</h3>
        <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
        
        {/* Dynamic Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.tags.map((tag, i) => (
            <span key={i} className="text-[9px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-mono font-bold">
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white p-3 rounded-xl border border-slate-100">
          <span className="text-[9px] text-slate-400 font-mono block mb-1">UNIT COST</span>
          <p className="font-bold text-slate-800">${item.cost.toFixed(2)}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100">
          <span className="text-[9px] text-slate-400 font-mono block mb-1">SELLING PRICE</span>
          <p className="font-bold text-slate-800">${item.price.toFixed(2)}</p>
        </div>
        <div className="bg-emerald-[1px] border border-emerald-50 p-3 rounded-xl text-emerald-800 bg-emerald-50/50">
          <span className="text-[9px] text-slate-400 font-mono block mb-1">PROFIT %</span>
          <p className="font-extrabold text-emerald-600 font-mono">+{marginPercent}%</p>
        </div>
      </div>

      {/* Warehouse and supplier linked cards */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3.5 text-xs text-slate-700">
        <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest border-b border-slate-50 pb-1.5">Topology & Supply Channels</h4>

        <div className="space-y-2.5">
          <div className="flex gap-2">
            <MapPin size={15} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-800">{wh?.name || 'Grand Central Depot'}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Shelving Location: <span className="font-semibold text-slate-700">{item.zone} ({item.shelf})</span></p>
            </div>
          </div>

          <div className="flex gap-2 border-t border-slate-50 pt-2.5">
            <Truck size={15} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-800">{sup?.name || 'Primary Solder Vendor'}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Contract Lead Lag: <span className="font-semibold text-slate-700">{sup?.deliveryDays} Days delivery</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking and serial config widgets */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <Barcode className="text-slate-500" size={16} />
          <div>
            <span className="font-semibold text-slate-700 block text-[11px]">Serial Tracking ID</span>
            <span className="text-[10px] text-slate-450">Individual barcode logs required?</span>
          </div>
        </div>
        <span className={`inline-block font-mono font-bold text-[9px] px-2 py-0.5 rounded ${
          item.serialTracked ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {item.serialTracked ? 'SERIALIZED ON' : 'BATCH ONLY'}
        </span>
      </div>

      {/* Beautiful stock trend graph SVG mock */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 rounded-xl border border-sky-950 space-y-2 shadow-xs">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] text-sky-400 font-mono tracking-widest block uppercase">LEAN LOGISTICS ANALYTICS</span>
            <h4 className="text-xs font-bold text-slate-100 mt-0.5">Cyclic Stock Drainage Level Curve</h4>
          </div>
          <p className="text-right text-[10px] text-slate-400">Total Sku Value: <span className="font-bold text-emerald-400 font-mono block text-xs">${totalSkuValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></p>
        </div>

        {/* SVG Drawing curve line represent stock */}
        <div className="pt-2 h-18">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area path */}
            <path 
              d="M 0 35 Q 20 10 40 25 T 80 5 T 100 30 L 100 40 L 0 40 Z" 
              fill="url(#chartGrad)" 
            />
            {/* Outline curve path */}
            <path 
              d="M 0 35 Q 20 10 40 25 T 80 5 T 100 30" 
              fill="none" 
              stroke="#38bdf8" 
              strokeWidth="1.5"
              strokeLinecap="round" 
            />
            {/* Grid base line */}
            <line x1="0" y1="38" x2="100" y2="38" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,2" />
          </svg>
        </div>

        <div className="flex justify-between font-mono text-[8px] text-slate-500 pt-1 border-t border-slate-800">
          <span>Wk 1 (Recieved)</span>
          <span>Wk 2 (Fulfillment)</span>
          <span>Today (Buffer Qty: {item.qty})</span>
        </div>
      </div>
    </div>
  );
}
