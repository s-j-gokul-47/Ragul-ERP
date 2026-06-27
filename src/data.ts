import { 
  InventoryItem, 
  Warehouse, 
  CustomerOrder, 
  PurchaseOrder, 
  Supplier, 
  StockAdjustment, 
  Expense, 
  AccountsReceivable,
  BillOfMaterial,
  ManufacturingOrder,
  Payment
} from './types';

export const DEFAULT_WAREHOUSES: Warehouse[] = [
  { id: 'wh-1', name: 'Dallas Logistics Hub', code: 'WH-DAL-01', manager: 'Sarah Jenkins', capacityPercent: 82, activeAlerts: 3, zoneLayout: 'Aisles A1-F24' },
  { id: 'wh-2', name: 'Seattle Deep Sea Port', code: 'WH-SEA-02', manager: 'Kenji Sato', capacityPercent: 44, activeAlerts: 1, zoneLayout: 'Cold Storage Z1-Z4' },
  { id: 'wh-3', name: 'Chicago Central Depot', code: 'WH-CHI-03', manager: 'Marcus Miller', capacityPercent: 91, activeAlerts: 4, zoneLayout: 'Aisles X1-Z8' }
];

export const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Silicon Core Tech', contactPerson: 'Angela Voight', email: 'orders@siliconcore.io', phone: '+1 (555) 124-9122', rating: 4.8, deliveryDays: 5, activePOs: 2 },
  { id: 'sup-2', name: 'Vulcan Metal Alloy', contactPerson: 'Niels Borr', email: 'nb@vulcanalloys.com', phone: '+1 (555) 782-3541', rating: 4.2, deliveryDays: 12, activePOs: 1 },
  { id: 'sup-3', name: 'Apex Optics Ltd', contactPerson: 'Hiroshi Tanaka', email: 'supply@apexoptics.jp', phone: '+81 (3) 555-0199', rating: 4.9, deliveryDays: 8, activePOs: 0 },
  { id: 'sup-4', name: 'Interstate Freight Corp', contactPerson: 'Gary Styles', email: 'gstyles@interstate.com', phone: '+1 (800) 555-1440', rating: 3.9, deliveryDays: 3, activePOs: 1 }
];

