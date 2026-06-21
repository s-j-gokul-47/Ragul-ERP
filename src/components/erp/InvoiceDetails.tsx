import React from 'react';
import { Invoice } from '../../types';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onBack: () => void;
}

export default function InvoiceDetails({ invoice, onBack }: InvoiceDetailsProps) {
  if (!invoice) return null;

  const statusColorStyle = {
    'Paid': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Overdue': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Sent': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Draft': 'bg-slate-800 text-slate-400 border-slate-700',
    'Cancelled': 'bg-slate-900 text-slate-500 border-slate-800 line-through',
  }[invoice.status] || '';

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500 text-slate-100">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors w-fit font-semibold"
      >
        <ArrowLeft size={18} /> Back to Invoices
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform translate-x-1/4 -translate-y-1/4">
          <FileText size={300} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b border-slate-800 pb-10">
          <div className="flex-1">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold block mb-2">Client Details</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">{invoice.clientName}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <span className={`px-4 py-1.5 text-xs font-bold rounded-lg border inline-block ${statusColorStyle}`}>
                {invoice.status}
              </span>
              <span className="text-sm font-mono text-slate-400 uppercase tracking-wider bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                {invoice.id}
              </span>
            </div>
          </div>
          
          <div className="text-left md:text-right bg-slate-950 p-6 rounded-2xl border border-slate-800 min-w-[250px]">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Total Amount</span>
            <p className="text-4xl font-extrabold text-white tracking-tight text-indigo-400">
              ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="h-px w-full bg-slate-800 my-4"></div>
            <p className="text-xs font-mono text-slate-400 flex items-center justify-start md:justify-end gap-2 uppercase tracking-wider">
              <Calendar size={14} className="text-slate-500" /> Due: <span className="font-bold text-slate-300">{invoice.dueDate}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-3">
            <FileText size={20} className="text-indigo-400" /> Particulars
          </h3>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-5 font-bold tracking-wider">Description</th>
                    <th className="px-6 py-5 font-bold tracking-wider text-center">Qty</th>
                    <th className="px-6 py-5 font-bold tracking-wider text-right">Unit Price</th>
                    <th className="px-6 py-5 font-bold tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-5 text-slate-200 font-semibold">{item.description}</td>
                      <td className="px-6 py-5 text-center font-mono text-slate-400 font-medium bg-slate-900/20">{item.qty}</td>
                      <td className="px-6 py-5 text-right font-mono text-slate-400">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-white bg-slate-900/20">
                        ${(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
