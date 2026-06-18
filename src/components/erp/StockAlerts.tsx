import React from 'react';
import { 
  AlertTriangle, 
  Package, 
  MapPin, 
  ShieldAlert, 
  Truck, 
  ArrowRight,
  TrendingUp,
  Boxes,
  Activity,
  BellRing
} from 'lucide-react';
import { InventoryItem, Warehouse } from '../../types';

interface StockAlertsProps {
  items: InventoryItem[];
  warehouses: Warehouse[];
  setActiveScreen: (screen: string) => void;
}

export default function StockAlerts({
  items,
  warehouses,
  setActiveScreen,
}: StockAlertsProps) {
  // Find items where qty <= minQty
  const alertedItems = items.filter(item => item.qty <= item.minQty);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Screen Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 p-5 rounded-2xl shadow-[0_8px_30px_rgb(225,29,72,0.2)] border border-rose-800/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-rose-400 uppercase font-mono tracking-widest font-bold flex items-center gap-2 mb-1.5">
            <BellRing size={12} className="animate-bounce" /> CRITICAL MITIGATIONS
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Active Stock Alerts
            <span className="bg-rose-500/20 text-rose-200 text-xs py-1 px-3 rounded-full backdrop-blur-md border border-rose-400/30 font-mono">
              {alertedItems.length} Issues
            </span>
          </h2>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-rose-100 relative">
          <div className="absolute inset-0 bg-rose-500 rounded-xl opacity-20 animate-ping"></div>
          <ShieldAlert size={28} className="text-rose-600 relative z-10" />
        </div>
        <div className="space-y-1.5 flex-1 pt-1">
          <h4 className="font-extrabold text-rose-900 text-base flex items-center gap-2">
            Production Pipeline Distressed
          </h4>
          <p className="text-sm text-rose-700/80 leading-relaxed font-medium">
            Certain inventory levels have fallen below required warehouse safety thresholds. Immediate purchase orders to core suppliers are recommended to prevent supply chain bottlenecks and resource starvation.
          </p>
        </div>
      </div>

      {/* List of critical materials */}
      <div className="grid grid-cols-1 gap-5">
        {alertedItems.length > 0 ? (
          alertedItems.map((item, idx) => {
            const wh = warehouses.find(w => w.id === item.warehouseId);
            const deficit = item.minQty - item.qty;
            const recommendedOrderQty = deficit + Math.ceil(item.minQty * 0.5); // Buffer
            const stockRatio = Math.max(5, (item.qty / item.minQty) * 100);

            return (
              <div 
                key={item.id}
                id={`alert-item-card-${item.id}`}
                className="bg-white rounded-2xl border border-rose-200/60 shadow-[0_4px_20px_rgb(225,29,72,0.05)] p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                
                {/* Visual warning flash ribbon */}
                <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-[12px] right-[-24px] bg-gradient-to-r from-rose-600 to-rose-500 text-white font-mono text-[9px] font-extrabold text-center rotate-45 w-[80px] py-1 tracking-widest shadow-md">
                    CRITICAL
                  </div>
                </div>

                <div className="space-y-5">
                  {/* SKU Code */}
                  <div className="pr-10">
                    <span className="inline-block text-[10px] bg-rose-50 text-rose-700 border border-rose-200/60 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                      {item.sku}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">{item.name}</h3>
                  </div>

                  {/* Stock deficiency compare bar widget */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Current Stock</span>
                        <span className="text-xl font-extrabold text-rose-600 leading-none">{item.qty} <span className="text-xs text-rose-500 font-medium">{item.unit}</span></span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Required Min</span>
                        <span className="text-sm font-bold text-slate-700">{item.minQty} {item.unit}</span>
                      </div>
                    </div>
                    
                    {/* Deficiency slider visual layout bar */}
                    <div className="relative w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-rose-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgb(225,29,72,0.8)]" style={{ width: `${stockRatio}%` }}></div>
                    </div>
                  </div>

                  {/* Mitigation summary details card */}
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium px-1">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-rose-400" /> {wh?.name || 'Dallas Hub'}</span>
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg">Deficit: {deficit} {item.unit}</span>
                  </div>

                  {/* Immediate Order CTA */}
                  <div className="bg-slate-50 -mx-5 -mb-5 p-4 border-t border-slate-100 flex justify-between items-center mt-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Re-order</span>
                      <span className="font-extrabold text-slate-800 font-mono text-sm">{recommendedOrderQty} {item.unit}</span>
                    </div>
                    <button
                      onClick={() => setActiveScreen('New Purchase Orders')}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Draft PO <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-gradient-to-b from-emerald-50/50 to-white border-2 border-dashed border-emerald-200 rounded-3xl p-12 text-center text-slate-500 space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white border border-emerald-100 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                <Boxes size={36} className="text-emerald-500" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-800 mb-2">Supply Levels Stabilized</h4>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
                All inventory components currently meet or exceed enterprise safety thresholds. Your supply chain is healthy and operational.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
