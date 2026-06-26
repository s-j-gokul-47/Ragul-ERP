import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  Truck,
  Coins,
  Wifi,
  Battery,
  MonitorCheck,
  Compass,
  Briefcase
} from 'lucide-react';

// Import Types
import {
  InventoryItem,
  Warehouse,
  CustomerOrder,
  PurchaseOrder,
  Supplier,
  StockAdjustment,
  Expense,
  AccountsReceivable,
  Invoice,
  BillOfMaterial,
  ManufacturingOrder,
  Customer
} from './types';

// Import datasets
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  DEFAULT_CUSTOMER_ORDERS,
  DEFAULT_PURCHASE_ORDERS,
  DEFAULT_SUPPLIERS,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_EXPENSES,
  DEFAULT_RECEIVABLES,
  DEFAULT_INVOICES,
  DEFAULT_BOMS,
  DEFAULT_MANUFACTURING_ORDERS,
  DEFAULT_CUSTOMERS
} from './data';

// Import 16 Mobile Screen components
import Dashboard from './components/erp/Dashboard';
import InventoryManagement from './components/erp/InventoryManagement';
import ProfileSettings from './components/erp/ProfileSettings';
import OrdersManagement from './components/erp/OrdersManagement';
import PurchaseOrders from './components/erp/PurchaseOrders';
import StockAdjustments from './components/erp/StockAdjustments';
import Suppliers from './components/erp/Suppliers';
import PODetails from './components/erp/PODetails';
import NewPurchaseOrder from './components/erp/NewPurchaseOrder';
import WarehouseLocations from './components/erp/WarehouseLocations';
import StockAlerts from './components/erp/StockAlerts';
import ItemDetails from './components/erp/ItemDetails';
import FinancialOverview from './components/erp/FinancialOverview';
import ExpenseTracking from './components/erp/ExpenseTracking';
import AccountsReceivableComponent from './components/erp/AccountsReceivable';
import FinancialAnalytics from './components/erp/FinancialAnalytics';
import InvoiceManagement from './components/erp/InvoiceManagement';
import ManufacturingOrders from './components/erp/ManufacturingOrders';
import BillOfMaterials from './components/erp/BillOfMaterials';
import CustomersDirectory from './components/erp/CustomersDirectory';
import CustomerDetails from './components/erp/CustomerDetails';
import { Factory, Users } from 'lucide-react'; // Add icons

const SCREENS = [
  // Operations Center
  { name: 'Dashboard', group: 'Operations Center', desc: 'Central performance counters, KPI widgets, and actions' },
  { name: 'Profile & Settings', group: 'Operations Center', desc: 'Identity profile, default currency configuration' },

  // Logistics & Inventory
  { name: 'Inventory Management', group: 'Logistics & Inventory', desc: 'Manage central product catalog list, filters, and prices' },
  { name: 'Warehouse Locations', group: 'Logistics & Inventory', desc: 'Capacity trackers, zone layout maps, geo nodes' },
  { name: 'Stock Alerts', group: 'Logistics & Inventory', desc: 'Critical supply limits, dynamic replenishment guides' },
  { name: 'Item Details', group: 'Logistics & Inventory', desc: 'Deep dive SKU stats, profit margins, stock trends' },
  { name: 'Stock Adjustments', group: 'Logistics & Inventory', desc: 'Log manual counts audit discrepancies, material scrap' },

  // Acquisitions Pipeline
  { name: 'Purchase Orders', group: 'Acquisitions Pipeline', desc: 'Active pipeline PO lists, pricing, expected dates' },
  { name: 'PO Details', group: 'Acquisitions Pipeline', desc: 'Drill down purchase lists, dispatch check authorizations' },
  { name: 'New Purchase Orders', group: 'Acquisitions Pipeline', desc: 'Draft and compose a multi-line vendor PO' },
  { name: 'Suppliers', group: 'Acquisitions Pipeline', desc: 'Wholesale suppliers catalog directory, performance, ratings' },

  // Customer Relations (CRM)
  { name: 'Customers Directory', group: 'Customer Relations', desc: 'Master client directory, sales leads, contact actions' },
  { name: 'Customer Details', group: 'Customer Relations', desc: 'Client profile, lifetime value, transaction history' },

  // Fulfillment & Billing
  { name: 'Orders Management', group: 'Fulfillment & Billing', desc: 'Customer sales orders pipeline and fulfillment updates' },
  { name: 'Accounts Receivable', group: 'Fulfillment & Billing', desc: 'Outstanding customer invoice aging calendars, check receipts' },
  { name: 'Invoice Management', group: 'Fulfillment & Billing', desc: 'Manage client invoices and pending payments' },

  // Manufacturing
  { name: 'Manufacturing Orders', group: 'Factory & Production', desc: 'Manage active shop floor MOs and WIP assemblies' },
  { name: 'Bill of Materials', group: 'Factory & Production', desc: 'Manage formulas, components, and operations for products' },

  // Treasury Core
  { name: 'Financial Overview', group: 'Treasury Core', desc: 'Cash flow metrics ledger, reserves check logs' },
  { name: 'Expense Tracking', group: 'Treasury Core', desc: 'Disbursements diary, categories, photo slip logs' },
  { name: 'Financial Analytics', group: 'Treasury Core', desc: 'Profits analytics growth curves diagrams, division donuts' }
];

