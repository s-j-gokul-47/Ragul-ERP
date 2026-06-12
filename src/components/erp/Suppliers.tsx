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
  X
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
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">VENDOR NETWORK</span>
          <h2 className="text-sm font-bold text-slate-800">Suppliers Directory ({filteredSuppliers.length})</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> New Vendor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search suppliers by name or manager..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500 transition outline-none"
        />
        <div className="absolute left-3 top-2.5 text-slate-400">
          <Search size={14} />
        </div>
      </div>

      {/* Suppliers grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredSuppliers.map((sup) => (
          <div 
            key={sup.id}
            id={`supplier-card-${sup.id}`}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono font-bold tracking-wider mb-1 block w-max">
                  {sup.id.toUpperCase()}
                </span>
                <h3 className="text-xs font-bold text-slate-800">{sup.name}</h3>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                <Star size={12} fill="currentColor" /> {sup.rating}
              </div>
            </div>

            {/* Middle body metadata */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-b border-slate-50 py-2.5">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-mono block">VEND-CONTACT</span>
                <p className="font-semibold text-slate-700 flex items-center gap-1"><User size={10} className="text-sky-500" /> {sup.contactPerson}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-mono block">DELIVERY LAG</span>
                <p className="font-semibold text-slate-700 flex items-center gap-1"><Clock size={10} className="text-sky-500" /> {sup.deliveryDays} Day Lead</p>
              </div>
            </div>

            {/* Footer action detail */}
            <div className="flex justify-between items-center pt-0.5 text-[11px] text-slate-500">
              <span className="font-mono bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded font-bold">
                {sup.activePOs} active PO orders
              </span>
              <div className="flex gap-2">
                <a href={`mailto:${sup.email}`} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-sky-600 transition">
                  <Mail size={14} />
                </a>
                <a href={`tel:${sup.phone}`} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-sky-600 transition">
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Register a Supplier */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="text-sky-600" size={16} /> Register Corporate Supplier
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-semibold block">Supplier Company Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Semiconductors Inc." 
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Primary Account Manager Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jane Doe" 
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Secure Email</label>
                  <input 
                    type="email" 
                    placeholder="manager@acme.com" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Business Phone</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 700-1122" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Quality Rating (1 to 5)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    step="0.1"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Avg Delivery Lead Time (Days)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="90" 
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="submit-register-supplier"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-sm text-center"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
