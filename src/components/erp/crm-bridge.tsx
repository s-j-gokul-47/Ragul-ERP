import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import CustomersDirectory from './CustomersDirectory';
import CustomerDetails from './CustomerDetails';
import {
  DEFAULT_CUSTOMERS,
  DEFAULT_CUSTOMER_ORDERS,
  DEFAULT_INVOICES
} from '../../data';
import { Users, UserCircle } from 'lucide-react';

let root: Root | null = null;

function CrmApp() {
  const [customers, setCustomers] = useState(DEFAULT_CUSTOMERS);
  const [customerOrders, setCustomerOrders] = useState(DEFAULT_CUSTOMER_ORDERS);
  const [invoices, setInvoices] = useState(DEFAULT_INVOICES);

  const [activeScreen, setActiveScreen] = useState('Customers Directory');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Need a dummy state handler for invoice selection so CustomerDetails doesn't break
  const setSelectedInvoiceId = (id: string) => {
    console.log("Navigating to invoice: ", id);
    // Ideally this would emit an event to the main shell to switch tabs, 
    // but for now we just log it since invoice bridge handles invoices.
  };

  return (
    <div className="react-crm-container bg-slate-950 text-slate-100 min-h-full flex flex-col font-sans w-full overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white pt-4 pb-2 px-6 flex justify-between items-center text-[10px] font-mono font-bold z-40 border-b border-slate-800">
        <h1 className="text-lg font-extrabold tracking-tight">Customer Relations</h1>
      </div>

      <div className="flex-1 bg-slate-950 text-slate-900 overflow-y-auto relative font-sans scrollbar-none">
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
      </div>

      {/* Local Sub-Navigation for React Module */}
      <div className="bg-slate-900 text-white py-2 px-3 border-t border-slate-800 flex justify-around items-center z-40">
        <button
          onClick={() => setActiveScreen('Customers Directory')}
          className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Customers Directory' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white transition'
            }`}
        >
          <Users size={15} />
          <span className="text-[8px] mt-0.5">Directory</span>
        </button>

        <button
          onClick={() => {
             if (selectedCustomerId) {
                setActiveScreen('Customer Details');
             } else if (customers.length > 0) {
                setSelectedCustomerId(customers[0].id);
                setActiveScreen('Customer Details');
             }
          }}
          className={`flex flex-col items-center justify-center p-1 font-mono tracking-tighter ${activeScreen === 'Customer Details' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white transition'
            }`}
        >
          <UserCircle size={15} />
          <span className="text-[8px] mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
}

export function mountReactCrm(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!root) {
    root = createRoot(container);
  }

  root.render(<CrmApp />);
}

export function unmountReactCrm() {
  if (root) {
    root.unmount();
    root = null;
  }
}