export const DEFAULT_ITEMS: InventoryItem[] = [
  {
    id: 'item-1',
    sku: 'CPU-INT-I7-12',
    name: 'Intel Core i7-12700K Processor',
    category: 'Processors',
    qty: 124,
    reservedQty: 10,
    minQty: 150, // Low stock!
    price: 389.00,
    cost: 290.00,
    unit: 'Units',
    warehouseId: 'wh-1',
    supplierId: 'sup-1',
    serialTracked: true,
    zone: 'Zone A',
    shelf: 'Ais-4 / Row-B',
    description: '12th Gen Intel Core i7 desktop processor with golden sample wafer sorting, unlocked for overclocking.',
    tags: ['Core Components', 'Hot Seller', 'High Cost'],
    procureOnDemand: true,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  },
  {
    id: 'item-2',
    sku: 'GPU-RTX-4070-O8',
    name: 'NVIDIA GeForce RTX 4070 Dual OC',
    category: 'Graphics Cards',
    qty: 45,
    reservedQty: 5,
    minQty: 50, // Low stock!
    price: 599.00,
    cost: 440.00,
    unit: 'Units',
    warehouseId: 'wh-1',
    supplierId: 'sup-1',
    serialTracked: true,
    zone: 'Zone A',
    shelf: 'Ais-2 / Row-D',
    description: 'NVIDIA Ada Lovelace chip architecture, DLSS 3 frame generation, dual-axial high durability fans.',
    tags: ['Core Components', 'Limited Allocation'],
    procureOnDemand: true,
    procurementType: 'Purchase',
    procurementStrategy: 'MTO'
  },
  {
    id: 'item-3',
    sku: 'RAM-COR-D5-32',
    name: 'Corsair Vengeance 32GB DDR5 (2x16)',
    category: 'Memory',
    qty: 310,
    reservedQty: 0,
    minQty: 100, // Healthy
    price: 129.00,
    cost: 88.00,
    unit: 'Kits',
    warehouseId: 'wh-3',
    supplierId: 'sup-1',
    serialTracked: false,
    zone: 'Zone B',
    shelf: 'Ais-12 / Row-C',
    description: 'Vengeance performance heatspreader DDR5 modules designed for extreme speeds with thermal headroom monitoring.',
    tags: ['Consumable Accessories', 'High Margin'],
    procureOnDemand: false,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  },
  {
    id: 'item-4',
    sku: 'SSD-SAM-980P-1T',
    name: 'Samsung 980 Pro 1TB M.2 NVMe SSD',
    category: 'Storage',
    qty: 240,
    reservedQty: 0,
    minQty: 200, // Healthy
    price: 99.00,
    cost: 65.00,
    unit: 'Units',
    warehouseId: 'wh-3',
    supplierId: 'sup-3',
    serialTracked: true,
    zone: 'Zone B',
    shelf: 'Ais-11 / Row-A',
    description: 'PCIe Gen 4.0 interface, read speeds up to 7,000MB/s, nickel-coated controller with smart heat dissipation.',
    tags: ['Core Components', 'Bulk Item'],
    procureOnDemand: true,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  },
  {
    id: 'item-5',
    sku: 'ALU-BRK-50X50',
    name: 'Structural Aluminum Bracket 50x50',
    category: 'Metal Works',
    qty: 1420,
    reservedQty: 0,
    minQty: 500, // Healthy
    price: 4.50,
    cost: 1.80,
    unit: 'Pcs',
    warehouseId: 'wh-2',
    supplierId: 'sup-2',
    serialTracked: false,
    zone: 'Zone C',
    shelf: 'Ais-1 / Row-Z',
    description: 'Heavily anodized aluminum alloy bracket, engineered for structural load applications.',
    tags: ['Raw Materials', 'Medium Margin'],
    procureOnDemand: false,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  },
  {
    id: 'item-6',
    sku: 'CAB-COP-AWG12',
    name: '12 AWG Shielded Copper Wire (100m)',
    category: 'Cabling',
    qty: 12,
    reservedQty: 0,
    minQty: 15, // Low stock!
    price: 145.00,
    cost: 92.00,
    unit: 'Spools',
    warehouseId: 'wh-1',
    supplierId: 'sup-2',
    serialTracked: false,
    zone: 'Zone C',
    shelf: 'Ais-8 / Row-E',
    description: 'High performance copper wire harness with moisture resistant outer sheath and premium braided isolation.',
    tags: ['Raw Materials', 'Heavy Duty'],
    procureOnDemand: true,
    procurementType: 'Purchase',
    procurementStrategy: 'MTO'
  },
  {
    id: 'item-7',
    sku: 'FURN-WOOD-TAB',
    name: 'Wooden Table',
    category: 'Furniture',
    qty: 5,
    reservedQty: 0,
    minQty: 10,
    price: 250.00,
    cost: 100.00,
    unit: 'Units',
    warehouseId: 'wh-1',
    supplierId: '',
    serialTracked: true,
    zone: 'Zone D',
    shelf: 'Ais-1 / Row-A',
    description: 'Premium handcrafted wooden dining table.',
    tags: ['Finished Goods', 'Furniture'],
    procureOnDemand: true,
    procurementType: 'Manufacturing',
    procurementStrategy: 'MTO',
    bomId: 'bom-1'
  },
  {
    id: 'item-8',
    sku: 'COMP-WOOD-LEG',
    name: 'Wooden Legs',
    category: 'Raw Materials',
    qty: 100,
    reservedQty: 40,
    minQty: 50,
    price: 15.00,
    cost: 5.00,
    unit: 'Units',
    warehouseId: 'wh-2',
    supplierId: 'sup-4',
    serialTracked: false,
    zone: 'Zone C',
    shelf: 'Ais-2 / Row-A',
    description: 'Sturdy wooden legs for furniture assembly.',
    tags: ['Components', 'Furniture'],
    procureOnDemand: true,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  },
  {
    id: 'item-9',
    sku: 'COMP-WOOD-TOP',
    name: 'Wooden Top',
    category: 'Raw Materials',
    qty: 25,
    reservedQty: 10,
    minQty: 20,
    price: 80.00,
    cost: 40.00,
    unit: 'Units',
    warehouseId: 'wh-2',
    supplierId: 'sup-4',
    serialTracked: false,
    zone: 'Zone C',
    shelf: 'Ais-2 / Row-B',
    description: 'Solid wood top surface for tables.',
    tags: ['Components', 'Furniture'],
    procureOnDemand: true,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  },
  {
    id: 'item-10',
    sku: 'COMP-SCREW-M8',
    name: 'M8 Screws',
    category: 'Raw Materials',
    qty: 500,
    reservedQty: 120,
    minQty: 200,
    price: 0.10,
    cost: 0.02,
    unit: 'Units',
    warehouseId: 'wh-3',
    supplierId: 'sup-2',
    serialTracked: false,
    zone: 'Zone C',
    shelf: 'Ais-3 / Row-A',
    description: 'Standard M8 screws for assembly.',
    tags: ['Components', 'Hardware'],
    procureOnDemand: false,
    procurementType: 'Purchase',
    procurementStrategy: 'MTS'
  }
];

