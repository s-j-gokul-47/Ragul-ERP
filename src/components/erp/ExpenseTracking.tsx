import React, { useState, useRef } from 'react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  Camera, 
  Trash2, 
  Calendar, 
  Check, 
  FileText, 
  AlertCircle,
  X,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';

interface ExpenseTrackingProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  currency: string;
}

export default function ExpenseTracking({
  expenses,
  setExpenses,
  currency,
}: ExpenseTrackingProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  
  // New expense fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Freight');
  const [amount, setAmount] = useState<number>(150);
  const [loggedBy, setLoggedBy2] = useState('Sarah Jenkins');
  const [attachedReceiptFilename, setAttachedReceiptFilename] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedReceiptFilename(e.target.files[0].name);
    }
  };

  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: `EXP-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toISOString().split('T')[0],
      title: title,
      category: category,
      amount: amount,
      status: 'Completed',
      loggedBy: loggedBy,
      receiptMock: !!attachedReceiptFilename
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Cleanup & close
    setTitle('');
    setAmount(100);
    setAttachedReceiptFilename(null);
    setShowAddForm(false);
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.title.toLowerCase().includes(search.toLowerCase()) || 
    exp.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">LEDGER COST MATRIX</span>
          <h2 className="text-sm font-bold text-slate-800">Expense Tracking ({filteredExpenses.length})</h2>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> Log Cost
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search logistics receipt descriptions..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500 transition outline-none"
        />
        <div className="absolute left-3 top-2.5 text-slate-400">
          <Search size={14} />
        </div>
      </div>

      {/* Expenses spreadsheet mapper */}
      <div className="space-y-3">
        {filteredExpenses.map((exp) => (
          <div 
            key={exp.id}
            id={`expense-row-${exp.id}`}
            className="p-3.5 bg-white border border-slate-100 rounded-xl shadow-xs space-y-2.5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-mono block">DATE: {exp.date}</span>
                <h3 className="text-xs font-bold text-slate-800 leading-snug">{exp.title}</h3>
              </div>
              <p className="text-sm font-extrabold text-slate-800 font-mono">
                {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
                {exp.amount.toFixed(2)}
              </p>
            </div>

            {/* Categorization & verification attachments indicators */}
            <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-50 text-slate-500">
              <span className="bg-slate-50 border border-slate-200 text-slate-600 font-sans px-2 py-0.5 rounded font-semibold text-[9px]">
                {exp.category.toUpperCase()}
              </span>

              <div className="flex items-center gap-1.5 font-sans">
                {exp.receiptMock ? (
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <FileCheck size={10} /> RECEIPT VERIFIED
                  </span>
                ) : (
                  <span className="text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <AlertCircle size={10} /> MISSING SLIP
                  </span>
                )}
                <span className="font-mono text-[9px] text-slate-400">By {exp.loggedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add expense form modal popup */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="text-sky-600" size={16} /> Log Cash-Out Disbursement
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleLogExpense} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-semibold block">Expense Description Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Customs Import Surcharge Line 4" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Expense Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                  >
                    <option value="Freight">Freight & Ocean Liner</option>
                    <option value="Logistics">Third Party Logistics (3PL)</option>
                    <option value="Packaging">Raw Pack Bins</option>
                    <option value="Wastage">Wastage / Scrap Writeoff</option>
                    <option value="Rent">Facility Ground Rent</option>
                    <option value="Miscellaneous">Miscellaneous Overhead</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block">Amount ($) *</label>
                  <input 
                    type="number" 
                    min="1" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Registered By Signature</label>
                <input 
                  type="text" 
                  value={loggedBy}
                  onChange={(e) => setLoggedBy2(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              {/* Real Drag-and-drop & Click to Upload File block */}
              <div className="space-y-1">
                <label className="font-semibold block">Receipt Capture Upload File</label>
                <div 
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl p-4 text-center cursor-pointer transition hover:bg-sky-50/20 text-slate-400 space-y-1.5"
                >
                  <Camera className="mx-auto text-slate-350" size={20} />
                  <p className="font-semibold text-[11px] text-slate-650">Drag receipt photo or click to browse</p>
                  <span className="text-[9px] text-slate-400 leading-none">Handles PNG, PDF logs up to 10MB</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                {attachedReceiptFilename && (
                  <div id="receipt-upload-notif" className="bg-sky-50 text-sky-800 p-2 font-semibold text-[10px] rounded border border-sky-100 flex items-center gap-1 mt-2 justify-between">
                    <span className="truncate">📎 Attached: {attachedReceiptFilename}</span>
                    <button type="button" onClick={() => setAttachedReceiptFilename(null)} className="text-rose-500 font-bold hover:underline">Delete</button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="submit-log-expense"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-sm text-center"
                >
                  Verify & Post Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
