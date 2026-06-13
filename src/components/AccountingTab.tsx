/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { Calculator, Plus, Trash2, Printer, Download, Search, CheckCircle2 } from "lucide-react";

export const AccountingTab: React.FC = () => {
  const { language, accounting, addAccountingLog, deleteAccountingLog } = useApp();
  const t = TRANSLATIONS[language];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New transaction attributes
  const [newType, setNewType] = useState<"income" | "expense">("income");
  const [newAmount, setNewAmount] = useState("");
  const [newCat, setNewCat] = useState("Digital Services");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("2026-06-13");
  const [successNote, setSuccessNote] = useState("");

  const categories = {
    income: ["Digital Services", "Hardware Sales", "MFS Commission", "IT Projects", "Other Sales"],
    expense: ["Office Rent", "Utility Bills", "Salary payout", "Office Stationary", "Refreshments", "Miscellaneous"]
  };

  const currentCats = newType === "income" ? categories.income : categories.expense;

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newCat) return;

    addAccountingLog({
      type: newType,
      amount: Number(newAmount),
      category: newCat,
      description: newDesc || `${newType} Ledger Entry`,
      date: newDate
    });

    setSuccessNote(language === "en" ? "Ledger entry updated!" : "হিসাব খাতায় এন্ট্রি সফল হয়েছে!");
    setTimeout(() => {
      setSuccessNote("");
      setNewAmount("");
      setNewDesc("");
      setShowAddForm(false);
    }, 1200);
  };

  const triggerExportCsv = () => {
    // Basic CSV compiler
    const headers = "Date,Type,Category,Description,Amount (Tk)\n";
    const body = accounting.map(l => 
      `"${l.date}","${l.type}","${l.category}","${l.description.replace(/"/g, '""')}",${l.amount}`
    ).join("\n");
    
    const blob = new Blob([headers + body], { type: "text/csv;charset=utf-8;" });
    const u = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = u;
    link.setAttribute("download", `RN_Enterprise_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrintLedger = () => {
    window.print();
  };

  // Processing metrics
  const totalIn = accounting.filter(l => l.type === "income").reduce((s, x) => s + x.amount, 0);
  const totalOut = accounting.filter(l => l.type === "expense").reduce((s, x) => s + x.amount, 0);
  const netEarnings = totalIn - totalOut;

  const filteredLogs = accounting.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-500" />
            {t.shopAccounting}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Corporate Cash Book, Ledger Journals and Profitability." : "দোকানের সকল প্রকার দৈনিক আয়-ব্যয় এবং লাভ-লোকসানের হিসাব খাতা।"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerExportCsv}
            className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-3 py-2 rounded-lg text-xs transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel Export</span>
          </button>

          <button
            onClick={triggerPrintLedger}
            className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-3 py-2 rounded-lg text-xs transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ledger</span>
          </button>

          <button
            onClick={() => { setShowAddForm(!showAddForm); if (currentCats.length > 0) setNewCat(currentCats[0]); }}
            className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addLog}</span>
          </button>
        </div>
      </div>

      {/* Accounting Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === "en" ? "Cash Inflow" : "মোট জমা"}</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{totalIn.toLocaleString()} <span className="text-xs text-slate-400">BDT</span></p>
        </div>

        <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === "en" ? "Cash Outflow" : "মোট খরচ"}</p>
          <p className="text-2xl font-bold text-rose-500 mt-1">{totalOut.toLocaleString()} <span className="text-xs text-slate-400">BDT</span></p>
        </div>

        <div className="bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === "en" ? "Net Retained Profit" : "নিট লাভ"}</p>
          <p className={`text-2xl font-bold mt-1 ${netEarnings >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {netEarnings.toLocaleString()} <span className="text-xs text-slate-400">BDT</span>
          </p>
        </div>
      </div>

      {/* Add popup */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">{t.addLog}</h3>
          
          {successNote ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-center flex items-center justify-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successNote}</span>
            </div>
          ) : (
            <form onSubmit={handleCreateLog} className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => {
                    const selected = e.target.value as "income" | "expense";
                    setNewType(selected);
                    setNewCat(selected === "income" ? categories.income[0] : categories.expense[0]);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="income">Income (জমা)</option>
                  <option value="expense">Expense (খরচ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">BDT Amount *</label>
                <input
                  type="number"
                  required
                  placeholder="Tk"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg animate-fade-in"
                >
                  {currentCats.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paid internet fee"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Transaction Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div className="md:col-span-12 flex items-center justify-end gap-2 mt-1">
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
                  Post to Ledger
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 grow max-w-sm">
          <button
            onClick={() => setFilterType("all")}
            className={`flex-1 py-1.5 text-center rounded-md font-bold select-none transition ${filterType === "all" ? "bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300" : "text-slate-500"}`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`flex-1 py-1.5 text-center rounded-md font-bold select-none transition ${filterType === "income" ? "bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300" : "text-slate-500"}`}
          >
            Incomes (জমা)
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`flex-1 py-1.5 text-center rounded-md font-bold select-none transition ${filterType === "expense" ? "bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300" : "text-slate-500"}`}
          >
            Expenses (খরচ)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Ledger lists Table */}
      <div id="print-area" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-bold tracking-wider font-mono">
              <tr>
                <th className="px-5 py-3.5">{t.date}</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">{t.category}</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                  <td className="px-5 py-3 font-mono">{log.date}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase ${
                      log.type === "income" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">{log.category}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 truncate max-w-xs">{log.description}</td>
                  <td className={`px-5 py-3 text-right font-bold font-mono ${log.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                    {log.amount.toLocaleString()} Tk
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => deleteAccountingLog(log.id)}
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

        {filteredLogs.length === 0 && (
          <p className="text-xs italic text-center text-slate-400 py-10 font-sans">
            No entries found matching filters.
          </p>
        )}
      </div>

    </div>
  );
};
