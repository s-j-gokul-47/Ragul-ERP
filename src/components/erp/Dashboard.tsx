import React from 'react';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle, 
  Plus, 
  Sliders, 
  DollarSign, 
  Truck, 
  ChevronRight,
  Bell,
  FileText,
  CreditCard
} from 'lucide-react';
import { InventoryItem, PurchaseOrder, CustomerOrder, Invoice, ManufacturingOrder } from '../../types';

interface DashboardProps {
  items: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  customerOrders: CustomerOrder[];
  invoices: Invoice[];
  activeAlertsCount: number;
  manufacturingOrders?: ManufacturingOrder[];
  setActiveScreen: (screen: string) => void;
  setSelectedItemId: (id: string) => void;
  setSelectedPOId: (id: string) => void;
}

export default function Dashboard({
  items,
  purchaseOrders,
  customerOrders,
  invoices,
  activeAlertsCount,
  manufacturingOrders = [],
  setActiveScreen,
  setSelectedItemId,
  setSelectedPOId,
}: DashboardProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Calculations for KPI widgets
  const totalStockValuation = items.reduce((acc, item) => acc + (item.qty * item.cost), 0);
  const activePOs = purchaseOrders.filter(po => po.status === 'Sent' || po.status === 'Partially Received').length;
  const pendingCustomerOrders = customerOrders.filter(co => co.status === 'Pending').length;
  const activeMOs = manufacturingOrders.filter(mo => mo.status === 'Draft' || mo.status === 'In Progress').length;
  
  // Recent transactions (combine custom order and PO list)
  const lowStockItems = items.filter(item => item.qty <= item.minQty);

  return (
    <div className="space-y-5 pb-6 p-4 pt-4">
      {/* Dynamic Mobile Header */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-4 -mx-4 -mt-4 shadow-md rounded-b-2xl border-b border-sky-950 relative z-50">
        <div>
          <span className="text-xs text-sky-400 font-mono tracking-wider">ENTERPRISE ERP • CLOUD LIVE</span>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-1.5">
            Dallas Core Hub
          </h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-slate-800 rounded-full border border-slate-700 relative text-slate-300 hover:text-white transition"
          >
            <Bell size={18} />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none">
                {activeAlertsCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none">&times;</button>
              </div>
              <div className="max-h-64 overflow-y-auto p-2 space-y-2 bg-white">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map(item => (
                    <div 
                      key={item.id} 
                      className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg cursor-pointer hover:bg-rose-100 transition"
                      onClick={() => {
                        setShowNotifications(false);
                        setSelectedItemId(item.id);
                        setActiveScreen('Item Details');
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-rose-800 leading-tight">{item.name}</p>
                          <p className="text-[10px] text-rose-600 mt-0.5">Critical low stock: {item.qty} units remaining</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs font-medium">
                    You're all caught up!
                  </div>
                )}
              </div>
              {lowStockItems.length > 0 && (
                <div className="p-2 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveScreen('Stock Alerts');
                    }}
                    className="w-full text-center text-[10px] font-bold text-sky-600 hover:text-sky-700 transition"
                  >
                    View All Stock Alerts →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Display Metrics Horizontal Scroll */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-1 text-slate-400">
            <span className="text-xs font-medium">Inventory Value</span>
            <div className="p-1 bg-sky-50 rounded text-sky-600">
              <Package size={14} />
            </div>
          </div>
          <p className="text-lg font-bold text-slate-800">${totalStockValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <span className="text-[10px] text-emerald-600 font-medium">↑ 4.2% from last wk</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-1 text-slate-400">
            <span className="text-xs font-medium">Pending Sales</span>
            <div className="p-1 bg-amber-50 rounded text-amber-600">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="text-lg font-bold text-slate-800">{pendingCustomerOrders} Placed</p>
          <span className="text-[10px] text-amber-600 font-medium">Requires dispatch</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs cursor-pointer" onClick={() => setActiveScreen('Manufacturing Orders')}>
          <div className="flex justify-between items-start mb-1 text-slate-400">
            <span className="text-xs font-medium">Active MOs</span>
            <div className="p-1 bg-amber-50 rounded text-amber-600">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="text-lg font-bold text-slate-800">{activeMOs} Orders</p>
          <span className="text-[10px] text-amber-600 font-medium">In production</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-1 text-slate-400">
            <span className="text-xs font-medium">Critical Stock Alerts</span>
            <div className="p-1 bg-rose-50 rounded text-rose-600">
              <AlertTriangle size={14} />
            </div>
          </div>
          <p className="text-lg font-bold text-rose-600">{lowStockItems.length} SKUs Low</p>
          <span className="text-[10px] text-rose-500 font-medium cursor-pointer" onClick={() => setActiveScreen('Stock Alerts')}>
            Configure reorder →
          </span>
        </div>
      </div>

      {/* Quick Launchpad Menu */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Quick ERP Launchpad</h2>
        <div className="grid grid-cols-4 gap-2">
          <button 
            id="btn-quick-new-po"
            onClick={() => setActiveScreen('New Purchase Orders')}
            className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl hover:bg-slate-100 transition text-center"
          >
            <div className="p-2 bg-sky-500 text-white rounded-lg mb-1 shadow-sm">
              <Plus size={16} />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">New PO</span>
          </button>

          <button 
            id="btn-quick-new-mo"
            onClick={() => setActiveScreen('Manufacturing Orders')}
            className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl hover:bg-slate-100 transition text-center"
          >
            <div className="p-2 bg-amber-500 text-white rounded-lg mb-1 shadow-sm">
              <Plus size={16} />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">New MO</span>
          </button>

          <button 
            id="btn-quick-exp"
            onClick={() => setActiveScreen('Expense Tracking')}
            className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl hover:bg-slate-100 transition text-center"
          >
            <div className="p-2 bg-emerald-500 text-white rounded-lg mb-1 shadow-sm">
              <DollarSign size={16} />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">Log Expense</span>
          </button>

          <button 
            id="btn-quick-inv"
            onClick={() => setActiveScreen('Invoice Management')}
            className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl hover:bg-slate-100 transition text-center"
          >
            <div className="p-2 bg-indigo-500 text-white rounded-lg mb-1 shadow-sm">
              <FileText size={16} />
            </div>
            <span className="text-[10px] font-medium text-slate-700 leading-tight">Invoices</span>
          </button>
        </div>
      </div>

      {/* Quick Payment Module */}
      <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden mt-4">
        <div className="absolute -top-4 -right-4 p-4 opacity-5 text-indigo-600">
          <CreditCard size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CreditCard size={14} className="text-indigo-600" />
              Quick Payment
            </h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Amount</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <DollarSign size={14} className="text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full pl-7 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Method</label>
                <select className="mt-1 w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700">
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Reference / Invoice #</label>
              <input 
                type="text" 
                placeholder="INV-..." 
                className="mt-1 w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm mt-1">
              Process Payment
            </button>
          </div>
        </div>
      </div>

      {/* Visual Stock Allocation Graph Mini Widget */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 mb-2">Space Utilization by Warehouse</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600">Dallas Logistics Hub</span>
              <span className="font-semibold text-slate-800">82% Capacity</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600">Seattle Deep Sea Port</span>
              <span className="font-semibold text-slate-800">44% Capacity</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '44%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600">Chicago Central Depot</span>
              <span className="font-semibold text-slate-800">91% Capacity</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full animate-pulse" style={{ width: '91%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Banner & Recs */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-3.5 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-15">
            <AlertTriangle size={80} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-mono font-bold tracking-widest text-rose-100">CRITICAL DISRUPTIONS</h3>
            <p className="text-[13px] mt-1 font-semibold leading-snug">
              {lowStockItems.length} core items are below safety margins and face production blockages.
            </p>
            <button 
              onClick={() => setActiveScreen('Stock Alerts')}
              className="mt-2.5 bg-white text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition flex items-center gap-1"
            >
              Order Replenishments <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Recent Client Orders List */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Recent Sales Orders</h3>
          <button 
            onClick={() => setActiveScreen('Orders Management')}
            className="text-xs text-sky-600 font-semibold"
          >
            Expand All →
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {customerOrders.slice(0, 3).map((ord) => (
            <div 
              key={ord.id} 
              id={`recent-ord-${ord.id}`}
              onClick={() => setActiveScreen('Orders Management')}
              className="py-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1 transition"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">{ord.id}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{ord.customerName}</p>
                <p className="text-[10px] text-slate-400 font-mono">{ord.orderDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">${ord.total.toFixed(2)}</p>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  ord.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                  ord.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {ord.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Invoices Module */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Recent Invoices</h3>
          <button 
            onClick={() => setActiveScreen('Invoice Management')}
            className="text-xs text-sky-600 font-semibold"
          >
            Expand All →
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {invoices.slice(0, 3).map((inv) => (
            <div 
              key={inv.id} 
              id={`recent-inv-${inv.id}`}
              onClick={() => setActiveScreen('Invoice Management')}
              className="py-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1 transition"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">{inv.id}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{inv.clientName}</p>
                <p className="text-[10px] text-slate-400 font-mono">Due: {inv.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">${inv.amount.toFixed(2)}</p>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                  inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700' :
                  inv.status === 'Sent' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-700'
                }`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
