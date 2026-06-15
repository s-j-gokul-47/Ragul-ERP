import React from 'react';
import { 
  AlertTriangle, 
  Package, 
  MapPin, 
  ShieldAlert, 
  Truck, 
  ArrowRight,
  TrendingUp,
  Boxes
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
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-rose-500 uppercase font-mono tracking-wider">CRITICAL MITIGATIONS</span>
          <h2 className="text-sm font-bold text-slate-800">Low Stock Alerts ({alertedItems.length})</h2>
        </div>
      </div>

      <div className="bg-rose-[1.5px] border border-rose-100 p-4 rounded-xl flex gap-3 text-xs leading-normal">
        <ShieldAlert size={22} className="text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
        <div className="space-y-1 text-slate-800">
          <h4 className="font-bold text-rose-800">Production Distressed</h4>
          <p className="text-[11px] text-slate-650">
            Below warehouse safety threshold margins. Production runs will undergo resource starvation if replacement purchase orders are not issued immediately to core suppliers.
          </p>
        </div>
      </div>

      {/* List of critical materials */}
      <div className="space-y-3">
        {alertedItems.length > 0 ? (
          alertedItems.map((item) => {
            const wh = warehouses.find(w => w.id === item.warehouseId);
            const deficit = item.minQty - item.qty;
            const recommendedOrderQty = deficit + Math.ceil(item.minQty * 0.5); // Buffer

            return (
              <div 
                key={item.id}
                id={`alert-item-card-${item.id}`}
                className="bg-white rounded-xl border border-rose-100 shadow-xs p-3.5 space-y-3 relative overflow-hidden"
              >
                {/* Visual warning flash ribbon */}
                <div className="absolute right-0 top-0 h-10 w-10 overflow-hidden">
                  <div className="absolute top-[8px] right-[-14px] bg-rose-500 text-white font-mono text-[7px] font-bold text-center rotate-45 w-[50px] py-0.5 tracking-wider">
                    LOW
                  </div>
                </div>

                {/* SKU Code */}
                <div>
                  <span className="text-[9px] bg-rose-50 self-start text-rose-700 border border-rose-100 font-mono font-bold px-1.5 py-0.5 rounded">
                    SKU: {item.sku}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 mt-1.5 pr-8">{item.name}</h3>
                </div>

                {/* Stock deficiency compare bar widget */}
                <div className="bg-slate-50 p-2.5 rounded-lg space-y-1.5 text-[10px] text-slate-600 font-mono">
                  <div className="flex justify-between font-bold">
                    <span>Physical Stock: <span className="text-rose-600 font-bold">{item.qty} {item.unit}</span></span>
                    <span>Safety Margin: <span className="text-slate-700">{item.minQty} {item.unit}</span></span>
                  </div>
                  
                  {/* Deficiency slider visual layout bar */}
                  <div className="relative w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.max(10, (item.qty / item.minQty) * 100)}%` }}></div>
                  </div>
                </div>

                {/* Mitigation summary details card */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-50">
                  <span className="flex items-center gap-0.5"><MapPin size={10} className="text-rose-400" /> {wh?.name || 'Dallas Hub'}</span>
                  <span className="text-rose-600 font-bold flex items-center gap-0.5">Deficit: {deficit} Units</span>
                </div>

                {/* Immediate Order CTA */}
                <div className="bg-slate-50 p-2.5 -mx-3.5 -mb-3.5 mt-2.5 rounded-b-xl border-t border-slate-100 flex justify-between items-center">
                  <div className="text-[10px] text-slate-600">
                    Recommended Re-order: <span className="font-extrabold text-slate-800 font-mono">{recommendedOrderQty} {item.unit}</span>
                  </div>
                  <button
                    onClick={() => setActiveScreen('New Purchase Orders')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-0.5 transition"
                  >
                    Draft PO <ArrowRight size={10} className="ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Boxes size={30} className="mx-auto text-emerald-500 opacity-60" />
            <h4 className="text-xs font-bold text-slate-750">Supply Levels Stabilized</h4>
            <p className="text-[10px] text-slate-450 leading-relaxed max-w-[200px] mx-auto">
              All inventory components meet or exceed enterprise safety thresholds. Good work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
