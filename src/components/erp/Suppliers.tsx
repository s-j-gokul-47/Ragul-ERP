import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  User, 
  Star, 
  Compass, 
  Clock,
  X,
  Briefcase,
  Building
} from 'lucide-react';
import { Supplier } from '../../types';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

export default function Suppliers({
  suppliers,
  setSuppliers,
}: SuppliersProps) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newSupName, setNewSupName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newLeadTime, setNewLeadTime] = useState(7);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newContact) return;

    const newSup: Supplier = {
      id: `sup-${Date.now().toString().slice(-3)}`,
      name: newSupName,
      contactPerson: newContact,
      email: newEmail || 'info@enterprisevendor.com',
      phone: newPhone || '+1 (555) 000-0000',
      rating: newRating,
      deliveryDays: newLeadTime,
      activePOs: 0
    };

    setSuppliers(prev => [...prev, newSup]);

    // Resets
    setNewSupName('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
    setNewRating(5);
    setNewLeadTime(7);
    setShowAddModal(false);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Screen Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 rounded-2xl shadow-lg border border-emerald-900/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest font-bold flex items-center gap-2 mb-1.5">
            <Briefcase size={12} /> VENDOR NETWORK
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Suppliers Directory
            <span className="bg-emerald-500/20 text-emerald-200 text-xs py-1 px-3 rounded-full backdrop-blur-md border border-emerald-400/30 font-mono">
              {filteredSuppliers.length} Partners
            </span>
          </h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
        >
          <Plus size={16} className="transition-transform group-hover/btn:rotate-90" /> Register Vendor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/60 backdrop-blur-xl p-3 rounded-2xl border border-white/50 shadow-sm relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search suppliers by name or manager..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/80 border border-slate-200/60 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-medium"
        />
        {search && (
          <button 
            onClick={() => setSearch('')} 
            className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suppliers grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((sup, idx) => (
            <div 
              key={sup.id}
              id={`supplier-card-${sup.id}`}
              className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Subtle accent glow */}
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Top row */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:bg-emerald-50 transition-colors">
                    <Building size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md text-slate-500 font-mono font-bold tracking-widest mb-1 block w-max">
                      {sup.id.toUpperCase()}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{sup.name}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold border border-amber-100 shadow-sm">
                  <Star size={12} fill="currentColor" /> {sup.rating.toFixed(1)}
                </div>
              </div>

              {/* Middle body metadata */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Account Manager</span>
                  <p className="font-bold text-slate-700 flex items-center gap-1.5"><User size={12} className="text-emerald-500" /> <span className="truncate">{sup.contactPerson}</span></p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Delivery Lead</span>
                  <p className="font-bold text-slate-700 flex items-center gap-1.5"><Clock size={12} className="text-emerald-500" /> {sup.deliveryDays} Days</p>
                </div>
              </div>

              {/* Footer action detail */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-mono bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5">
                  <Truck size={14} /> {sup.activePOs} Active POs
                </span>
                <div className="flex gap-2">
                  <a href={`mailto:${sup.email}`} className="p-2 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl text-slate-500 hover:text-emerald-600 shadow-sm hover:shadow transition-all group/icon">
                    <Mail size={16} className="group-hover/icon:scale-110 transition-transform" />
                  </a>
                  <a href={`tel:${sup.phone}`} className="p-2 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl text-slate-500 hover:text-emerald-600 shadow-sm hover:shadow transition-all group/icon">
                    <Phone size={16} className="group-hover/icon:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Building size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Vendors Found</h3>
            <p className="text-sm">We couldn't find any suppliers matching your search query.</p>
            <button 
              onClick={() => setSearch('')}
              className="mt-4 bg-white border border-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Modal to Register a Supplier */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Truck size={18} />
                </div>
                Register Corporate Supplier
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="sup-form" onSubmit={handleCreateSupplier} className="space-y-5 text-sm text-slate-700">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Supplier Company Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acme Semiconductors Inc." 
                    value={newSupName}
                    onChange={(e) => setNewSupName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Primary Account Manager Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jane Doe" 
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">Secure Email</label>
                    <input 
                      type="email" 
                      placeholder="manager@acme.com" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">Business Phone</label>
                    <input 
                      type="text" 
                      placeholder="+1 (555) 700-1122" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">Quality Rating (1.0 to 5.0)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.1"
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">Avg Delivery Lead Time</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1" 
                        max="90" 
                        value={newLeadTime}
                        onChange={(e) => setNewLeadTime(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 py-3 pl-3 pr-16 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                      />
                      <span className="absolute right-4 top-3.5 text-slate-400 font-bold text-xs uppercase">Days</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="sup-form"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
                >
                  Register Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