export default function App() {
  // Live local active state
  const [items, setItems] = useState<InventoryItem[]>(DEFAULT_ITEMS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(DEFAULT_WAREHOUSES);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(DEFAULT_CUSTOMER_ORDERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(DEFAULT_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(DEFAULT_SUPPLIERS);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(DEFAULT_ADJUSTMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
  const [receivables, setReceivables] = useState<AccountsReceivable[]>(DEFAULT_RECEIVABLES);
  const [invoices, setInvoices] = useState<Invoice[]>(DEFAULT_INVOICES);
  const [boms, setBoms] = useState<BillOfMaterial[]>(DEFAULT_BOMS);
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>(DEFAULT_MANUFACTURING_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Layout configs
  const [activeScreen, setActiveScreen] = useState<string>('Dashboard');
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedItemId, setSelectedItemId] = useState<string | null>('item-1');
  const [selectedPOId, setSelectedPOId] = useState<string | null>('PO-2026-015');

  // Time state for mobile frame status
  const [currentTime, setCurrentTime] = useState<string>('15:30');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleResetDemoData = () => {
    setItems(DEFAULT_ITEMS);
    setWarehouses(DEFAULT_WAREHOUSES);
    setCustomerOrders(DEFAULT_CUSTOMER_ORDERS);
    setPurchaseOrders(DEFAULT_PURCHASE_ORDERS);
    setSuppliers(DEFAULT_SUPPLIERS);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setExpenses(DEFAULT_EXPENSES);
    setReceivables(DEFAULT_RECEIVABLES);
    setInvoices(DEFAULT_INVOICES);
    setBoms(DEFAULT_BOMS);
    setManufacturingOrders(DEFAULT_MANUFACTURING_ORDERS);
    setCustomers(DEFAULT_CUSTOMERS);
    setSelectedItemId('item-1');
    setSelectedPOId('PO-2026-015');
    setSelectedInvoiceId(null);
    setSelectedCustomerId(null);
    setActiveScreen('Dashboard');
  };

  const activeAlertsCount = items.filter(i => i.qty <= i.minQty).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">

      {/* LEFT SECTION: Main documentation design-spec sheet & Component Directory Mapping */}
      <div className="flex-1 p-6 md:p-8 space-y-6 md:border-r border-slate-800 xl:max-w-xl overflow-y-auto">
        <div>
          <span className="text-xs text-sky-400 font-mono tracking-wider font-bold">GOOGLE STITCH • EXTRACTED DESIGN SYSTEM</span>
          <h1 className="text-2xl font-black mt-1 text-slate-50 tracking-tight">Stitch Mobile ERP Blueprint</h1>
          <p className="text-xs text-slate-400 mt-1 pb-4 border-b border-slate-800">
            Design Space Reference: <span className="text-sky-300 font-mono">ID: 5109108197113729161</span> • Unified React + Tailwind System.
          </p>
        </div>

        {/* Global Design parameters summary metadata */}
        <div className="bg-slate-900/50 rounded-2xl p-4.5 border border-slate-800/80 space-y-3.5 text-xs text-slate-300">
          <h3 className="font-bold flex items-center gap-1.5 text-slate-100 uppercase font-mono text-[11px] tracking-widest text-sky-450">
            <Compass size={14} className="text-sky-400" /> Stitch Visual Spec Matrix
          </h3>
          <ul className="space-y-2 font-mono text-[11px]">
            <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-500">Typography Grid</span>
              <span className="font-semibold text-slate-300">Inter (UI UI) • JetBrains Mono</span>
            </li>
            <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-500">Base Frame Layout</span>
              <span className="font-semibold text-slate-300">375px × 812px Mobile View</span>
            </li>
            <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-300">Primary Color Theme</span>
              <span className="font-bold text-sky-400">Slate / Charcoal High-Contrast Light</span>
            </li>
            <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-500">Database Binding</span>
              <span className="font-semibold text-slate-300">Live Operating Reactive State Tree</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Component Count</span>
              <span className="font-bold text-indigo-400">16 Standalone Screens mapped</span>
            </li>
          </ul>
        </div>

        {/* Mapped Directory index tree */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 font-mono">16 Screens Code Directory</h3>

          <div className="space-y-4">
            {['Operations Center', 'Customer Relations', 'Logistics & Inventory', 'Acquisitions Pipeline', 'Fulfillment & Billing', 'Factory & Production', 'Treasury Core'].map((group) => {
              const groupScreens = SCREENS.filter(s => s.group === group);
              return (
                <div key={group} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-sky-500 tracking-wider font-mono uppercase block pl-1.5">
                    {group}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {groupScreens.map((screen) => {
                      const isActive = activeScreen === screen.name;
                      return (
                        <div
                          key={screen.name}
                          onClick={() => {
                            setActiveScreen(screen.name);
                            if (screen.name === 'Item Details' && !selectedItemId) {
                              setSelectedItemId('item-1');
                            }
                            if (screen.name === 'PO Details' && !selectedPOId) {
                              setSelectedPOId('PO-2026-015');
                            }
                          }}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition select-none flex flex-col justify-between ${isActive
                              ? 'bg-sky-950/40 border-sky-600 text-slate-50 shadow-sm shadow-sky-950'
                              : 'bg-slate-900/30 border-slate-800/70 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                            }`}
                        >
                          <div>
                            <p className="font-bold text-slate-200">{screen.name}</p>
                            <p className="text-[10px] mt-0.5 text-slate-400 line-clamp-1 leading-snug">{screen.desc}</p>
                          </div>
                          {isActive && (
                            <span className="mt-2 text-[8px] bg-sky-500 text-white font-mono font-bold tracking-wider uppercase py-0.2 px-1 rounded w-max">
                              Active View
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic active screen mapping diagnostic information */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 space-y-2">
          <h4 className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1">
            <MonitorCheck size={14} /> ACTIVE RUNTIME HOOKS
          </h4>
          <p className="text-[11px] text-slate-350 leading-relaxed font-mono">
            Adjusting counts inside the mobile screens triggers reactive state mutations propagating across widgets in real-time. Try entering a replenishment PO or auditing a SKU quantity down to watch it reflect instantly.
          </p>
          <div className="flex gap-2.5 text-[10px] font-mono text-slate-500">
            <span>Catalog: <b>{items.length} SKUs</b></span>
            <span>POs: <b>{purchaseOrders.length} Issued</b></span>
            <span>Unpaid: <b>{receivables.filter(r => r.status !== 'Paid').length} Invoices</b></span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Bezelless Smart Device frame housing the Live Render Container */}
      <div className="flex-1 bg-slate-900 border-t md:border-t-0 border-slate-800 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="relative w-full max-w-[385px] bg-slate-950 border-[8px] border-slate-800 rounded-[45px] shadow-2xl shadow-black overflow-hidden flex flex-col aspect-[9/19] select-none min-h-[780px]">

          {/* Internal Camera Sensor Island Pill (Dynamic Notch) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full mr-2" />
            <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
          </div>

          {/* Core Mobile System Status Bar */}
          <div className="bg-slate-900 text-white pt-2.5 pb-2 px-6 flex justify-between items-center text-[10px] font-mono font-bold z-40 relative">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5 pr-2.5">
              <Wifi size={10} />
              <span className="bg-emerald-600 block h-1.5 w-1.5 rounded-full animate-ping" />
              <span>5G</span>
              <Battery size={13} className="text-slate-100" />
            </div>
          </div>

          {/* Active mobile viewport canvas wrapper (scroll containment) */}
          <div className="flex-1 bg-slate-950 text-slate-900 overflow-y-auto relative font-sans scrollbar-thin">

            {/* Standard React router style switcher depending on selected screen */}
            {activeScreen === 'Dashboard' && (
              <Dashboard
                items={items}
                purchaseOrders={purchaseOrders}
                customerOrders={customerOrders}
                invoices={invoices}
                activeAlertsCount={activeAlertsCount}
                setActiveScreen={setActiveScreen}
                setSelectedItemId={setSelectedItemId}
                setSelectedPOId={setSelectedPOId}
              />
            )}

            {activeScreen === 'Customers Directory' && (
              <CustomersDirectory
                customers={customers}
                setActiveScreen={setActiveScreen}
                setSelectedCustomerId={setSelectedCustomerId}
              />
            )}

            {activeScreen === 'Customer Details' && (
              <CustomerDetails
                selectedCustomerId={selectedCustomerId}
                customers={customers}
                customerOrders={customerOrders}
                invoices={invoices}
                setActiveScreen={setActiveScreen}
                setSelectedInvoiceId={setSelectedInvoiceId}
              />
            )}

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

            {activeScreen === 'Profile & Settings' && (
              <ProfileSettings
                onResetData={handleResetDemoData}
                currency={currency}
                setCurrency={setCurrency}
              />
            )}

            {activeScreen === 'Orders Management' && (
              <OrdersManagement
                customerOrders={customerOrders}
                setCustomerOrders={setCustomerOrders}
                items={items}
                setItems={setItems}
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

            {activeScreen === 'Manufacturing Orders' && (
              <ManufacturingOrders
                manufacturingOrders={manufacturingOrders}
                setManufacturingOrders={setManufacturingOrders}
                items={items}
                boms={boms}
                setActiveScreen={setActiveScreen}
              />
            )}

            {activeScreen === 'Bill of Materials' && (
              <BillOfMaterials
                boms={boms}
                items={items}
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

            {activeScreen === 'Suppliers' && (
              <Suppliers
                suppliers={suppliers}
                setSuppliers={setSuppliers}
              />
            )}

            {activeScreen === 'PO Details' && (
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

            {activeScreen === 'Item Details' && (
              <ItemDetails
                selectedItemId={selectedItemId}
                items={items}
                warehouses={warehouses}
                suppliers={suppliers}
                setActiveScreen={setActiveScreen}
              />
            )}

            {activeScreen === 'Financial Overview' && (
              <FinancialOverview
                expenses={expenses}
                receivables={receivables}
                currency={currency}
                setActiveScreen={setActiveScreen}
              />
            )}

            {activeScreen === 'Expense Tracking' && (
              <ExpenseTracking
                expenses={expenses}
                setExpenses={setExpenses}
                currency={currency}
              />
            )}

            {activeScreen === 'Accounts Receivable' && (
              <AccountsReceivableComponent
                receivables={receivables}
                setReceivables={setReceivables}
                currency={currency}
              />
            )}

            {activeScreen === 'Financial Analytics' && (
              <FinancialAnalytics
                expenses={expenses}
                receivables={receivables}
                currency={currency}
              />
            )}

            {activeScreen === 'Invoice Management' && (
              <InvoiceManagement
                invoices={invoices}
                setSelectedInvoiceId={setSelectedInvoiceId}
                setActiveScreen={setActiveScreen}
              />
            )}

          </div>

          {/* Unified Navigation Bottom Bar inside mobile simulator */}
          <div className="bg-slate-900 text-white py-2 px-3 border-t border-slate-800 flex justify-around items-center z-40">
            <button
              id="tab-dashboard"
              onClick={() => setActiveScreen('Dashboard')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Dashboard' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <Briefcase size={15} />
              <span className="text-[8px] mt-0.5">Core</span>
            </button>

            <button
              id="tab-inventory"
              onClick={() => setActiveScreen('Inventory Management')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Inventory Management' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <Package size={15} />
              <span className="text-[8px] mt-0.5">Stock</span>
            </button>

            <button
              id="tab-po"
              onClick={() => setActiveScreen('Purchase Orders')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Purchase Orders' || activeScreen === 'PO Details' || activeScreen === 'New Purchase Orders' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <Truck size={15} />
              <span className="text-[8px] mt-0.5">POs</span>
            </button>

            <button
              id="tab-crm"
              onClick={() => setActiveScreen('Customers Directory')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Customers Directory' || activeScreen === 'Customer Details' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <Users size={15} />
              <span className="text-[8px] mt-0.5">CRM</span>
            </button>

            <button
              id="tab-finance"
              onClick={() => setActiveScreen('Financial Overview')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Financial Overview' || activeScreen === 'Expense Tracking' || activeScreen === 'Financial Analytics' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <Coins size={15} />
              <span className="text-[8px] mt-0.5">Treasury</span>
            </button>

            <button
              id="tab-mfg"
              onClick={() => setActiveScreen('Manufacturing Orders')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Manufacturing Orders' || activeScreen === 'Bill of Materials' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <Factory size={15} />
              <span className="text-[8px] mt-0.5">Mfg</span>
            </button>

            <button
              id="tab-alerts"
              onClick={() => setActiveScreen('Stock Alerts')}
              className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter relative ${activeScreen === 'Stock Alerts' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white transition'
                }`}
            >
              <AlertTriangle size={15} />
              <span className="text-[8px] mt-0.5">Alerts</span>
              {activeAlertsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Premium Home Notch bottom line inside mock phone UI */}
          <div className="bg-slate-900 pb-2.5 flex justify-center z-40 bg-slate-900">
            <div className="w-28 h-1 bg-slate-700/60 rounded-full" />
          </div>

        </div>
      </div>

    </div>
  );
}
