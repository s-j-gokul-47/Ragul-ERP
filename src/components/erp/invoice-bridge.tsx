import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import InvoiceManagement from './InvoiceManagement';
import InvoiceDetails from './InvoiceDetails';
import { DEFAULT_INVOICES } from '../../data';

let root: Root | null = null;

function InvoiceApp() {
  const [invoices, setInvoices] = useState(DEFAULT_INVOICES);
  const [activeScreen, setActiveScreen] = useState('Invoice Management');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  return (
    <div className="react-invoice-container bg-slate-950 text-slate-100 min-h-full flex flex-col font-sans w-full overflow-hidden">
      <div className="flex-1 bg-slate-950 text-slate-900 overflow-y-auto relative font-sans scrollbar-none">
        {activeScreen === 'Invoice Management' && (
          <InvoiceManagement
            invoices={invoices}
            setSelectedInvoiceId={setSelectedInvoiceId}
            setActiveScreen={setActiveScreen}
          />
        )}
        {/* Placeholder for Invoice Details */}
        {activeScreen === 'Invoice Details' && (
          <InvoiceDetails 
            invoice={invoices.find(i => i.id === selectedInvoiceId) || null} 
            onBack={() => setActiveScreen('Invoice Management')} 
          />
        )}
        {activeScreen === 'New Invoice' && (
          <div className="p-8 text-center text-slate-400">
            <h2 className="text-2xl font-bold text-white mb-2">New Invoice</h2>
            <p>Invoice creation is under development.</p>
            <button 
              onClick={() => setActiveScreen('Invoice Management')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Back to Invoices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function mountReactInvoice(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!root) {
    root = createRoot(container);
  }

  root.render(<InvoiceApp />);
}

export function unmountReactInvoice() {
  if (root) {
    root.unmount();
    root = null;
  }
}
