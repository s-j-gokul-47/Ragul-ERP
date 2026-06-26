import React from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Building, 
  Tag, 
  Briefcase, 
  FileText, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Customer, CustomerOrder, Invoice } from '../../types';

interface CustomerDetailsProps {
  selectedCustomerId: string | null;
  customers: Customer[];
  customerOrders: CustomerOrder[];
  invoices: Invoice[];
  setActiveScreen: (screen: string) => void;
  setSelectedInvoiceId: (id: string) => void;
}

export default function CustomerDetails({
  selectedCustomerId,
  customers,
  customerOrders,
  invoices,
  setActiveScreen,
  setSelectedInvoiceId
}: CustomerDetailsProps) {
  const customer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  if (!customer) return null;

  // Aggregate data for this customer
  const relatedOrders = customerOrders.filter(o => o.customerName === customer.name);
  const relatedInvoices = invoices.filter(i => i.clientName === customer.name);
  
  const pendingOrders = relatedOrders.filter(o => o.status === 'Pending').length;
  const overdueInvoices = relatedInvoices.filter(i => i.status === 'Overdue').length;

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-right-8 duration-500 fade-in">
      {/* Screen Header */}
      <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl p-4 border-b border-slate-800 shadow-sm sticky top-0 z-20">
        <button 
          onClick={() => setActiveScreen('Customers Directory')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-300 hover:-translate-x-1 border border-slate-700"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest flex items-center gap-1.5 mb-0.5">
            <Briefcase size={12} /> CLIENT PROFILE
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">{customer.name}</h2>
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
              customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
              customer.status === 'Lead' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {customer.status}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Core Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-2xl shrink-0">
                {customer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <Building size={14} className="text-slate-500" /> {customer.company}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Mail size={12} /> {customer.email}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Phone size={12} /> {customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold tracking-widest block uppercase mb-1">Lifetime Value</span>
                <p className="text-lg font-black text-emerald-400">${customer.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold tracking-widest block uppercase mb-1">Last Contact</span>
                <p className="text-sm font-bold text-slate-300 flex items-center gap-1.5 mt-1">
                  <Calendar size={14} className="text-indigo-400" /> {customer.lastContactDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags & Notes */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Tag size={12} /> Categorization
            </span>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag, i) => (
                <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Account Notes</span>
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
              "{customer.notes}"
            </p>
          </div>
        </div>

        {/* Sales & Billing History */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
            <DollarSign size={12} /> Transaction History
          </h4>

          {/* Mini KPI row for transactions */}
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] text-slate-500 font-bold mb-1">Total Orders</span>
              <span className="text-xl font-black text-slate-200">{relatedOrders.length}</span>
            </div>
            <div className={`flex-1 border rounded-xl p-3 flex flex-col justify-center items-center text-center ${pendingOrders > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-[10px] text-slate-500 font-bold mb-1">Pending Orders</span>
              <span className={`text-xl font-black ${pendingOrders > 0 ? 'text-amber-500' : 'text-slate-200'}`}>{pendingOrders}</span>
            </div>
            <div className={`flex-1 border rounded-xl p-3 flex flex-col justify-center items-center text-center ${overdueInvoices > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-[10px] text-slate-500 font-bold mb-1">Overdue Invs</span>
              <span className={`text-xl font-black ${overdueInvoices > 0 ? 'text-rose-500' : 'text-slate-200'}`}>{overdueInvoices}</span>
            </div>
          </div>

          {/* Recent Invoices List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-400" /> Recent Invoices
              </h5>
              <button 
                onClick={() => setActiveScreen('Invoice Management')}
                className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 transition"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-2">
              {relatedInvoices.length > 0 ? (
                relatedInvoices.map(invoice => (
                  <div 
                    key={invoice.id} 
                    onClick={() => {
                      setSelectedInvoiceId(invoice.id);
                      setActiveScreen('Invoice Management');
                    }}
                    className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition"
                  >
                    <div>
                      <p className="text-[11px] font-bold text-slate-200">{invoice.id}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{invoice.issueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-200">${invoice.amount.toFixed(2)}</p>
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${
                        invoice.status === 'Paid' ? 'text-emerald-500' : 
                        invoice.status === 'Overdue' ? 'text-rose-500' : 
                        'text-amber-500'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs">
                  No invoices found for this client.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
