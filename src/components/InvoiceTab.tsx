/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, Product, InvoiceItem } from "../types";
import { Receipt, Plus, Trash2, Printer, Search, CheckCircle2 } from "lucide-react";

export const InvoiceTab: React.FC = () => {
  const { language, products, customers, invoices, addInvoice, settings } = useApp();
  const t = TRANSLATIONS[language];
  
  const [activeSubTab, setActiveSubTab] = useState<"create" | "history">("create");
  const [selectedCustomerId, setSelectedCustomerId] = useState("cust-walkin");
  const [searchProduct, setSearchProduct] = useState("");
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [successNote, setSuccessNote] = useState("");
  const [newCreatedInvoice, setNewCreatedInvoice] = useState<any | null>(null);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick select customer binding
  const currentCustomerObj = customers.find(c => c.id === selectedCustomerId);

  // Generate offline simplistic Canvas QR code when an invoice is created
  useEffect(() => {
    if (newCreatedInvoice && qrCanvasRef.current) {
      const canv = qrCanvasRef.current;
      const ctx = canv.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 100, 100);
        
        // Draw decorative QR Matrix box
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 100, 100);
        
        // Render fake modules/corners
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(5, 5, 25, 25);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(10, 10, 15, 15);
        
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(70, 5, 25, 25);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(75, 10, 15, 15);

        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(5, 70, 25, 25);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(10, 75, 15, 15);

        // Scattered dots (simulated payload QR blocks)
        ctx.fillStyle = "#38bdf8";
        for (let x = 35; x < 65; x += 10) {
          for (let y = 10; y < 90; y += 15) {
            if (Math.random() > 0.4) ctx.fillRect(x, y, 6, 6);
          }
        }
        ctx.fillStyle = "#10b981";
        ctx.fillRect(45, 45, 10, 10); // center target core
      }
    }
  }, [newCreatedInvoice, activeSubTab]);

  const addToCart = (prod: Product) => {
    if (prod.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === prod.id);
      if (existing) {
        return prev.map(item => item.id === prod.id ? { ...item, quantity: Math.min(prod.stock, item.quantity + 1), total: (Math.min(prod.stock, item.quantity + 1)) * prod.sellingPrice } : item);
      }
      return [...prev, { id: prod.id, name: prod.name, quantity: 1, price: prod.sellingPrice, total: prod.sellingPrice }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: qty, total: qty * item.price };
      }
      return item;
    }));
  };

  // Cart values calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalDue = Math.max(0, cartSubtotal - discount);
  const calculatedDueRemaining = Math.max(0, totalDue - paidAmount);

  const handleCreateInvoice = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!selectedCustomerId || cart.length === 0) return;

    const invoicePayload = {
      customerId: selectedCustomerId,
      customerName: currentCustomerObj?.name || "Walk-in Buyer",
      customerPhone: currentCustomerObj?.phone || "",
      items: cart,
      totalAmount: totalDue,
      discount: discount,
      paidAmount: paidAmount,
      dueAmount: calculatedDueRemaining,
      paymentStatus: (calculatedDueRemaining === 0 ? "Paid" : paidAmount > 0 ? "Partially Paid" : "Unpaid") as any,
      createdBy: "Md. Safir Uddin Titu"
    };

    const added = addInvoice(invoicePayload);
    setNewCreatedInvoice(added);
    setSuccessNote(language === "en" ? "Corporate Invoice printed and registered!" : "ইনভয়েস সফলভাবে তৈরি ও ক্যাশ মেমোতে লিপিবদ্ধ হয়েছে!");
    setCart([]);
    setDiscount(0);
    setPaidAmount(0);

    // Soft trigger OS thermal print engine
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn("Print dialog blocked or not supported by sandbox container", err);
      }
    }, 500);

    setTimeout(() => {
      setSuccessNote("");
    }, 6000);
  };

  // Filtering products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
    p.category.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-500" />
            {t.invoiceSystem}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Create digital estimates, cash memos, and POS receipts." : "দোকানের খদ্দেরের জন্য ক্যাশ মেমো, ইনভয়েস ও রসিদ তৈরির কেন্দ্র।"}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-semibold select-none">
          <button
            onClick={() => { setActiveSubTab("create"); setNewCreatedInvoice(null); }}
            className={`px-4 py-1.5 rounded-md font-bold transition ${activeSubTab === "create" ? "bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300" : "text-slate-500"}`}
          >
            New Invoice
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-4 py-1.5 rounded-md font-bold transition ${activeSubTab === "history" ? "bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300" : "text-slate-500"}`}
          >
            Invoice History
          </button>
        </div>
      </div>

      {successNote && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl flex items-center gap-3 animate-fade-in text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 animate-bounce" />
          <div className="flex-1">
            <p className="font-bold text-emerald-300">{successNote}</p>
            <p className="font-normal text-[10px] text-slate-400 mt-0.5">
              {language === "en" 
                ? "The invoice record has been stored and client balance updated." 
                : "ইনভয়েস ডাটাবেসে পিন করা হয়েছে এবং কাস্টমার হিসেব খাতা সমন্বয় করা হয়েছে।"}
            </p>
          </div>
        </div>
      )}

      {activeSubTab === "create" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Create Layout Panel (Products selection and Customer selector)  8-Columns */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Customer select box */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">SELECT CUSTOMER *</label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-850 dark:text-white font-medium"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.id === "cust-walkin" ? "(General Walk-in)" : `(${c.phone})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Products Board */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs space-y-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">ADD ITEMS FROM INVENTORY</span>
                <div className="relative w-44 sm:w-56">
                  <Search className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter products..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                  />
                </div>
              </div>

              {/* Items Scroll Tray */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredProducts.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => addToCart(p)}
                    className={`p-2.5 rounded-lg border border-slate-150 dark:border-slate-700 flex justify-between items-center cursor-pointer transition select-none ${p.stock <= 0 ? "opacity-50 pointer-events-none" : "hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"}`}
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">SKU: {p.sku} | Stock: {p.stock}</p>
                    </div>
                    <span className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 shrink-0">
                      {p.sellingPrice} Tk
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* POS CART details lists */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Shopping Basket</h3>

              {cart.length === 0 ? (
                <p className="text-center italic py-8 text-slate-400">Cart is empty. Click products from list above to add.</p>
              ) : (
                <div className="space-y-2.5">
                  {cart.map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                      <div className="w-1/2">
                        <p className="font-semibold text-slate-850 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.price} BDT each</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateCartQty(item.id, Number(e.target.value))}
                          className="w-12 text-center py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-bold font-mono"
                        />
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="font-bold font-mono text-slate-800 dark:text-white shrink-0 text-right w-20">
                        {item.total.toLocaleString()} Tk
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Invoice Receipt Preview Frame - 4 Columns */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Pricing Calc sheet Form */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs space-y-3.5">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Billing Receipt Ledger</h3>

              <div className="flex justify-between items-center text-slate-500 font-mono">
                <span>Basket Subtotal:</span>
                <span>{cartSubtotal.toLocaleString()} Tk</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Discount given (BDT)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Total Paid (BDT)</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg flex justify-between items-center font-bold">
                <span className="font-bold uppercase tracking-wide">Net Pay / Remaining Due:</span>
                <span className="text-sm font-mono text-rose-500 font-bold">{calculatedDueRemaining.toLocaleString()} Tk</span>
              </div>

              <button
                disabled={!selectedCustomerId || cart.length === 0}
                onClick={handleCreateInvoice}
                className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-lg shadow-md disabled:opacity-50 select-none cursor-pointer transition active:scale-95"
              >
                💾 print thermal & sync records
              </button>
            </div>

            {/* Generated Invoice Receipt view */}
            {newCreatedInvoice && (
              <div id="print-area" className="bg-white border border-slate-300 p-5 rounded-lg shadow-2xl text-slate-800 font-mono text-[11px] leading-relaxed relative print:max-w-full">
                
                {/* Print and Close Header Options */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5" id="print-action-bar">
                  <button 
                    onClick={() => {
                      try {
                        window.print();
                      } catch (err) {
                        alert("Print trigger blocked: Open this screen in a new tab if browser limits allow.");
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 hover:scale-103 font-bold text-white px-2 py-1 rounded-md text-[10px] flex items-center gap-1 transition-all"
                  >
                    <Printer className="w-3 h-3 text-white" />
                    Print Memo
                  </button>
                  <button 
                    onClick={() => setNewCreatedInvoice(null)} 
                    className="hover:bg-slate-100 p-1 rounded font-bold text-slate-500 text-xs text-center flex items-center justify-center w-6 h-6 border border-slate-250 bg-white"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Print Header */}
                <div className="text-center border-b border-dashed border-slate-400 pb-3">
                  <h3 className="font-extrabold text-sm tracking-widest">{settings.companyName}</h3>
                  <p className="text-[9px] uppercase tracking-tighter">Digital Service & IT Center</p>
                  <p className="text-[10px] font-sans mt-1">Address: {settings.address}</p>
                  <p className="text-[10px] mt-0.5">Mobile: {settings.mobile}</p>
                </div>

                {/* Audit meta details */}
                <div className="my-3 space-y-0.5 border-b border-dashed border-slate-400 pb-2.5">
                  <p>Order: {newCreatedInvoice.invoiceNumber}</p>
                  <p>Date: {newCreatedInvoice.createdAt.split("T")[0]}</p>
                  <p>To: {newCreatedInvoice.customerName}</p>
                  <p>Phone: {newCreatedInvoice.customerPhone}</p>
                </div>

                {/* Cart matrix */}
                <div className="space-y-1.5 mb-3.5 border-b border-dashed border-slate-400 pb-2.5">
                  <div className="grid grid-cols-4 font-bold border-b border-dashed border-slate-300 pb-1">
                    <span className="col-span-2">Item</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Price</span>
                  </div>
                  {newCreatedInvoice.items.map((item: any, id: number) => (
                    <div key={id} className="grid grid-cols-4">
                      <span className="col-span-2 truncate">{item.name}</span>
                      <span className="text-center">{item.quantity}</span>
                      <span className="text-right">{item.total.toLocaleString()} Tk</span>
                    </div>
                  ))}
                </div>

                {/* Summary block */}
                <div className="space-y-1 text-right mb-4">
                  <p>Discount given: {newCreatedInvoice.discount.toLocaleString()} Tk</p>
                  <p className="font-bold underline">Net Total: {newCreatedInvoice.totalAmount.toLocaleString()} Tk</p>
                  <p>Cash Rendered: {newCreatedInvoice.paidAmount.toLocaleString()} Tk</p>
                  <p className="font-bold text-rose-600">Credit Balance (Due): {newCreatedInvoice.dueAmount.toLocaleString()} Tk</p>
                </div>

                {/* Self Rendered local QR layout */}
                <div className="flex flex-col items-center justify-center pt-2.5 border-t border-dashed border-slate-400">
                  <canvas ref={qrCanvasRef} width="100" height="100" className="w-20 h-20 rounded shadow-inner" />
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1.5 font-sans">Authorized QR Core receipt</p>
                </div>

                <div className="text-center mt-4 text-[9px]">
                  <p>Thank you for choosing R N Enterprise!</p>
                  <p>Software Powered by Google Workspace Container</p>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Invoice History Sub Tab 12-Columns */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm text-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-mono font-bold tracking-widest uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Receipt Order</th>
                  <th className="px-5 py-3">Customer Profile</th>
                  <th className="px-5 py-3">Items Purchased</th>
                  <th className="px-5 py-3 text-right">Invoice Sum</th>
                  <th className="px-5 py-3 text-right">Cash Received</th>
                  <th className="px-5 py-3 text-right">Credit Balance</th>
                  <th className="px-5 py-3 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-sans text-slate-700 dark:text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/15 transition">
                    <td className="px-5 py-3 font-mono font-bold">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-800 dark:text-white">{inv.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{inv.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-500 dark:text-slate-400">
                      {inv.items.length} items
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold">{inv.totalAmount.toLocaleString()} Tk</td>
                    <td className="px-5 py-3 text-right font-mono text-emerald-500">{inv.paidAmount.toLocaleString()} Tk</td>
                    <td className="px-5 py-3 text-right font-mono text-rose-500 hover:underline cursor-pointer">{inv.dueAmount.toLocaleString()} Tk</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-lg font-bold font-mono uppercase text-[9px] ${
                        inv.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                        inv.paymentStatus === "Partially Paid" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                        "bg-rose-550/10 text-rose-500 bg-rose-50 text-rose-700"
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invoices.length === 0 && (
            <p className="italic text-center py-10 text-slate-400">
              No historical billing receipts on record.
            </p>
          )}
        </div>
      )}

    </div>
  );
};