export const DEFAULT_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'ORD-2026-004',
    customerName: 'AeroSpace Design Partners',
    orderDate: '2026-06-11',
    status: 'Pending',
    items: [
      { itemId: 'item-1', itemName: 'Intel Core i7-12700K Processor', qty: 10, price: 389.00 },
      { itemId: 'item-3', itemName: 'Corsair Vengeance 32GB DDR5 (2x16)', qty: 20, price: 129.00 }
    ],
    total: 6470.00
  },
  {
    id: 'ORD-2026-003',
    customerName: 'BioMed Diagnostics Inc',
    orderDate: '2026-06-10',
    status: 'Shipped',
    items: [
      { itemId: 'item-4', itemName: 'Samsung 980 Pro 1TB M.2 NVMe SSD', qty: 50, price: 99.00 }
    ],
    total: 4950.00
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Cascade Quantum Solutions',
    orderDate: '2026-06-08',
    status: 'Paid',
    items: [
      { itemId: 'item-2', itemName: 'NVIDIA GeForce RTX 4070 Dual OC', qty: 8, price: 599.00 },
      { itemId: 'item-1', itemName: 'Intel Core i7-12700K Processor', qty: 4, price: 389.00 }
    ],
    total: 6348.00
  },
  {
    id: 'ORD-2026-001',
    customerName: 'Detroit Automotive Systems',
    orderDate: '2026-06-02',
    status: 'Paid',
    items: [
      { itemId: 'item-5', itemName: 'Structural Aluminum Bracket 50x50', qty: 1000, price: 4.50 }
    ],
    total: 4500.00
  }
];

export const DEFAULT_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2026-015',
    supplierId: 'sup-1',
    supplierName: 'Silicon Core Tech',
    orderDate: '2026-06-11',
    expectedDate: '2026-06-16',
    status: 'Sent',
    items: [
      { sku: 'CPU-INT-I7-12', itemName: 'Intel Core i7-12700K Processor', qty: 80, cost: 290.00 },
      { sku: 'GPU-RTX-4070-O8', itemName: 'NVIDIA GeForce RTX 4070 Dual OC', qty: 40, cost: 440.00 }
    ],
    total: 40800.00,
    billingTerms: 'Net 30',
    approvedBy: 'Sarah Jenkins'
  },
  {
    id: 'PO-2026-014',
    supplierId: 'sup-2',
    supplierName: 'Vulcan Metal Alloy',
    orderDate: '2026-06-09',
    expectedDate: '2026-06-21',
    status: 'Partially Received',
    items: [
      { sku: 'ALU-BRK-50X50', itemName: 'Structural Aluminum Bracket 50x50', qty: 2000, cost: 1.80 }
    ],
    total: 3600.00,
    billingTerms: 'Net 60',
    approvedBy: 'Marcus Miller'
  },
  {
    id: 'PO-2026-012',
    supplierId: 'sup-3',
    supplierName: 'Apex Optics Ltd',
    orderDate: '2026-06-05',
    expectedDate: '2026-06-13',
    status: 'Received',
    items: [
      { sku: 'SSD-SAM-980P-1T', itemName: 'Samsung 980 Pro 1TB M.2 NVMe SSD', qty: 150, cost: 65.00 }
    ],
    total: 9750.00,
    billingTerms: 'Due on Receipt',
    approvedBy: 'Kenji Sato'
  }
];

