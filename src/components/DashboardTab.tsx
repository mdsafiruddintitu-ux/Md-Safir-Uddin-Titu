/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, Users, 
  Package, Link, RefreshCw, AlertTriangle, Phone, ExternalLink 
} from "lucide-react";

export const DashboardTab: React.FC = () => {
  const { 
    language, accounting, customers, products, mfsTransactions, 
    projects, websiteLinks, syncWithCloud, isSyncing 
  } = useApp();
  
  const t = TRANSLATIONS[language];
  const todayStr = "2026-06-13"; // Seed current time anchor

  // Metrics processing
  const dailyIncome = accounting
    .filter(log => log.type === "income" && log.date === todayStr)
    .reduce((sum, item) => sum + item.amount, 0);

  const dailyExpense = accounting
    .filter(log => log.type === "expense" && log.date === todayStr)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = accounting
    .filter(log => log.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = accounting
    .filter(log => log.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalProfit = totalIncome - totalExpense;

  const totalDue = customers.reduce((sum, c) => sum + c.dueAmount, 0);

  // Stock alarm triggers
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  // Weekly analysis points for custom trend visualization
  const last6Days = ["06-08", "06-09", "06-10", "06-11", "06-12", "06-13"];
  const trendIncome = [800, 1500, 1200, 2200, 2900, dailyIncome || 1850];
  const trendExpense = [300, 450, 200, 800, 650, dailyExpense || 450];

  return (
    <div className="space-y-6">
      
      {/* Title block with trigger button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100">
            {language === "en" ? "Business Control Hub" : "ব্যবস্থাপনা নিয়ন্ত্রণ কেন্দ্র"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Real-time ledger audit: " : "আজকের লাইভ হিসাব খাতা: "} {todayStr} (13th June 2026)
          </p>
        </div>
        
        <button
          onClick={syncWithCloud}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-md shadow-teal-500/10 active:scale-95 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? t.syncing || "Syncing Cloud..." : t.backupGoogleDrive}</span>
        </button>
      </div>

      {/* Main KPI Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Income */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.dailyIncome}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {dailyIncome.toLocaleString()} 
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">BDT</span>
          </div>
          <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-0.5 mt-1.5">
            <span>+18.3%</span>
            <span>{language === "en" ? "since yesterday" : "গতকাল থেকে বৃদ্ধি"}</span>
          </p>
        </div>

        {/* Card 2: Today's Expenses */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.dailyExpense}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {dailyExpense.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">BDT</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-0.5 mt-1.5">
            <span>{language === "en" ? "Standard office cost" : "অফিস পরিচালন খরচ"}</span>
          </p>
        </div>

        {/* Card 3: Total Profit */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.totalProfit}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {totalProfit.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">BDT</span>
          </div>
          <p className="text-[10px] text-teal-500 font-mono mt-1.5 flex items-center gap-1">
            <span className="bg-teal-500/10 py-0.5 px-1.5 rounded text-teal-600 dark:text-teal-400">
              {language === "en" ? "Healthy Margin" : "লাভজনক সূচক"}
            </span>
          </p>
        </div>

        {/* Card 4: Due Account Balance */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.dueAmount}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {totalDue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">BDT</span>
          </div>
          <p className="text-[10px] text-rose-500 font-mono mt-1.5">
            {language === "en" ? "Needs due reminders" : "তাগিদ বার্তা পাঠানো প্রয়োজন"}
          </p>
        </div>

      </div>

      {/* Main Secondary Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Graph Area */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-3 bg-teal-500 rounded" />
              {t.financialHealth}
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400">{t.income}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-rose-500" />
                <span className="text-slate-500 dark:text-slate-400">{t.expense}</span>
              </div>
            </div>
          </div>

          {/* SVG Custom Render Graph */}
          <div className="w-full h-56 bg-gradient-to-t from-slate-50/70 to-white dark:from-slate-900/40 dark:to-slate-850 p-2 rounded-lg relative flex flex-col justify-end">
            <svg viewBox="0 0 540 180" className="w-full h-[140px] overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="140" x2="540" y2="140" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <line x1="0" y1="90" x2="540" y2="90" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <line x1="0" y1="40" x2="540" y2="40" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.5" className="dark:stroke-slate-700" />

              {/* INCOME POLYLINE */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,140 110,100 210,115 310,65 410,40 510,60"
              />
              {/* EXPENSE POLYLINE */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,150 110,140 210,148 310,115 410,122 510,118"
              />

              {/* Dots on nodes */}
              <circle cx="510" cy="60" r="4.5" fill="#10b981" />
              <circle cx="510" cy="118" r="4.5" fill="#f43f5e" />
            </svg>
            
            {/* Custom SVG Labels */}
            <div className="flex justify-between items-center px-2 text-[9px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 shrink-0">
              {last6Days.map((day, idx) => (
                <span key={idx} className="w-16 text-center">{day} (Jun)</span>
              ))}
            </div>
          </div>
        </div>

        {/* Counters & Fast Stats */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.allModuleCounts}</h3>
            
            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-teal-500/10 flex items-center justify-center text-teal-500">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{t.activeCustomers}</span>
                </div>
                <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">{customers.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Link className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{t.activeServices}</span>
                </div>
                <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">{websiteLinks.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Items in Stock</span>
                </div>
                <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">{products.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">IT Ventures</span>
                </div>
                <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">{projects.length}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
            <div className="text-[10px]">
              <p className="font-bold text-slate-700 dark:text-slate-300">Md. Safir Uddin Titu</p>
              <p className="text-slate-400 font-mono text-[9px]">{language === "en" ? "MD & Principal" : "পরিচালক ও স্বত্বাধিকারী"}</p>
            </div>
            <a
              href="tel:01824234587"
              className="flex items-center gap-1.5 py-1 px-2.5 bg-teal-500 hover:bg-teal-600 text-[10px] font-bold text-white rounded transition shadow-sm"
            >
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </a>
          </div>
        </div>

      </div>

      {/* Grid Bottom: Low Stock Monitor / Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Tracker */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {t.lowStock}
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded">
              {lowStockItems.length} Warnings
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              {language === "en" ? "All product stock levels are healthy!" : "সব পণ্যের পর্যাপ্ত স্টক রয়েছে!"}
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-48 overflow-y-auto pr-1">
              {lowStockItems.map((prod) => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{prod.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">SKU: {prod.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-500 font-mono">{prod.stock} / {prod.minStock}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-tighter">In Store</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Cash Log Feed */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            {t.recentTransactions}
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {accounting.slice(0, 4).map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 transition hover:bg-slate-100/60 dark:hover:bg-slate-900"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.description}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{log.date} · {log.category}</p>
                </div>
                <div className={`text-right text-xs font-bold font-mono ${log.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                  {log.type === "income" ? "+" : "-"} {log.amount} Tk
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
