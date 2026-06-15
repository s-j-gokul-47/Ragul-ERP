import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Coins, 
  Check, 
  ChevronRight, 
  Truck, 
  FileText,
  X
} from 'lucide-react';
import { CustomerOrder, InventoryItem, OrderStatus } from '../../types';

interface OrdersManagementProps {
  customerOrders: CustomerOrder[];
  setCustomerOrders: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setActiveScreen: (screen: string) => void;
}

export default function OrdersManagement({
  customerOrders,
  setCustomerOrders,
  items,
  setItems,
  setActiveScreen,
}: OrdersManagementProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for creating custom order
  const [custName, setCustName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [selectedQty, setSelectedQty] = useState(1);

  // Status transition handler
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setCustomerOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        // If transitioning to shipped, decrement inventory
        if (newStatus === 'Shipped' && ord.status !== 'Shipped' && ord.status !== 'Paid') {
          // Decrement stock levels for order items
          setItems(currentItems => currentItems.map(item => {
            const orderLine = ord.items.find(oli => oli.itemId === item.id);
            if (orderLine) {
              return { ...item, qty: Math.max(0, item.qty - orderLine.qty) };
            }
            return item;
          }));
        }
        return { ...ord, status: newStatus };
      }
      return ord;
    }));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !selectedItemId) return;

    const itemObj = items.find(i => i.id === selectedItemId);
    if (!itemObj) return;

    const lineTotal = itemObj.price * selectedQty;
    const newOrder: CustomerOrder = {
      id: `ORD-2026-${String(customerOrders.length + 5).padStart(3, '0')}`,
      customerName: custName,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: [
        {
          itemId: selectedItemId,
          itemName: itemObj.name,
          qty: selectedQty,
          price: itemObj.price
        }
      ],
      total: lineTotal
    };

    setCustomerOrders(prev => [newOrder, ...prev]);

    // Cleanup and exit
    setCustName('');
    setSelectedQty(1);
    setShowCreateModal(false);
  };

  const filteredOrders = customerOrders.filter(ord => {
    const matchesSearch = ord.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          ord.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || ord.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">SALES CHANNEL</span>
          <h2 className="text-sm font-bold text-slate-800">Orders Management</h2>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          <Plus size={14} /> Sales Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search customer orders, invoices..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500 transition outline-none"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['All', 'Pending', 'Shipped', 'Paid'] as const).map((st) => (
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

      {/* Orders List container */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((ord) => (
            <div 
              key={ord.id} 
              id={`or-list-card-${ord.id}`}
              className="bg-white rounded-xl border border-slate-100 shadow-xs p-3.5 space-y-3"
            >
              <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono text-slate-800">{ord.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ord.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                      ord.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' : 
                      ord.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1">
                    <Calendar size={10} /> {ord.orderDate}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Order Subtotal</p>
                  <p className="text-xs font-bold text-slate-800">${ord.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Items associated */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Ordered Lines</span>
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-0.5">
                    <div className="flex-1 pr-4">
                      <p className="font-semibold text-slate-700 leading-tight">{it.itemName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{it.qty} Qty x ${it.price.toFixed(2)}</p>
                    </div>
                    <span className="font-semibold text-slate-700">${(it.qty * it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons based on current state */}
              <div className="flex gap-2 pt-2 border-t border-slate-50 justify-between items-center text-xs">
                <div className="text-[10px] text-slate-500">
                  Customer: <span className="font-bold text-slate-700">{ord.customerName}</span>
                </div>
                <div className="flex gap-1">
                  {ord.status === 'Pending' && (
                    <button 
                      onClick={() => handleUpdateStatus(ord.id, 'Shipped')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] py-1 px-2.5 rounded flex items-center gap-1 transition"
                    >
                      <Truck size={12} /> Dispatch Stock
                    </button>
                  )}
                  {ord.status === 'Shipped' && (
                    <button 
                      onClick={() => handleUpdateStatus(ord.id, 'Paid')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] py-1 px-2.5 rounded flex items-center gap-1 transition"
                    >
                      <Check size={12} /> Record Settlement
                    </button>
                  )}
                  {ord.status === 'Paid' && (
                    <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                      <Check size={12} /> Completely Paid
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <ShoppingCart size={30} className="mx-auto text-slate-300" />
            <p className="text-xs font-medium">No sales matches this status.</p>
          </div>
        )}
      </div>

      {/* Modal to place a Sales Request */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ShoppingCart className="text-sky-600" size={16} /> Record Customer Order
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-semibold block">Customer Corporate Client Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lockheed-Martinson" 
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Select Inventory Component *</label>
                <select 
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                >
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} (${item.price.toFixed(2)} - {item.qty} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Dispense Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg outline-none"
                />
              </div>

              {/* Estimate valuation */}
              {(() => {
                const sel = items.find(i => i.id === selectedItemId);
                if (!sel) return null;
                const totalEs = sel.price * selectedQty;
                return (
                  <div className="bg-sky-50 p-3 rounded-lg flex justify-between items-center border border-sky-100">
                    <span className="font-medium text-sky-800">Sales Value Estimate</span>
                    <span className="font-bold text-sky-900">${totalEs.toFixed(2)}</span>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="submit-customer-order"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-sm text-center"
                >
                  Generate Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