export const DEFAULT_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: 'ADJ-101',
    itemId: 'item-1',
    itemName: 'Intel Core i7-12700K Processor',
    date: '2026-06-11',
    qtyAdjusted: -3,
    type: 'Wastage',
    reason: 'Water damage detected in Sub-Aisle A4 container ceiling drip.',
    doneBy: 'Sarah Jenkins',
    fromLocation: 'Dallas - Ais-4'
  },
  {
    id: 'ADJ-102',
    itemId: 'item-3',
    itemName: 'Corsair Vengeance 32GB DDR5 (2x16)',
    date: '2026-06-09',
    qtyAdjusted: 12,
    type: 'Re-count',
    reason: 'System discrepancy found during cyclic manual audit. Found stacked behind cabling reels.',
    doneBy: 'Marcus Miller',
    fromLocation: 'Chicago - Ais-12'
  },
  {
    id: 'ADJ-103',
    itemId: 'item-5',
    itemName: 'Structural Aluminum Bracket 50x50',
    date: '2026-06-06',
    qtyAdjusted: -15,
    type: 'Damage',
    reason: 'Forklift impact deformed lower pallet stack storage bins.',
    doneBy: 'Kenji Sato',
    fromLocation: 'Seattle - Ais-1'
  }
];

export const DEFAULT_EXPENSES: Expense[] = [
  { id: 'EXP-421', date: '2026-06-11', title: 'Silicon Core Tech Bulk Freight', category: 'Freight', amount: 840.00, status: 'Completed', loggedBy: 'Sarah Jenkins', receiptMock: true },
  { id: 'EXP-420', date: '2026-06-10', title: 'Dallas Zone A Re-rack Packaging', category: 'Packaging', amount: 350.00, status: 'Completed', loggedBy: 'Sarah Jenkins', receiptMock: false },
  { id: 'EXP-419', date: '2026-06-08', title: 'Forklift Diesel Refuel Logistics', category: 'Logistics', amount: 210.00, status: 'Completed', loggedBy: 'Kenji Sato', receiptMock: true },
  { id: 'EXP-418', date: '2026-06-05', title: 'Damaged Spool Wire Scrap Rite-off', category: 'Wastage', amount: 92.00, status: 'Completed', loggedBy: 'Marcus Miller', receiptMock: false },
  { id: 'EXP-417', date: '2026-06-01', title: 'Chicago Office Monthly Space Lease', category: 'Rent', amount: 4500.00, status: 'Pending', loggedBy: 'SYSTEM', receiptMock: false }
];

export const DEFAULT_RECEIVABLES: AccountsReceivable[] = [
  { id: 'REC-091', customerName: 'AeroSpace Design Partners', dueDate: '2026-07-11', amount: 6470.00, amountPaid: 0.00, status: 'Open', termDays: 30 },
  { id: 'REC-090', customerName: 'BioMed Diagnostics Inc', dueDate: '2026-07-10', amount: 4950.00, amountPaid: 1500.00, status: 'Open', termDays: 30 },
  { id: 'REC-089', customerName: 'Cascade Quantum Solutions', dueDate: '2026-06-08', amount: 6348.00, amountPaid: 6348.00, status: 'Paid', termDays: 30 },
  { id: 'REC-088', customerName: 'Detroit Automotive Systems', dueDate: '2026-06-15', amount: 4500.00, amountPaid: 0.00, status: 'Overdue', termDays: 15 },
  { id: 'REC-087', customerName: 'Solder Systems International', dueDate: '2026-05-20', amount: 8200.00, amountPaid: 8200.00, status: 'Paid', termDays: 30 }
];

