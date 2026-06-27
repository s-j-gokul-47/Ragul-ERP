import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
  Building,
  Hash
} from 'lucide-react';
import { Payment, PaymentStatus } from '../../types';

interface PaymentsManagementProps {
  payments: Payment[];
  setActiveScreen: (screen: string) => void;
}

export default function PaymentsManagement({
  payments,
  setActiveScreen,
}: PaymentsManagementProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'All'>('All');

  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.customerName.toLowerCase().includes(search.toLowerCase()) ||
      pay.reference.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || pay.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments
    .filter(pay => pay.status === 'Completed')
    .reduce((acc, current) => acc + current.amount, 0);

  const pendingAmount = payments
    .filter(pay => pay.status === 'Pending')
    .reduce((acc, current) => acc + current.amount, 0);

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'Pending': return <Clock size={16} className="text-amber-400" />;
      case 'Failed': return <XCircle size={16} className="text-rose-400" />;
      case 'Refunded': return <RefreshCcw size={16} className="text-indigo-400" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Failed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Refunded': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full animate-in fade-in duration-500 text-slate-100">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4 border-b border-slate-800 pb-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-400 mb-2">
            <CreditCard size={16} />
            <span className="text-xs font-mono tracking-widest font-bold uppercase">Financial Ledgers</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Payments Management</h2>
        </div>
        <button
          onClick={() => setActiveScreen('Dashboard')}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-colors shadow-lg"
        >
          <Plus size={18} /> Record Payment
        </button>
      </div>

      {/* KPI Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Total Collected</p>
            <p className="text-2xl font-bold text-white">${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Pending Validation</p>
            <p className="text-2xl font-bold text-white">${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by customer or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {(['All', 'Completed', 'Pending', 'Failed', 'Refunded'] as const).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <CreditCard size={48} className="mb-4 opacity-20" />
            <p>No payments match your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 font-mono text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Method</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPayments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-slate-500" />
                        <span className="font-mono text-slate-300">{pay.reference}</span>
                      </div>
                      {pay.invoiceId && (
                        <div className="text-xs text-slate-500 mt-1">Inv: {pay.invoiceId}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">{pay.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-slate-500" />
                        <span className="text-slate-200">{pay.customerName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{pay.method}</td>
                    <td className="p-4 text-right font-mono font-bold text-white">
                      ${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(pay.status)}`}>
                        {getStatusIcon(pay.status)}
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
