import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import InventoryManagement from './InventoryManagement';
import ItemDetails from './ItemDetails';
import StockAdjustments from './StockAdjustments';
import WarehouseLocations from './WarehouseLocations';
import StockAlerts from './StockAlerts';
import PurchaseOrders from './PurchaseOrders';
import PODetails from './PODetails';
import NewPurchaseOrder from './NewPurchaseOrder';
import Suppliers from './Suppliers';
import { 
  DEFAULT_ITEMS, 
  DEFAULT_WAREHOUSES, 
  DEFAULT_SUPPLIERS,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_PURCHASE_ORDERS
} from '../../data';
import { Package, AlertTriangle, Truck, Briefcase } from 'lucide-react';

let root: Root | null = null;

function InventoryApp() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [warehouses, setWarehouses] = useState(DEFAULT_WAREHOUSES);
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);
  const [purchaseOrders, setPurchaseOrders] = useState(DEFAULT_PURCHASE_ORDERS);
  
  const [activeScreen, setActiveScreen] = useState('Inventory Management');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedPOId, setSelectedPOId] = useState<string | null>(null);

  const activeAlertsCount = items.filter(i => i.qty <= i.minQty).length;

  return (
    <div className="react-inventory-container bg-slate-950 text-slate-100 min-h-full flex flex-col font-sans w-full max-w-[500px] mx-auto overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Top Header */}
      <div className="bg-slate-900 text-white pt-4 pb-2 px-6 flex justify-between items-center text-[10px] font-mono font-bold z-40 border-b border-slate-800">
        <h1 className="text-lg font-extrabold tracking-tight">Inventory Ops</h1>
      </div>

      <div className="flex-1 bg-slate-50 text-slate-900 overflow-y-auto p-4 relative font-sans scrollbar-none">
        {activeScreen === 'Inventory Management' && (
          <InventoryManagement 
            items={items}
            setItems={setItems}
            warehouses={warehouses}
            suppliers={suppliers}
            setActiveScreen={setActiveScreen}
            setSelectedItemId={setSelectedItemId}
          />
        )}
        
        {activeScreen === 'Item Details' && (
          <ItemDetails 
            selectedItemId={selectedItemId}
            items={items}
            warehouses={warehouses}
            suppliers={suppliers}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'Stock Adjustments' && (
          <StockAdjustments 
            adjustments={adjustments}
            setAdjustments={setAdjustments}
            items={items}
            setItems={setItems}
          />
        )}

        {activeScreen === 'Warehouse Locations' && (
          <WarehouseLocations 
            warehouses={warehouses}
            setWarehouses={setWarehouses}
            items={items}
          />
        )}

        {activeScreen === 'Stock Alerts' && (
          <StockAlerts 
            items={items}
            warehouses={warehouses}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'Purchase Orders' && (
          <PurchaseOrders 
            purchaseOrders={purchaseOrders}
            setSelectedPOId={setSelectedPOId}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'PODetails' && (
          <PODetails 
            selectedPOId={selectedPOId}
            purchaseOrders={purchaseOrders}
            setPurchaseOrders={setPurchaseOrders}
            items={items}
            setItems={setItems}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'New Purchase Orders' && (
          <NewPurchaseOrder 
            suppliers={suppliers}
            items={items}
            setPurchaseOrders={setPurchaseOrders}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'Suppliers' && (
          <Suppliers 
            suppliers={suppliers}
            setSuppliers={setSuppliers}
          />
        )}
      </div>

      {/* Local Sub-Navigation for React Module */}
      <div className="bg-slate-900 text-white py-2 px-3 border-t border-slate-800 flex justify-around items-center z-40">
        <button 
          onClick={() => setActiveScreen('Inventory Management')}
          className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${
            activeScreen === 'Inventory Management' || activeScreen === 'Item Details' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
          }`}
        >
          <Package size={15} />
          <span className="text-[8px] mt-0.5">Stock</span>
        </button>

        <button 
          onClick={() => setActiveScreen('Warehouse Locations')}
          className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${
            activeScreen === 'Warehouse Locations' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
          }`}
        >
          <Briefcase size={15} />
          <span className="text-[8px] mt-0.5">Nodes</span>
        </button>

        <button 
          onClick={() => setActiveScreen('Purchase Orders')}
          className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${
            activeScreen === 'Purchase Orders' || activeScreen === 'PODetails' || activeScreen === 'New Purchase Orders' || activeScreen === 'Suppliers' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
          }`}
        >
          <Truck size={15} />
          <span className="text-[8px] mt-0.5">Supply</span>
        </button>

        <button 
          onClick={() => setActiveScreen('Stock Alerts')}
          className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter relative ${
            activeScreen === 'Stock Alerts' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
          }`}
        >
          <AlertTriangle size={15} />
          <span className="text-[8px] mt-0.5">Alerts</span>
          {activeAlertsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}

export function mountReactInventory(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (!root) {
    root = createRoot(container);
  }
  
  // Need to ensure tailwind styles apply. Since we inject into a container, 
  // it should naturally inherit from global styles if included in index.html.
  root.render(<InventoryApp />);
}

export function unmountReactInventory() {
  if (root) {
    root.unmount();
    root = null;
  }
}
