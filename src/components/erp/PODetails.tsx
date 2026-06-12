import React from 'react';
import { 
  FileText, 
  ChevronLeft, 
  User, 
  DollarSign, 
  Calendar, 
  Check, 
  Truck, 
  Clock, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { PurchaseOrder, InventoryItem } from '../../types';

interface PODetailsProps {
  selectedPOId: string | null;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setActiveScreen: (screen: string) => void;
}

export default function PODetails({
  selectedPOId,
  purchaseOrders,
  setPurchaseOrders,
  items,
  setItems,
  setActiveScreen,
}: PODetailsProps) {
  // Find current PO
  const po = purchaseOrders.find(p => p.id === selectedPOId) || purchaseOrders[0];

  if (!po) {
    return (
      <div className="p-8 text-center space-y-3">
        <AlertCircle className="mx-auto text-slate-350" size={30} />
        <p className="text-xs font-semibold text-slate-500">No purchase order selected.</p>
        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className="text-xs text-sky-600 font-bold hover:underline"
        >
          Return to PO Pipeline list
        </button>
      </div>
    );
  }

  // Handle Receiving PO items
  const handleReceivePO = () => {
    // 1. Mark PO as Received
    setPurchaseOrders(prev => prev.map(p => {
      if (p.id === po.id) {
        return { ...p, status: 'Received' };
      }
      return p;
    }));

    // 2. Increment stock level qty in InventoryItem list matching product SKU
    setItems(currentItems => {
      return currentItems.map(item => {
        // Find if this specific item SKU is listed on the PO
        const poLine = po.items.find(line => line.sku === item.sku);
        if (poLine) {
          // Found match! Increment quantities
          return {
            ...item,
            qty: item.qty + poLine.qty
          };
        }
        return item;
      });
    });

    alert(`Successfully processed intake registry for PO ${po.id}. Active stock levels incremented and updated.`);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Detail screen sub-header with back */}
      <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-lg -mx-4 -mt-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">SECURE ARCHIVE DETAIL</span>
          <h2 className="text-sm font-bold text-slate-800">{po.id}</h2>
        </div>
      </div>

      {/* PO Overview Details block */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] text-slate-400 font-mono block">PARTNER SUPPLIER</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{po.supplierName}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            po.status === 'Received' ? 'bg-emerald-50 text-emerald-700' :
            po.status === 'Partially Received' ? 'bg-indigo-50 text-indigo-700' :
            po.status === 'Sent' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {po.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-50 pt-3">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-400 font-mono">ORDERED CALENDAR</span>
            <p className="font-medium text-slate-700 flex items-center gap-1"><Calendar size={11} /> {po.orderDate}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-400 font-mono">ESTIMATED LANDING</span>
            <p className="font-medium text-slate-700 flex items-center gap-1"><Clock size={11} /> {po.expectedDate}</p>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[9px] text-slate-400 font-mono">BILLING TERMS</span>
            <p className="font-semibold text-slate-700">{po.billingTerms}</p>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[9px] text-slate-400 font-mono">ERP APPROVAL STAMP</span>
            <p className="font-semibold text-slate-700 flex items-center gap-1">
              <User size={11} className="text-emerald-500" /> {po.approvedBy || 'SYSTEM'}
            </p>
          </div>
        </div>
      </div>

      {/* Item summary lines */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest border-b border-slate-50 pb-1.5">Cargo Manifest Line Items</h3>
        
        <div className="divide-y divide-slate-50">
          {po.items.map((line, idx) => (
            <div key={idx} className="py-2.5 flex justify-between items-start text-xs">
              <div className="space-y-0.5 flex-1 pr-4">
                <span className="text-[9px] font-bold text-slate-450 font-mono bg-slate-100 px-1 rounded pr-1.5">SKU: {line.sku}</span>
                <p className="font-bold text-slate-800">{line.itemName}</p>
                <p className="text-[10px] text-slate-400">{line.qty} Units requested x ${line.cost.toFixed(2)} cost</p>
              </div>
              <p className="font-bold text-slate-800">${(line.qty * line.cost).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* PO Total math */}
        <div className="border-t border-slate-100 pt-3 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 p-4 rounded-b-xl">
          <span className="text-xs font-bold text-slate-700">Committed PO Total</span>
          <span className="text-base font-extrabold text-slate-900">${po.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Received Intake registration trigger */}
      {po.status !== 'Received' ? (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            <Truck className="text-indigo-600 mt-0.5 flex-shrink-0" size={16} />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-indigo-900">Authorize Stock Intake Registration</h4>
              <p className="text-[11px] text-indigo-700 leading-normal">
                Verifying shipment delivery? Clicking confirmation registers these quantities into physical warehouse stock levels automatically.
              </p>
            </div>
          </div>
          <button 
            id="btn-confirm-intake-po"
            onClick={handleReceivePO}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg py-2 shadow-sm transition"
          >
            Confirm Cargo Clearance & Intake
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-2 text-emerald-900 text-xs font-medium">
          <Check className="text-emerald-600 mt-0.5 flex-shrink-0" size={16} />
          <div>
            <h4 className="font-bold">Intake Logged & Sealed</h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">This shipment was fully verified, stored, and integrated into active inventory ledger records.</p>
          </div>
        </div>
      )}
    </div>
  );
}