export const DEFAULT_INVOICES: import('./types').Invoice[] = [
  {
    id: 'INV-2026-041',
    clientName: 'AeroSpace Design Partners',
    issueDate: '2026-06-11',
    dueDate: '2026-07-11',
    amount: 6470.00,
    status: 'Sent',
    items: [
      { description: 'Intel Core i7-12700K Processor', qty: 10, price: 389.00 },
      { description: 'Corsair Vengeance 32GB DDR5', qty: 20, price: 129.00 }
    ]
  },
  {
    id: 'INV-2026-040',
    clientName: 'BioMed Diagnostics Inc',
    issueDate: '2026-06-10',
    dueDate: '2026-07-10',
    amount: 4950.00,
    status: 'Draft',
    items: [
      { description: 'Samsung 980 Pro 1TB M.2 NVMe SSD', qty: 50, price: 99.00 }
    ]
  },
  {
    id: 'INV-2026-039',
    clientName: 'Cascade Quantum Solutions',
    issueDate: '2026-05-08',
    dueDate: '2026-06-08',
    amount: 6348.00,
    status: 'Paid',
    items: [
      { description: 'NVIDIA GeForce RTX 4070 Dual OC', qty: 8, price: 599.00 },
      { description: 'Intel Core i7-12700K Processor', qty: 4, price: 389.00 }
    ]
  },
  {
    id: 'INV-2026-038',
    clientName: 'Detroit Automotive Systems',
    issueDate: '2026-05-15',
    dueDate: '2026-06-15',
    amount: 4500.00,
    status: 'Overdue',
    items: [
      { description: 'Structural Aluminum Bracket 50x50', qty: 1000, price: 4.50 }
    ]
  }
];

export const DEFAULT_BOMS: BillOfMaterial[] = [
  {
    id: 'bom-1',
    productId: 'item-7', // Wooden Table
    components: [
      { itemId: 'item-8', qty: 4 }, // Wooden Legs
      { itemId: 'item-9', qty: 1 }, // Wooden Top
      { itemId: 'item-10', qty: 12 } // Screws
    ],
    operations: [
      { name: 'Assembly', duration: 60 },
      { name: 'Painting', duration: 30 },
      { name: 'Packing', duration: 20 }
    ]
  }
];

export const DEFAULT_MANUFACTURING_ORDERS: ManufacturingOrder[] = [
  {
    id: 'MO-2026-001',
    finishedProductId: 'item-7', // Wooden Table
    quantity: 10,
    status: 'In Progress',
    orderDate: '2026-06-12',
    assignee: 'Marcus Miller',
    workCenter: 'Assembly Line'
  }
];

export const DEFAULT_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Alexandra Wright',
    email: 'alexandra@nexusedge.com',
    phone: '+1 (555) 293-8472',
    company: 'Nexus Edge Engineering',
    status: 'Active',
    totalSpend: 145000.50,
    lastContactDate: '2026-06-20',
    notes: 'Key account for Q3 expansion.',
    tags: ['Enterprise', 'High Value']
  },
  {
    id: 'cust-2',
    name: 'David Chen',
    email: 'dchen@biomeddiag.com',
    phone: '+1 (555) 912-3311',
    company: 'BioMed Diagnostics Inc',
    status: 'Active',
    totalSpend: 4950.00,
    lastContactDate: '2026-06-15',
    notes: 'Interested in bulk workstation upgrades.',
    tags: ['Medical', 'Bulk']
  },
  {
    id: 'cust-3',
    name: 'Samantha Reyes',
    email: 's.reyes@quantumcascade.io',
    phone: '+1 (555) 888-2910',
    company: 'Cascade Quantum Solutions',
    status: 'Lead',
    totalSpend: 0.00,
    lastContactDate: '2026-06-25',
    notes: 'Requested a quote for 50 custom servers. Waiting on procurement approval.',
    tags: ['Tech', 'Prospect']
  }
];

export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    date: '2026-06-25',
    amount: 12500.00,
    method: 'Bank Transfer',
    status: 'Completed',
    reference: 'TXN-9823741A',
    customerName: 'Nexus Edge Engineering',
    invoiceId: 'INV-2026-104'
  },
  {
    id: 'pay-2',
    date: '2026-06-26',
    amount: 450.00,
    method: 'Credit Card',
    status: 'Completed',
    reference: 'STRIPE-CH_1M...',
    customerName: 'BioMed Diagnostics Inc',
    invoiceId: 'INV-2026-105'
  },
  {
    id: 'pay-3',
    date: '2026-06-27',
    amount: 2100.00,
    method: 'Check',
    status: 'Pending',
    reference: 'CHK-00492',
    customerName: 'Alexandra Wright',
  }
];
