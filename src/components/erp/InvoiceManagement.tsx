import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  ChevronRight,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  X
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '../../types';

interface InvoiceManagementProps {
  invoices: Invoice[];
  setSelectedInvoiceId: (id: string) => void;
  setActiveScreen: (screen: string) => void;
}

export default function InvoiceManagement({
  invoices,
  setSelectedInvoiceId,
  setActiveScreen,
}: InvoiceManagementProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'All'>('All');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOutstanding = invoices
    .filter(inv => inv.status === 'Sent' || inv.status === 'Overdue')
    .reduce((acc, current) => acc + current.amount, 0);

  return (
    <div className="flex flex-col gap-6 p-6 w-full animate-in fade-in duration-500 text-slate-100">

      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4 border-b border-slate-800 pb-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-mono tracking-widest font-bold uppercase">Revenue Management</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Invoices</h2>
        </div>
        <button
          onClick={() => setActiveScreen('New Invoice')}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-colors shadow-lg"
        >
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      {/* KPI Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Total Outstanding</p>
            <p className="text-2xl font-bold text-white">${totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Paid this month</p>
            <p className="text-2xl font-bold text-white">
              ${invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Overdue Amount</p>
            <p className="text-2xl font-bold text-white">
              ${invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="         Search invoice ID or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-7 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none items-center">
          {(['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedStatus === st
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((inv) => {
            const statusColorStyle = {
              'Paid': 'bg-emerald-500/10 text-emerald-400',
              'Overdue': 'bg-rose-500/10 text-rose-400',
              'Sent': 'bg-indigo-500/10 text-indigo-400',
              'Draft': 'bg-slate-800 text-slate-400',
              'Cancelled': 'bg-slate-900 text-slate-500',
              'All': ''
            }[inv.status];

            const statusBadgeStyle = {
              'Paid': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              'Overdue': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
              'Sent': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
              'Draft': 'bg-slate-800 text-slate-400 border-slate-700',
              'Cancelled': 'bg-slate-900 text-slate-500 border-slate-800 line-through',
              'All': ''
            }[inv.status];

            const isExpanded = expandedInvoiceId === inv.id;

            return (
              <div
                key={inv.id}
                onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                className={`bg-slate-900 border border-slate-800 rounded-none hover:bg-slate-800 transition-all duration-300 cursor-pointer group shadow-md relative overflow-hidden ${isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3 p-6 sm:p-8 ring-1 ring-indigo-500 shadow-xl' : 'flex items-center justify-center min-h-[140px] text-center p-8 hover:-translate-y-1 hover:shadow-xl'
                  }`}
              >
                <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300"></div>

                {!isExpanded ? (
                  <div className="flex flex-col items-center justify-center w-full relative z-10">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">{inv.id}</span>
                    <h3 className="text-2xl font-extrabold text-slate-200 leading-tight group-hover:text-indigo-400 transition-colors px-4 text-center mb-3">
                      {inv.clientName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${statusColorStyle.replace('text', 'text').replace('bg', 'bg').concat(' border-opacity-20')}`}>
                        {inv.status}
                      </span>
                      <span className="text-sm font-bold text-slate-300">
                        ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 w-full animate-in fade-in duration-300 cursor-default" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedInvoiceId(null); }}
                      className="absolute top-0 right-0 text-slate-500 hover:text-white transition-colors p-2"
                    >
                      <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-6 mb-6 pt-2 pr-8">
                      <div>
                        <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold block mb-1">Client Name</span>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{inv.clientName}</h3>
                        <div className="flex gap-3 mt-4 items-center">
                          <span className={`px-3 py-1 text-xs font-bold rounded-md border ${statusColorStyle.replace('text', 'text').replace('bg', 'bg').concat(' border-opacity-20')}`}>
                            {inv.status}
                          </span>
                          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                            {inv.id}
                          </span>
                        </div>
                      </div>

                      <div className="text-left md:text-right bg-slate-950/50 p-4 rounded-none border border-slate-800/50 w-full md:w-auto">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1 font-bold">Total Amount</span>
                        <p className="text-3xl font-extrabold text-indigo-400 tracking-tight">
                          ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center justify-start md:justify-end gap-1.5 mt-2 font-mono">
                          <Calendar size={14} className="text-slate-500" /> Due: {inv.dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-none overflow-hidden shadow-inner">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase font-mono border-b border-slate-800">
                            <tr>
                              <th className="px-6 py-4 font-bold tracking-wider">Description</th>
                              <th className="px-6 py-4 font-bold tracking-wider text-center">Qty</th>
                              <th className="px-6 py-4 font-bold tracking-wider text-right">Unit Price</th>
                              <th className="px-6 py-4 font-bold tracking-wider text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {inv.items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 text-slate-200 font-medium">{item.description}</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-400 bg-slate-900/10">{item.qty}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-400">
                                  ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-white bg-slate-900/10">
                                  ${(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <div className="p-4 bg-slate-950 rounded-full">
              <FileText size={32} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">No Invoices Found</h3>
            <p className="text-sm">We couldn't find any invoices matching your current search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
