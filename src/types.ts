/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "admin" | "employee" | "customer";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  dueAmount: number;
  advanceAmount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  buyingPrice: number;
  sellingPrice: number;
  sku: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  totalAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "Paid" | "Partially Paid" | "Unpaid";
  createdAt: string;
  createdBy: string;
}

export interface AccountingLog {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  refInvoiceId?: string;
}

export interface MfsTransaction {
  id: string;
  channel: "bKash" | "Nagad" | "Rocket";
  type: "Cash In" | "Cash Out" | "Send Money" | "Bill Pay";
  amount: number;
  fee: number;
  customerPhone: string;
  trxId: string;
  status: "Success" | "Pending" | "Failed";
  date: string;
}

export interface ItProject {
  id: string;
  title: string;
  clientName: string;
  clientContact: string;
  type: "Website" | "Mobile App" | "Domain/Hosting" | "IT Consult";
  status: "Quoted" | "In Progress" | "Completed" | "On Hold";
  cost: number;
  paid: number;
  deadline: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  designation: string;
  salary: number;
  attendance: { [dateStr: string]: "Present" | "Absent" | "Late" };
}

export interface WebsiteLink {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  url: string;
  isFavorite: boolean;
  recentClicks: number;
}

export interface AppSettings {
  companyName: string;
  ownerName: string;
  mobile: string;
  address: string;
  whatsappMessage: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
}

// Translations type
export type Language = "en" | "bn";

