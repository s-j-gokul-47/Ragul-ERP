export type OrderStatus = 'Pending' | 'Shipped' | 'Paid' | 'Cancelled';
export type POStatus = 'Draft' | 'Sent' | 'Received' | 'Partially Received';
export type AdjustmentType = 'Wastage' | 'Audit' | 'Damage' | 'Re-count' | 'Location Move';
export type ExpenseCategory = 'Freight' | 'Logistics' | 'Wastage' | 'Packaging' | 'Rent' | 'Miscellaneous';
export type ReceivableStatus = 'Paid' | 'Overdue' | 'Open';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  minQty: number; // For low stock alerts
  price: number; // Selling price
  cost: number;  // Purchase cost
  unit: string;
  warehouseId: string;
  supplierId: string;
  serialTracked: boolean;
  zone: string;
  shelf: string;
  description: string;
  tags: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  manager: string;
  capacityPercent: number;
  activeAlerts: number;
  zoneLayout: string; // e.g., "Aisle A1 to C4"
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  items: Array<{
    itemId: string;
    itemName: string;
    qty: number;
    price: number;
  }>;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: POStatus;
  items: Array<{
    sku: string;
    itemName: string;
    qty: number;
    cost: number;
  }>;
  total: number;
  billingTerms: string;
  approvedBy?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number; // 1 to 5 stars
  deliveryDays: number;
  activePOs: number;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  itemName: string;
  date: string;
  qtyAdjusted: number; // negative for wastage, positive for additions
  type: AdjustmentType;
  reason: string;
  doneBy: string;
  fromLocation?: string;
  toLocation?: string;
}

export interface Expense {
  id: string;
  date: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  status: 'Completed' | 'Pending';
  loggedBy: string;
  receiptMock?: boolean;
}

export interface AccountsReceivable {
  id: string;
  customerName: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: ReceivableStatus;
  termDays: number;
}
