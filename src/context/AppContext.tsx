/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Customer, Product, Invoice, AccountingLog, MfsTransaction, 
  ItProject, Employee, WebsiteLink, AppSettings, Language, UserProfile 
} from "../types";

// Dynamic ID helper
const generateId = () => Math.random().toString(36).substring(2, 11);

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  
  // Data State
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  accounting: AccountingLog[];
  mfsTransactions: MfsTransaction[];
  projects: ItProject[];
  employees: Employee[];
  websiteLinks: WebsiteLink[];
  settings: AppSettings;
  
  // State manipulation triggers
  addCustomer: (c: Omit<Customer, "id" | "createdAt" | "dueAmount" | "advanceAmount">) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  recordDuePayment: (customerId: string, amount: number, isCollection: boolean) => void;
  
  addProduct: (p: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addInvoice: (inv: Omit<Invoice, "id" | "createdAt" | "invoiceNumber">) => Invoice;
  deleteInvoice: (id: string) => void;
  
  addAccountingLog: (log: Omit<AccountingLog, "id">) => AccountingLog;
  deleteAccountingLog: (id: string) => void;
  
  addMfsTransaction: (tx: Omit<MfsTransaction, "id" | "date">) => MfsTransaction;
  deleteMfsTransaction: (id: string) => void;
  
  addProject: (proj: Omit<ItProject, "id">) => ItProject;
  updateProject: (id: string, updates: Partial<ItProject>) => void;
  deleteProject: (id: string) => void;
  
  addEmployee: (emp: Omit<Employee, "id" | "attendance">) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  markAttendance: (employeeId: string, dateStr: string, status: "Present" | "Absent" | "Late") => void;
  
  addWebsiteLink: (link: Omit<WebsiteLink, "id" | "recentClicks">) => WebsiteLink;
  updateWebsiteLink: (id: string, updates: Partial<WebsiteLink>) => void;
  deleteWebsiteLink: (id: string) => void;
  incrementLinkClicks: (id: string) => void;
  
  updateSettings: (updates: Partial<AppSettings>) => void;
  syncWithCloud: () => Promise<void>;
  isSyncing: boolean;
  firebaseActive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Core official bangladesh government links
const DEFAULT_LINKS: WebsiteLink[] = [
  { id: "link-e-namjari", title: "E-Namjari Portal", titleBn: "ই-নামজারি (মিউটেশন আবেদন)", category: "Land", url: "https://mutation.land.gov.bd/", isFavorite: true, recentClicks: 42 },
  { id: "link-eporcha", title: "E-Porcha Khatian Search", titleBn: "ই-পর্চা (খতিয়ান অনুসন্ধান)", category: "Land", url: "https://www.eporcha.gov.bd/", isFavorite: true, recentClicks: 35 },
  { id: "link-mouza-map", title: "Mouza Map Search Portal", titleBn: "মৌজা ম্যাপ পোর্টাল", category: "Land", url: "https://www.eporcha.gov.bd/mouza-search", isFavorite: false, recentClicks: 18 },
  { id: "link-land-tax", title: "Land Development Tax", titleBn: "ভূমি উন্নয়ন কর (ভূমি কর প্রদান)", category: "Land", url: "https://ldtax.gov.bd/", isFavorite: true, recentClicks: 29 },
  { id: "link-nid", title: "NID Application Portal", titleBn: "জাতীয় পরিচয়পত্র (NID) সেবা", category: "Civic", url: "https://services.nidw.gov.bd/", isFavorite: true, recentClicks: 56 },
  { id: "link-epassport", title: "E-Passport Application", titleBn: "অনলাইন ই-পাসপোর্ট আবেদন", category: "Civic", url: "https://www.epassport.gov.bd/", isFavorite: false, recentClicks: 12 },
  { id: "link-brta", title: "BRTA Service Portal", titleBn: "বিআরটিএ সেবা বাতায়ন (BSP)", category: "Civic", url: "https://bsp.brta.gov.bd/", isFavorite: false, recentClicks: 8 },
  { id: "link-birth-cert", title: "Birth & Death Registration", titleBn: "জন্ম ও মৃত্যু বিবরণী নিবন্ধন", category: "Civic", url: "https://bdris.gov.bd/", isFavorite: true, recentClicks: 38 },
  { id: "link-trade-license", title: "E-Trade License Board", titleBn: "অনলাইন ই-ট্রেড লাইসেন্স", category: "Business", url: "https://www.etradelicense.gov.bd/", isFavorite: false, recentClicks: 15 },
  { id: "link-govt-forms", title: "National Portal Forms", titleBn: "সরকারি ফরম বাতায়ন (ডাউনলোড)", category: "Business", url: "http://www.forms.gov.bd/", isFavorite: false, recentClicks: 21 },
  { id: "link-indian-visa", title: "Indian Visa Center (IVAC)", titleBn: "অনলাইন ভারতীয় ভিসা আবেদন", category: "Visa", url: "https://www.ivacbd.com/", isFavorite: true, recentClicks: 24 },
  { id: "link-rail-ticket", title: "Rail Sheba Ticket Board", titleBn: "রেলওয়ে অনলাইন টিকেট বুকিং", category: "Tickets", url: "https://eticket.railway.gov.bd/", isFavorite: true, recentClicks: 51 }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [firebaseActive, setFirebaseActive] = useState<boolean>(false);
  
  // Standard user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    uid: "admin-uid",
    displayName: "Md. Safir Uddin Titu",
    email: "mdsafiruddintitu@gmail.com",
    role: "admin",
    phone: "01824234587",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // State slices
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounting, setAccounting] = useState<AccountingLog[]>([]);
  const [mfsTransactions, setMfsTransactions] = useState<MfsTransaction[]>([]);
  const [projects, setProjects] = useState<ItProject[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [websiteLinks, setWebsiteLinks] = useState<WebsiteLink[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
    companyName: "R N Enterprise",
    ownerName: "Md. Safir Uddin Titu",
    mobile: "01824234587",
    address: "Nutonpara, Biswambarpur, Sunamganj, Bangladesh",
    whatsappMessage: "Hello Sir, greeting from R N Enterprise! Your invoice amount is total",
    bkashNumber: "01824234587",
    nagadNumber: "01824234587",
    rocketNumber: "01824234587"
  });

  // Initial Seed Data to make user experience fantastic out of the box
  useEffect(() => {
    // 1. Language preference
    const savedLang = localStorage.getItem("rn_lang");
    if (savedLang) setLanguage(savedLang as Language);
    
    // 2. Dark mode preference
    const savedDark = localStorage.getItem("rn_dark");
    if (savedDark) {
      setDarkMode(savedDark === "true");
    } else {
      setDarkMode(true);
    }

    // 3. Main Data Core Loader
    const loadSlice = <T,>(key: string, defaultVal: T): T => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    };

    // Seeds if empty
    const seededCustomers: Customer[] = [
      { id: "cust-1", name: "Kamrul Hasan", phone: "01712345678", address: "Biswambarpur, Sunamganj", email: "kamrul@gmail.com", dueAmount: 1450, advanceAmount: 0, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: "cust-2", name: "Sima Rahman", phone: "01998765432", address: "Nutonpara, Sunamganj", email: "sima@gmail.com", dueAmount: 0, advanceAmount: 500, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: "cust-3", name: "Helal Uddin", phone: "01815123456", address: "Sunamganj Sadar", email: "helal@yahoo.com", dueAmount: 3200, advanceAmount: 0, createdAt: new Date(Date.now() - 10 * 86400000).toISOString() }
    ];

    const seededProducts: Product[] = [
      { id: "prod-1", name: "Dual-Mode Wireless Mouse RNE-50", category: "IT Accessories", stock: 15, minStock: 5, buyingPrice: 350, sellingPrice: 550, sku: "RNE-MOU-01" },
      { id: "prod-2", name: "Cat6 Internet Cable (Per Metre)", category: "Network Equipment", stock: 120, minStock: 20, buyingPrice: 12, sellingPrice: 20, sku: "RNE-CAB-06" },
      { id: "prod-3", name: "Transcend JetFlash 32GB USB 3.0", category: "Storage Devices", stock: 3, minStock: 5, buyingPrice: 420, sellingPrice: 600, sku: "RNE-USB-16" },
      { id: "prod-4", name: "Gigabit Wifi Router 1200Mbps Duo", category: "Network Equipment", stock: 8, minStock: 3, buyingPrice: 1450, sellingPrice: 1850, sku: "RNE-ROU-99" }
    ];

    const seededInvoices: Invoice[] = [
      {
        id: "inv-1",
        invoiceNumber: "INV-2026-001",
        customerId: "cust-1",
        customerName: "Kamrul Hasan",
        customerPhone: "01712345678",
        items: [{ id: "prod-1", name: "Dual-Mode Wireless Mouse RNE-50", quantity: 2, price: 550, total: 1100 }],
        totalAmount: 1100,
        discount: 100,
        paidAmount: 1000,
        dueAmount: 0,
        paymentStatus: "Paid",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        createdBy: "Md. Safir Uddin Titu"
      },
      {
        id: "inv-2",
        invoiceNumber: "INV-2026-002",
        customerId: "cust-3",
        customerName: "Helal Uddin",
        customerPhone: "01815123456",
        items: [
          { id: "prod-4", name: "Gigabit Wifi Router 1200Mbps Duo", quantity: 1, price: 1850, total: 1850 },
          { id: "prod-1", name: "Dual-Mode Wireless Mouse RNE-50", quantity: 1, price: 550, total: 550 }
        ],
        totalAmount: 2400,
        discount: 0,
        paidAmount: 1400,
        dueAmount: 1000,
        paymentStatus: "Partially Paid",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdBy: "Md. Safir Uddin Titu"
      }
    ];

    const seededAccounting: AccountingLog[] = [
      { id: "acc-1", type: "income", amount: 1000, category: "Hardware Sales", description: "Invoice INV-2026-001 Complete Pay", date: "2026-06-11" },
      { id: "acc-2", type: "income", amount: 1400, category: "Digital Services", description: "E-Namjari online processing fees", date: "2026-06-12" },
      { id: "acc-3", type: "expense", amount: 450, category: "Office Stationary", description: "Paper reams and toner ink refill", date: "2026-06-12" },
      { id: "acc-4", type: "income", amount: 1850, category: "Hardware Sales", description: "Sold Gigabit Router to Admin Client", date: "2026-06-13" },
      { id: "acc-5", type: "expense", amount: 200, category: "Refreshments", description: "Tea and snacks for clients", date: "2026-06-13" }
    ];

    const seededMfs: MfsTransaction[] = [
      { id: "mfs-1", channel: "bKash", type: "Cash In", amount: 5000, fee: 90, customerPhone: "01722334455", trxId: "BF6K9ZLT1A", status: "Success", date: new Date(Date.now() - 12 * 3600000).toISOString() },
      { id: "mfs-2", channel: "Nagad", type: "Cash Out", amount: 12000, fee: 180, customerPhone: "01899112233", trxId: "NG882JOP9X", status: "Success", date: new Date(Date.now() - 6 * 3600000).toISOString() },
      { id: "mfs-3", channel: "Rocket", type: "Send Money", amount: 3500, fee: 35, customerPhone: "01511223344", trxId: "RK7X6W5V4U", status: "Pending", date: new Date().toISOString() }
    ];

    const seededProjects: ItProject[] = [
      { id: "proj-1", title: "Fish Hatchery E-Commerce Site", clientName: "Sunamganj Fisheries", clientContact: "01722223333", type: "Website", status: "In Progress", cost: 35000, paid: 15000, deadline: "2026-07-15" },
      { id: "proj-2", title: "Digital Service Tracker Mobile App", clientName: "Union Digital Parishad", clientContact: "01844445555", type: "Mobile App", status: "Quoted", cost: 65000, paid: 5000, deadline: "2026-08-30" },
      { id: "proj-3", title: "Domain & Hosting Renewal 2026", clientName: "Shine Enterprise Ltd", clientContact: "01912341234", type: "Domain/Hosting", status: "Completed", cost: 4500, paid: 4500, deadline: "2026-06-25" }
    ];

    const seededEmployees: Employee[] = [
      { id: "emp-1", name: "Amanullah Sarkar", phone: "01819384950", designation: "Digital Portal Operator", salary: 12000, attendance: {} },
      { id: "emp-2", name: "Dipu Dash", phone: "01914283848", designation: "Hardware Specialist & Tech Assistant", salary: 14000, attendance: {} }
    ];

    const loadedCustomers = loadSlice<Customer[]>("rn_customers", seededCustomers);
    if (!loadedCustomers.some(c => c.id === "cust-walkin")) {
      loadedCustomers.unshift({
        id: "cust-walkin",
        name: "Walk-in Customer (General)",
        phone: "01800000000",
        address: "Local Store",
        email: "walkin@rnenterprise.com",
        dueAmount: 0,
        advanceAmount: 0,
        createdAt: new Date().toISOString()
      });
    }
    setCustomers(loadedCustomers);
    setProducts(loadSlice("rn_products", seededProducts));
    setInvoices(loadSlice("rn_invoices", seededInvoices));
    setAccounting(loadSlice("rn_accounting", seededAccounting));
    setMfsTransactions(loadSlice("rn_mfs", seededMfs));
    setProjects(loadSlice("rn_projects", seededProjects));
    setEmployees(loadSlice("rn_employees", seededEmployees));
    setWebsiteLinks(loadSlice("rn_links", DEFAULT_LINKS));
    setSettings(loadSlice("rn_settings", settings));
  }, []);

  // Sync back state modifications to local registry immediately
  useEffect(() => {
    if (customers.length > 0) localStorage.setItem("rn_customers", JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    if (products.length > 0) localStorage.setItem("rn_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    if (invoices.length > 0) localStorage.setItem("rn_invoices", JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    if (accounting.length > 0) localStorage.setItem("rn_accounting", JSON.stringify(accounting));
  }, [accounting]);
  useEffect(() => {
    if (mfsTransactions.length > 0) localStorage.setItem("rn_mfs", JSON.stringify(mfsTransactions));
  }, [mfsTransactions]);
  useEffect(() => {
    if (projects.length > 0) localStorage.setItem("rn_projects", JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    if (employees.length > 0) localStorage.setItem("rn_employees", JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    if (websiteLinks.length > 0) localStorage.setItem("rn_links", JSON.stringify(websiteLinks));
  }, [websiteLinks]);
  useEffect(() => {
    localStorage.setItem("rn_settings", JSON.stringify(settings));
  }, [settings]);

  // Settings Save Handler
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // 1. Customers Core handlers
  const addCustomer = (c: Omit<Customer, "id" | "createdAt" | "dueAmount" | "advanceAmount">) => {
    const newCust: Customer = {
      ...c,
      id: "cust-" + generateId(),
      dueAmount: 0,
      advanceAmount: 0,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const recordDuePayment = (customerId: string, amount: number, isCollection: boolean) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        if (isCollection) {
          // Paying due
          const remainder = c.dueAmount - amount;
          if (remainder < 0) {
            return { ...c, dueAmount: 0, advanceAmount: c.advanceAmount + Math.abs(remainder) };
          }
          return { ...c, dueAmount: remainder };
        } else {
          // Adding due
          return { ...c, dueAmount: c.dueAmount + amount };
        }
      }
      return c;
    }));
  };

  // 2. Inventory Core handlers
  const addProduct = (p: Omit<Product, "id">) => {
    const newProd: Product = {
      ...p,
      id: "prod-" + generateId()
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // 3. Invoice Core Handlers
  const addInvoice = (inv: Omit<Invoice, "id" | "createdAt" | "invoiceNumber">) => {
    const orderNo = "INV-" + new Date().getFullYear() + "-" + (invoices.length + 101).toString();
    const newInv: Invoice = {
      ...inv,
      id: "inv-" + generateId(),
      invoiceNumber: orderNo,
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [newInv, ...prev]);
    
    // Auto adjust stock qty
    inv.items.forEach(item => {
      setProducts(pList => pList.map(p => p.id === item.id ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p));
    });

    // Auto update customer ledger
    if (inv.dueAmount > 0) {
      recordDuePayment(inv.customerId, inv.dueAmount, false);
    }

    // Auto insert income logging
    if (inv.paidAmount > 0) {
      addAccountingLog({
        type: "income",
        amount: inv.paidAmount,
        category: "Hardware Sales",
        description: `Invoice ${orderNo} Paid Amount`,
        date: new Date().toISOString().split("T")[0],
        refInvoiceId: newInv.id
      });
    }

    return newInv;
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  // 4. Accounting Core Handlers
  const addAccountingLog = (log: Omit<AccountingLog, "id">) => {
    const newLog: AccountingLog = { ...log, id: "acc-" + generateId() };
    setAccounting(prev => [newLog, ...prev]);
    return newLog;
  };

  const deleteAccountingLog = (id: string) => {
    setAccounting(prev => prev.filter(log => log.id !== id));
  };

  // 5. Mobile Financial Services (bKash/Nagad/Rocket)
  const addMfsTransaction = (tx: Omit<MfsTransaction, "id" | "date">) => {
    const newTx: MfsTransaction = {
      ...tx,
      id: "mfs-" + generateId(),
      date: new Date().toISOString()
    };
    setMfsTransactions(prev => [newTx, ...prev]);

    // Side effect to Shop accounts bookkeeping
    const profitFeeShare = tx.type === "Cash Out" ? tx.fee * 0.7 : 10; // Agent commissions
    if (tx.status === "Success") {
      addAccountingLog({
        type: "income",
        amount: profitFeeShare,
        category: "MFS Commission",
        description: `${tx.channel} ${tx.type} (Amt: ${tx.amount} Tk, Ref: ${tx.trxId})`,
        date: new Date().toISOString().split("T")[0]
      });
    }

    return newTx;
  };

  const deleteMfsTransaction = (id: string) => {
    setMfsTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // 6. IT Projects
  const addProject = (proj: Omit<ItProject, "id">) => {
    const newProj: ItProject = { ...proj, id: "proj-" + generateId() };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<ItProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // 7. Employee Payroll & Attendance
  const addEmployee = (emp: Omit<Employee, "id" | "attendance">) => {
    const newEmp: Employee = { ...emp, id: "emp-" + generateId(), attendance: {} };
    setEmployees(prev => [newEmp, ...prev]);
    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const markAttendance = (employeeId: string, dateStr: string, status: "Present" | "Absent" | "Late") => {
    setEmployees(prev => prev.map(e => {
      if (e.id === employeeId) {
        return {
          ...e,
          attendance: { ...e.attendance, [dateStr]: status }
        };
      }
      return e;
    }));
  };

  // 8. Website link directory & favorite links
  const addWebsiteLink = (link: Omit<WebsiteLink, "id" | "recentClicks">) => {
    const newL: WebsiteLink = { ...link, id: "link-" + generateId(), recentClicks: 0 };
    setWebsiteLinks(prev => [newL, ...prev]);
    return newL;
  };

  const updateWebsiteLink = (id: string, updates: Partial<WebsiteLink>) => {
    setWebsiteLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteWebsiteLink = (id: string) => {
    setWebsiteLinks(prev => prev.filter(l => l.id !== id));
  };

  const incrementLinkClicks = (id: string) => {
    setWebsiteLinks(prev => prev.map(l => l.id === id ? { ...l, recentClicks: l.recentClicks + 1 } : l));
  };

  // Interactive google cloud sync simulator
  const syncWithCloud = async () => {
    setIsSyncing(true);
    // Simulate API pipeline duration
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: (lang) => {
          setLanguage(lang);
          localStorage.setItem("rn_lang", lang);
        },
        darkMode,
        setDarkMode: (val) => {
          setDarkMode(val);
          localStorage.setItem("rn_dark", String(val));
        },
        currentUser,
        setCurrentUser,
        
        // Data State
        customers,
        products,
        invoices,
        accounting,
        mfsTransactions,
        projects,
        employees,
        websiteLinks,
        settings,
        
        // Manipulative Triggers
        addCustomer,
        updateCustomer,
        deleteCustomer,
        recordDuePayment,
        
        addProduct,
        updateProduct,
        deleteProduct,
        
        addInvoice,
        deleteInvoice,
        
        addAccountingLog,
        deleteAccountingLog,
        
        addMfsTransaction,
        deleteMfsTransaction,
        
        addProject,
        updateProject,
        deleteProject,
        
        addEmployee,
        updateEmployee,
        deleteEmployee,
        markAttendance,
        
        addWebsiteLink,
        updateWebsiteLink,
        deleteWebsiteLink,
        incrementLinkClicks,
        
        updateSettings,
        syncWithCloud,
        isSyncing,
        firebaseActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
};
