import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PaymentsManagement from './PaymentsManagement';
import { DEFAULT_PAYMENTS } from '../../data';

let root: Root | null = null;

function PaymentApp() {
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [activeScreen, setActiveScreen] = useState('Payments Management');

  return (
    <div className="react-payment-container bg-slate-950 text-slate-100 min-h-full flex flex-col font-sans w-full overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white pt-4 pb-2 px-6 flex justify-between items-center text-[10px] font-mono font-bold z-40 border-b border-slate-800">
        <h1 className="text-lg font-extrabold tracking-tight">Payments Ops</h1>
      </div>

      <div className="flex-1 bg-slate-950 text-slate-900 overflow-y-auto relative font-sans scrollbar-none">
        {activeScreen === 'Payments Management' && (
          <PaymentsManagement
            payments={payments}
            setActiveScreen={setActiveScreen}
          />
        )}
      </div>
    </div>
  );
}

export function mountReactPayment(containerId: string) {
  const container = document.getElementById(containerId);
  if (container) {
    if (!root) {
      root = createRoot(container);
    }
    root.render(<PaymentApp />);
  }
}

export function unmountReactPayment() {
  if (root) {
    root.unmount();
    root = null;
  }
}
