import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Coins, 
  Clock, 
  ChevronRight,
  BellRing
} from 'lucide-react';
import { AccountsReceivable as ReceivableRecord, ReceivableStatus } from '../../types';

interface AccountsReceivableProps {
  receivables: ReceivableRecord[];
  setReceivables: React.Dispatch<React.SetStateAction<ReceivableRecord[]>>;
  currency: string;
}

export default function AccountsReceivable({
  receivables,
  setReceivables,
  currency,
}: AccountsReceivableProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReceivableStatus | 'All'>('All');
  const [notifText, setNotifText] = useState<string | null>(null);

  const handleDispatchNotification = (customerName: string) => {
    setNotifText(`Dispatched automated ERP billing statement copy to ${customerName} accounting!`);
    setTimeout(() => {
      setNotifText(null);
    }, 3000);
  };

  const handleCollectSettlement = (invoiceId: string) => {
    setReceivables(prev => prev.map(rec => {
      if (rec.id === invoiceId) {
        return {
          ...rec,
          amountPaid: rec.amount,
          status: 'Paid'
        };
      }
      return rec;
    }));
    setNotifText(`Recorded total invoices cash remittance check for invoice ${invoiceId}!`);
    setTimeout(() => {
      setNotifText(null);
    }, 3000);
  };

  const filteredInvoices = receivables.filter(rec => {
    const matchesSearch = rec.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          rec.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">SALES REVENUE AGING</span>
          <h2 className="text-sm font-bold text-slate-800">Accounts Receivable</h2>
        </div>
      </div>

      {/* Temp visual action notifications */}
      {notifText && (
        <div id="ar-operation-toast" className="bg-sky-50 text-sky-800 border-l-4 border-sky-600 p-2 text-[11px] rounded transition">
          <p className="font-semibold flex items-center gap-1">
            <BellRing size={12} className="text-sky-600 animate-bounce" /> {notifText}
          </p>
        </div>
      )}

      {/* Filter Options */}
      <div className="space-y-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search invoice number or buyer..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500 transition outline-none"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['All', 'Open', 'Overdue', 'Paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`flex-1 text-center py-1 rounded text-[10px] sm:text-xs font-semibold transition ${
                selectedStatus === st 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices listings */}
      <div className="space-y-3">
        {filteredInvoices.map((rec) => {
          const outstandingBal = rec.amount - rec.amountPaid;
          return (
            <div 
              key={rec.id}
              id={`receivable-invoice-${rec.id}`}
              className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono text-slate-800">{rec.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      rec.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                      rec.status === 'Overdue' ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700 font-bold'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 lines-clamp-1">{rec.customerName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">DUE: {rec.dueDate}</span>
                </div>
              </div>

              {/* Progress visual indicators */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-650">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Invoiced Total</span>
                  <p className="font-bold text-slate-750 font-mono">
                    {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
                    {rec.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Outstanding Balance</span>
                  <p className={`font-mono font-bold ${outstandingBal > 0 ? 'text-slate-800' : 'text-emerald-600'}`}>
                    {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
                    {outstandingBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Action layout elements */}
              <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-50">
                <span className="text-slate-400 font-mono flex items-center gap-0.5"><Clock size={10} /> {rec.termDays} Days Terms net</span>
                
                <div className="flex gap-1.5">
                  {rec.status !== 'Paid' && (
                    <>
                      <button 
                        onClick={() => handleCollectSettlement(rec.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[9px] shadow-sm flex items-center gap-0.5"
                      >
                        <Coins size={10} /> Record Cash
                      </button>
                      
                      <button 
                        onClick={() => handleDispatchNotification(rec.customerName)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded text-[9px] flex items-center gap-0.5"
                      >
                        <Send size={10} /> Alert Dunning
                      </button>
                    </>
                  )}
                  {rec.status === 'Paid' && (
                    <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <CheckCircle size={10} /> Fully Recieved
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