export const TRANSLATIONS = {
  en: {
    appName: "R N Enterprise",
    appSubName: "Digital Service & IT Center",
    owner: "Owner",
    phone: "Mobile",
    address: "Address",
    dashboard: "Dashboard",
    digitalServices: "Digital Services",
    serviceDirectory: "Service Directory",
    shopAccounting: "Shop Accounting",
    customerManagement: "Customers",
    invoiceSystem: "Invoice System",
    mobileBanking: "Mobile Banking",
    inventory: "Inventory",
    employeeManagement: "Employees",
    documentCenter: "Document Center",
    itServices: "IT Management",
    adminPanel: "Admin Panel",
    langToggle: "Bangla",
    dailyIncome: "Daily Income",
    dailyExpense: "Daily Expense",
    totalProfit: "Total Profit",
    dueAmount: "Due Amount",
    totalDue: "Total Due",
    activeCustomers: "Customers",
    activeServices: "Active Services",
    analytics: "Analytics & Trends",
    recentTransactions: "Recent Transactions",
    allModuleCounts: "Operational Statistics",
    addLog: "Add Ledger Entry",
    income: "Income",
    expense: "Expense",
    category: "Category",
    amount: "Amount",
    description: "Description",
    save: "Save",
    cancel: "Cancel",
    search: "Search...",
    print: "Print",
    dueCollection: "Receive Due Payment",
    collect: "Collect",
    smsReminder: "Send WhatsApp / SMS",
    addCustomer: "Add Customer",
    editCustomer: "Edit Customer",
    addProduct: "Add Product",
    addProject: "Add IT Project",
    addEmployee: "Add Staff Record",
    addLink: "Add Link Shortcut",
    lowStock: "Low Stock Alert",
    sku: "SKU",
    price: "Price",
    buyingPrice: "Buying Price",
    sellingPrice: "Selling Price",
    stock: "Stock Quantity",
    salary: "Salary",
    attendance: "Attendance",
    pdfScanner: "PDF Scanner",
    imgToPdf: "Image to PDF",
    pdfWorkers: "PDF Binders",
    qrGen: "QR Code Generator",
    qrScan: "QR Reader Simulation",
    recentClicks: "Clicks",
    favorite: "Favorites",
    whatsappBtn: "WhatsApp Support",
    callBtn: "Direct Call",
    backupGoogleDrive: "Backup to Storage",
    onlineSync: "Cloud Synced",
    offlineMode: "Offline Workspace",
    totalOutstanding: "Total Outstanding Dues",
    financialHealth: "Profitability Log",
    date: "Date"
  },
  bn: {
    appName: "আর এন এন্টারপ্রাইজ",
    appSubName: "ডিজিটাল সার্ভিস ও আইটি সেন্টার",
    owner: "প্রোপাইটর",
    phone: "মোবাইল",
    address: "ঠিকানা",
    dashboard: "ড্যাশবোর্ড",
    digitalServices: "ডিজিটাল সেবাসমূহ",
    serviceDirectory: "সার্ভিস ডিরেক্টরি",
    shopAccounting: "দোকানের হিসাব-নিকাশ",
    customerManagement: "গ্রাহক তথ্য",
    invoiceSystem: "ইনভয়েস সিস্টেম",
    mobileBanking: "মোবাইল ব্যাংকিং",
    inventory: "ইনভেন্টরি",
    employeeManagement: "কর্মচারী ব্যবস্থাপনা",
    documentCenter: "ডকুমেন্ট সেন্টার",
    itServices: "আইটি প্রজেক্ট",
    adminPanel: "অ্যাডমিন প্যানেল",
    langToggle: "English",
    dailyIncome: "আজকের আয়",
    dailyExpense: "আজকের খরচ",
    totalProfit: "মোট লাভ",
    dueAmount: "বকেয়া পরিমাণ",
    totalDue: "মোট বকেয়া",
    activeCustomers: "গ্রাহক সংখ্যা",
    activeServices: "সক্রিয় সেবাসমূহ",
    analytics: "অ্যানালিটিক্স ও ট্রেন্ডস",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    allModuleCounts: "অপারেশন পরিসংখ্যান",
    addLog: "লেনদেন হিসাব লিখুন",
    income: "আয় (Income)",
    expense: "খরচ (Expense)",
    category: "ক্যাটাগরি",
    amount: "টাকার পরিমাণ",
    description: "বিবরণ",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    search: "খুঁজুন...",
    print: "প্রিন্ট করুন",
    dueCollection: "বকেয়া আদায় গ্রহণ",
    collect: "আদায় করুন",
    smsReminder: "হোয়াটসঅ্যাপ / এসএমএস",
    addCustomer: "নতুন গ্রাহক যুক্ত করুন",
    editCustomer: "গ্রাহক তথ্য পরিবর্তন",
    addProduct: "নতুন পণ্য যুক্ত করুন",
    addProject: "আইটি প্রজেক্ট যুক্ত করুন",
    addEmployee: "কর্মচারী যুক্ত করুন",
    addLink: "লিংক যুক্ত করুন",
    lowStock: "স্টক ফুরিয়ে যাচ্ছে",
    sku: "এসকেইউ",
    price: "মূল্য",
    buyingPrice: "ক্রয়মূল্য",
    sellingPrice: "বিক্রয়মূল্য",
    stock: "স্টক পরিমাণ",
    salary: "বেতন",
    attendance: "হাজিরা",
    pdfScanner: "পিডিএফ স্ক্যানার",
    imgToPdf: "ছবি থেকে পিডিএফ",
    pdfWorkers: "পিডিএফ মার্জ ও স্প্লিট",
    qrGen: "কিউআর কোড জেনারেটর",
    qrScan: "কিউআর রিডার সিমুলেটর",
    recentClicks: "ক্লিক",
    favorite: "প্রিয় লিংক",
    whatsappBtn: "সরাসরি হোয়াটসঅ্যাপ",
    callBtn: "সরাসরি কল",
    backupGoogleDrive: "ক্লাউড ব্যাকআপ নিন",
    onlineSync: "সার্ভার ড্রাইভ সিনক্রোনাইজড",
    offlineMode: "অফলাইন মোড অ্যাক্টিভ",
    totalOutstanding: "গ্রাহক বকেয়া খাতা",
    financialHealth: "আয়-ব্যয় ও লাভ সূচক",
    date: "তারিখ"
  }
};
