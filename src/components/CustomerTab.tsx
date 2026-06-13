/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, Customer } from "../types";
import { Users, Plus, Star, Search, Trash2, Phone, DollarSign, Send, CheckCircle2 } from "lucide-react";

export const CustomerTab: React.FC = () => {
  const { 
    language, customers, addCustomer, updateCustomer, deleteCustomer, 
    recordDuePayment, addAccountingLog, settings 
  } = useApp();
  
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeLedgerCustomer, setActiveLedgerCustomer] = useState<Customer | null>(null);

  // New customer parameters
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Payment collection inputs
  const [collectionAmount, setCollectionAmount] = useState("");
  const [toastNote, setToastNote] = useState("");

  const handleAddNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    addCustomer({
      name: newName,
      phone: newPhone,
      address: newAddress || "Sunamganj Sadar",
      email: newEmail
    });

    setToastNote(language === "en" ? "Customer Profile Created" : "নতুন গ্রাহক প্রোফাইল তৈরি হয়েছে!");
    setTimeout(() => {
      setToastNote("");
      setNewName("");
      setNewPhone("");
      setNewAddress("");
      setNewEmail("");
      setShowAddForm(false);
    }, 1500);
  };

  const handleCollectDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLedgerCustomer || !collectionAmount) return;

    const amt = Number(collectionAmount);
    
    // 1. Update customer profile ledger
    recordDuePayment(activeLedgerCustomer.id, amt, true);

    // 2. Add accounting cash book income log
    addAccountingLog({
      type: "income",
      amount: amt,
      category: "Digital Services",
      description: `Due payment received from ${activeLedgerCustomer.name}`,
      date: new Date().toISOString().split("T")[0]
    });

    setToastNote(language === "en" ? "Received Payment & Updated Ledger!" : "সফলভাবে বকেয়া জমা গ্রহণ করা হয়েছে!");
    setCollectionAmount("");
    
    // Refresh local object binding
    const updated = customers.find(c => c.id === activeLedgerCustomer.id);
    if (updated) {
      setActiveLedgerCustomer({ ...updated, dueAmount: Math.max(0, updated.dueAmount - amt) });
    }

    setTimeout(() => {
      setToastNote("");
    }, 1500);
  };

  const dispatchWhatsAppReminder = (cust: Customer) => {
    const textMessage = `${settings.whatsappMessage}: ${cust.dueAmount} BDT. Please complete via bKash/Nagad/Rocket on ${settings.bkashNumber}. Thank you - R N Enterprise.`;
    const formattedUrl = `https://wa.me/88${cust.phone}?text=${encodeURIComponent(textMessage)}`;
    window.open(formattedUrl, "_blank");
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) || 
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            {t.customerManagement}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Manage corporate contacts, credit limits, and due ledger accounts." : "গ্রাহকদের নাম, মোবাইল নাম্বার, স্থায়ী ঠিকানা এবং বকেয়া আদায়ের খাতা।"}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-500/10 hover:bg-slate-800 dark:hover:bg-teal-500/20 text-teal-300 font-bold px-4 py-2 border border-slate-800 dark:border-teal-500/20 rounded-lg text-xs shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addCustomer}</span>
        </button>
      </div>

      {toastNote && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center font-bold text-xs rounded-lg flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{toastNote}</span>
        </div>
      )}

      {/* Insert and Setup Form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3.5">{t.addCustomer}</h3>
          
          <form onSubmit={handleAddNewCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Abdur Rahman"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Mobile Contact *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 01824XXXXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Address Location</label>
              <input
                type="text"
                placeholder="e.g. Nutonpara, Biswambarpur"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="e.g. support@rne.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-md shadow-sm"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Dual Module Layout: Ledger & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left lists search directory */}
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
            />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[460px] overflow-y-auto">
            {filteredCustomers.map(cust => (
              <div 
                key={cust.id} 
                onClick={() => setActiveLedgerCustomer(cust)}
                className={`p-3 rounded-lg flex items-center justify-between text-xs cursor-pointer transition select-none ${
                  activeLedgerCustomer?.id === cust.id 
                    ? "bg-slate-900 text-white dark:bg-teal-500/10 dark:text-teal-300 border-l-4 border-teal-400 pl-2" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{cust.name}</h4>
                  <p className="text-slate-400 dark:text-slate-400 font-mono text-[10px] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 hover:text-teal-400" />
                    <span>{cust.phone}</span>
                    <span>· {cust.address}</span>
                  </p>
                </div>

                <div className="text-right">
                  {cust.dueAmount > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 font-bold font-mono rounded">
                      Due: {cust.dueAmount} BDT
                    </span>
                  ) : cust.advanceAmount > 0 ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold font-mono rounded">
                      Adv: {cust.advanceAmount} BDT
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">Paid (Clear)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right ledger detailed audit panel */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          {activeLedgerCustomer ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">{activeLedgerCustomer.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono">{activeLedgerCustomer.address}</p>
              </div>

              {/* Outstanding metrics */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-lg flex items-center justify-between font-mono">
                <div>
                  <p className="text-[10px] text-slate-400 tracking-wider uppercase">LEDGER STATUS</p>
                  <p className={`text-lg font-bold mt-1 ${activeLedgerCustomer.dueAmount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                    {activeLedgerCustomer.dueAmount > 0 ? `${activeLedgerCustomer.dueAmount} Tk` : "0 BDT Due"}
                  </p>
                </div>
                
                {activeLedgerCustomer.dueAmount > 0 && (
                  <button
                    onClick={() => dispatchWhatsAppReminder(activeLedgerCustomer)}
                    className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-[10px] rounded-lg shadow-xs transition"
                  >
                    <Send className="w-3 h-3 text-white" />
                    <span>WhatsApp</span>
                  </button>
                )}
              </div>

              {/* Bill Payment Form */}
              {activeLedgerCustomer.dueAmount > 0 ? (
                <form onSubmit={handleCollectDue} className="space-y-3.5 text-xs bg-white dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{t.dueCollection}</h4>
                  
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Payment Received (Tk) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Amount in BDT"
                      value={collectionAmount}
                      onChange={(e) => setCollectionAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md transition"
                  >
                    {t.collect} Due Cash
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-center text-xs italic">
                  This card account has zero pending obligations!
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                <button
                  onClick={() => deleteCustomer(activeLedgerCustomer.id)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  Delete customer
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 italic text-xs">
              Select any customer card from the directory to review audit history, payment collections, or trigger SMS notices.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
