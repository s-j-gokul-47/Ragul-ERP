import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ReportsDashboard from './ReportsDashboard';
import { 
  DEFAULT_CUSTOMER_ORDERS,
  DEFAULT_EXPENSES,
  DEFAULT_ITEMS,
  DEFAULT_RECEIVABLES,
  DEFAULT_PURCHASE_ORDERS,
  DEFAULT_INVOICES
} from '../../data';

let root: Root | null = null;

function ReportApp() {
  const [customerOrders] = useState(DEFAULT_CUSTOMER_ORDERS);
  const [expenses] = useState(DEFAULT_EXPENSES);
  const [items] = useState(DEFAULT_ITEMS);
  const [receivables] = useState(DEFAULT_RECEIVABLES);
  const [purchaseOrders] = useState(DEFAULT_PURCHASE_ORDERS);
  const [invoices] = useState(DEFAULT_INVOICES);
  const [activeScreen, setActiveScreen] = useState('Reports Dashboard');

  // Assuming a default currency here; could be fetched from local storage if available
  const currency = 'USD'; 

  return (
    <div className="react-report-container bg-slate-950 text-slate-100 min-h-full flex flex-col font-sans w-full overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white pt-4 pb-2 px-6 flex justify-between items-center text-[10px] font-mono font-bold z-40 border-b border-slate-800">
        <h1 className="text-lg font-extrabold tracking-tight">Reports & Analytics</h1>
      </div>

      <div className="flex-1 bg-slate-950 text-slate-900 overflow-y-auto relative font-sans scrollbar-none">
        {activeScreen === 'Reports Dashboard' && (
          <ReportsDashboard
            customerOrders={customerOrders}
            expenses={expenses}
            items={items}
            receivables={receivables}
            purchaseOrders={purchaseOrders}
            invoices={invoices}
            currency={currency}
            setActiveScreen={setActiveScreen}
          />
        )}
      </div>
    </div>
  );
}

export function mountReactReport(containerId: string) {
  const container = document.getElementById(containerId);
  if (container) {
    if (!root) {
      root = createRoot(container);
    }
    root.render(<ReportApp />);
  }
}

export function unmountReactReport() {
  if (root) {
    root.unmount();
    root = null;
  }
}
