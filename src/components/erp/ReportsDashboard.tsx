import React from 'react';
import { 
  BarChart, 
  PieChart, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { 
  CustomerOrder, 
  Expense, 
  InventoryItem, 
  AccountsReceivable,
  PurchaseOrder,
  Invoice
} from '../../types';

interface ReportsDashboardProps {
  customerOrders: CustomerOrder[];
  expenses: Expense[];
  items: InventoryItem[];
  receivables: AccountsReceivable[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  currency: string;
  setActiveScreen: (screen: string) => void;
}

export default function ReportsDashboard({
  customerOrders,
  expenses,
  items,
  receivables,
  purchaseOrders,
  invoices,
  currency,
  setActiveScreen
}: ReportsDashboardProps) {
  
  const getCurrencySymbol = () => {
    switch(currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'USD':
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol();

  // 1. Total Sales (Paid and Shipped Orders)
  const totalSales = customerOrders
    .filter(order => order.status === 'Paid' || order.status === 'Shipped')
    .reduce((acc, order) => acc + order.total, 0);

  // 2. Total Expenses
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  // 3. Inventory Valuation (Qty * Cost)
  const inventoryValue = items.reduce((acc, item) => acc + (item.qty * item.cost), 0);
  
  // 4. Low Stock Items count
  const lowStockCount = items.filter(i => i.qty <= i.minQty).length;

  // 5. Total Outstanding Receivables
  const outstandingInvoices = receivables
    .filter(rec => rec.status !== 'Paid')
    .reduce((acc, rec) => acc + (rec.amount - rec.amountPaid), 0);

  // 6. Total PO Value (Pending/Sent)
  const pendingPOValue = purchaseOrders
    .filter(po => po.status === 'Sent' || po.status === 'Partially Received' || po.status === 'Draft')
    .reduce((acc, po) => acc + po.total, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">REPORTS & ANALYTICS</span>
          <h2 className="text-sm font-bold text-slate-800">Reports Dashboard</h2>
        </div>
        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200 text-sky-600">
          <Activity size={16} />
        </div>
      </div>

      {/* Main KPI Widget: Profitability */}
      <div className="bg-sky-950 text-white p-4 rounded-xl border border-sky-900 space-y-3.5 relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
          <BarChart size={120} />
        </div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] text-sky-400 font-mono tracking-widest block uppercase">GROSS PROFIT MARGIN ESTIMATE</span>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">
            {symbol}{(totalSales - totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-sky-200/60 block leading-none pt-0.5">Calculated from settled sales minus logged expenses</span>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Sales Card */}
        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1 relative">
          <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
            <span>TOTAL SALES</span>
            <TrendingUp size={12} className="text-emerald-500" />
          </div>
          <p className="font-bold text-slate-800 text-base font-mono">
            {symbol}{totalSales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <button onClick={() => setActiveScreen('Orders Management')} className="text-[9px] text-sky-600 font-bold hover:underline absolute bottom-3.5 right-3.5">
            View Book
          </button>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1 relative">
          <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
            <span>TOTAL OVERHEAD</span>
            <TrendingDown size={12} className="text-rose-500" />
          </div>
          <p className="font-bold text-slate-800 text-base font-mono">
            {symbol}{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <button onClick={() => setActiveScreen('Expense Tracking')} className="text-[9px] text-sky-600 font-bold hover:underline absolute bottom-3.5 right-3.5">
            View Book
          </button>
        </div>

        {/* Inventory Value */}
        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1 relative">
          <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
            <span>STOCK VALUATION</span>
            <Package size={12} className="text-amber-500" />
          </div>
          <p className="font-bold text-slate-800 text-base font-mono">
            {symbol}{inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <button onClick={() => setActiveScreen('Inventory Management')} className="text-[9px] text-sky-600 font-bold hover:underline absolute bottom-3.5 right-3.5">
            View Catalog
          </button>
        </div>

        {/* Pending POs */}
        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-xs space-y-1 relative">
          <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
            <span>PENDING POs</span>
            <DollarSign size={12} className="text-indigo-500" />
          </div>
          <p className="font-bold text-slate-800 text-base font-mono">
            {symbol}{pendingPOValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <button onClick={() => setActiveScreen('Purchase Orders')} className="text-[9px] text-sky-600 font-bold hover:underline absolute bottom-3.5 right-3.5">
            View Pipeline
          </button>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <button 
          onClick={() => setActiveScreen('Financial Analytics')}
          className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left flex gap-2 items-center hover:bg-slate-100 transition"
        >
          <PieChart size={16} className="text-slate-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-700">Detailed Finance</p>
            <p className="text-[8px] text-slate-400">View charts & analytics</p>
          </div>
        </button>

        <button 
          onClick={() => setActiveScreen('Accounts Receivable')}
          className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left flex gap-2 items-center hover:bg-slate-100 transition"
        >
          <TrendingUp size={16} className="text-slate-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-700">Aging Ledger</p>
            <p className="text-[8px] text-slate-400">Chase outstanding</p>
          </div>
        </button>
      </div>

      {/* Alert Block */}
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex items-start gap-3 mt-2">
        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
          <AlertTriangle size={16} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">Risk Assessment</h4>
          <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
            You currently have <strong className="text-rose-600">{lowStockCount} items</strong> below minimum thresholds and <strong className="text-rose-600">{symbol}{outstandingInvoices.toLocaleString()}</strong> in outstanding accounts receivable.
          </p>
        </div>
      </div>

    </div>
  );
}
