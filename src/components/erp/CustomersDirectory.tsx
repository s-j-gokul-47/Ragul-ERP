import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight,
  Phone,
  Mail,
  Building,
  Target,
  Briefcase
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomersDirectoryProps {
  customers: Customer[];
  setActiveScreen: (screen: string) => void;
  setSelectedCustomerId: (id: string) => void;
}

export default function CustomersDirectory({
  customers,
  setActiveScreen,
  setSelectedCustomerId
}: CustomersDirectoryProps) {
  const [search, setSearch] = useState('');
  
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = customers.filter(c => c.status === 'Active').length;
  const leadCount = customers.filter(c => c.status === 'Lead').length;

  return (
    <div className="relative min-h-full pb-20 bg-slate-950 font-sans text-slate-200">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl pt-5 pb-4 px-5 border-b border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Users size={22} className="text-indigo-400" /> CRM
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Client Directory</p>
          </div>
          <button 
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl shadow-lg transition flex items-center gap-1.5 font-bold text-xs px-3"
          >
            <Plus size={16} /> New Client
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Briefcase size={14} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active</p>
              <p className="text-lg font-black text-slate-200 leading-none mt-0.5">{activeCount}</p>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Target size={14} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Leads</p>
              <p className="text-lg font-black text-slate-200 leading-none mt-0.5">{leadCount}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search clients or tags..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-800 transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-6 flex flex-col gap-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div 
              key={customer.id}
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setActiveScreen('Customer Details');
              }}
              className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl hover:bg-slate-900/80 transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{customer.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Building size={10} /> {customer.company}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                  customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  customer.status === 'Lead' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {customer.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 truncate">
                  <Mail size={12} className="text-slate-500 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 truncate justify-end">
                  <Phone size={12} className="text-slate-500 shrink-0" />
                  <span className="truncate">{customer.phone}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 text-slate-600">
              <Users size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Clients Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Adjust your search or add a new client.</p>
          </div>
        )}
      </div>
    </div>
  );
}
