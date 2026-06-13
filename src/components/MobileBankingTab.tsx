/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { Smartphone, Plus, Trash2, Search, CheckCircle2 } from "lucide-react";

export const MobileBankingTab: React.FC = () => {
  const { language, mfsTransactions, addMfsTransaction, deleteMfsTransaction, settings } = useApp();
  const t = TRANSLATIONS[language];

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Transaction form parameters
  const [channel, setChannel] = useState<"bKash" | "Nagad" | "Rocket">("bKash");
  const [type, setType] = useState<"Cash In" | "Cash Out" | "Send Money" | "Bill Pay">("Cash In");
  const [amount, setAmount] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [status, setStatus] = useState<"Success" | "Pending" | "Failed">("Success");
  const [toast, setToast] = useState("");

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !customerPhone || !trxId) return;

    // Agent fees math: 1.85% roughly for cash-outs, or fixed cash-in reward structures
    const isCashOut = type === "Cash Out";
    const calculatedFee = isCashOut ? Number(amount) * 0.0185 : 5;

    addMfsTransaction({
      channel,
      type,
      amount: Number(amount),
      fee: calculatedFee,
      customerPhone,
      trxId,
      status
    });

    setToast(language === "en" ? "MFS Agent Transaction logged!" : "মোবাইল ব্যাংকিং লেনদেন সফলভাবে যুক্ত হয়েছে!");
    setTimeout(() => {
      setToast("");
      setAmount("");
      setCustomerPhone("");
      setTrxId("");
      setShowAddForm(false);
    }, 1300);
  };

  const filteredTxs = mfsTransactions.filter(tx => 
    tx.trxId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.customerPhone.includes(searchTerm) || 
    tx.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-teal-500" />
            {t.mobileBanking}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Manage bKash, Nagad, and Rocket agent accounts and cash settlements." : "বিকাশ, রকেট, নগদ ক্যাশ-ইন ও ক্যাশ-আউট এজেন্টের হিসাব খাতা।"}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-500/10 hover:bg-slate-850 dark:hover:bg-teal-500/20 text-teal-300 font-bold px-4 py-2 border border-slate-800 dark:border-teal-500/20 rounded-lg text-xs shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New MFS Entry</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center font-bold text-xs rounded-lg flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}

      {/* Dynamic Popout Form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Post Agency MFS Ticket</h3>
          
          <form onSubmit={handleCreateTx} className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Channel Gateway</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              >
                <option value="bKash">bKash (বিকাশ)</option>
                <option value="Nagad">Nagad (নগদ)</option>
                <option value="Rocket">Rocket (রকেট)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Transfer Action</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="Cash In">Cash In (গ্রাহককে প্রদান)</option>
                <option value="Cash Out">Cash Out (গ্রাহক থেকে গ্রহণ)</option>
                <option value="Send Money">Send Money (টাকা পাঠানো)</option>
                <option value="Bill Pay">Utility Bill Pay</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Amount in BDT *</label>
              <input
                type="number"
                required
                placeholder="Tk Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Client Mobile *</label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Dispute Reference (TrxID) *</label>
              <input
                type="text"
                required
                placeholder="e.g. BX610PZX9"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono tracking-widest uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Verification Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="Success">Success (সফল)</option>
                <option value="Pending">Pending (অপেক্ষমান)</option>
                <option value="Failed">Failed (ব্যর্থ)</option>
              </select>
            </div>

            <div className="md:col-span-6 flex items-center justify-end gap-2 mt-1">
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
                Log MFS Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-sm justify-between items-center text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search TrxID, mobile range, or channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-850 dark:text-white"
          />
        </div>
        
        <div className="hidden sm:flex items-center gap-3.5 text-slate-500 font-mono text-[10px] uppercase font-bold">
          <span>{language === "en" ? "bKash: " : "বিকাশ: "} {settings.bkashNumber}</span>
          <span>{language === "en" ? "Nagad: " : "নগদ: "} {settings.nagadNumber}</span>
        </div>
      </div>

      {/* Transaction Log Lists */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-mono font-bold tracking-widest uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Gateway</th>
                <th className="px-5 py-3.5">Transaction Type</th>
                <th className="px-5 py-3.5">Mobile Contact</th>
                <th className="px-5 py-3.5">Dispute TrxID</th>
                <th className="px-5 py-3.5 text-right">Commission Share</th>
                <th className="px-5 py-3.5 text-right">Transfer Total</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-sans text-slate-700 dark:text-slate-300">
              {filteredTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/15 transition">
                  <td className="px-5 py-3 font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      tx.channel === "bKash" ? "bg-pink-500" :
                      tx.channel === "Nagad" ? "bg-orange-500" : "bg-indigo-500"
                    }`} />
                    <span>{tx.channel}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white">{tx.type}</td>
                  <td className="px-5 py-3 font-mono">{tx.customerPhone}</td>
                  <td className="px-5 py-3 font-mono tracking-wide uppercase font-bold text-slate-600 dark:text-slate-200">{tx.trxId}</td>
                  <td className="px-5 py-3 text-right font-mono text-emerald-500">+{tx.fee.toFixed(1)} Tk</td>
                  <td className="px-5 py-3 text-right font-mono font-bold">{tx.amount.toLocaleString()} Tk</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase ${
                      tx.status === "Success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                      tx.status === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-450"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => deleteMfsTransaction(tx.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-500/5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTxs.length === 0 && (
          <p className="italic text-center py-10 text-slate-400">
            No mobile banking statement records available.
          </p>
        )}
      </div>

    </div>
  );
};
