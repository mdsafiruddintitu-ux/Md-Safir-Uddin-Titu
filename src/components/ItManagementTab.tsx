/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { Landmark, Plus, Trash2, ShieldAlert, CheckCircle2, DollarSign } from "lucide-react";

export const ItManagementTab: React.FC = () => {
  const { language, projects, addProject, updateProject, deleteProject, addAccountingLog } = useApp();
  const t = TRANSLATIONS[language];

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [projType, setProjType] = useState<"Website" | "Mobile App" | "Domain/Hosting" | "IT Consult">("Website");
  const [status, setStatus] = useState<"Quoted" | "In Progress" | "Completed" | "On Hold">("In Progress");
  const [cost, setCost] = useState("");
  const [paid, setPaid] = useState("");
  const [deadline, setDeadline] = useState("2026-07-30");
  const [toastAlert, setToastAlert] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !cost || !paid) return;

    addProject({
      title,
      clientName,
      clientContact,
      type: projType,
      status,
      cost: Number(cost),
      paid: Number(paid),
      deadline
    });

    setToastAlert(language === "en" ? "IT Project records logged!" : "আইটি প্রজেক্ট সফলভাবে যুক্ত হয়েছে!");
    setTimeout(() => {
      setToastAlert("");
      setTitle("");
      setClientName("");
      setClientContact("");
      setCost("");
      setPaid("");
      setShowAddForm(false);
    }, 1200);
  };

  const incrementPaidProjectCash = (id: string, currentCost: number, currentPaid: number, extraPaid: number) => {
    const freshPaidSum = Math.min(currentCost, currentPaid + extraPaid);
    updateProject(id, { paid: freshPaidSum });

    addAccountingLog({
      type: "income",
      amount: extraPaid,
      category: "IT Projects",
      description: `IT Project installment cash from client`,
      date: new Date().toISOString().split("T")[0]
    });

    setToastAlert(`Registered client payment of +${extraPaid} BDT. Ledger synched!`);
    setTimeout(() => setToastAlert(""), 1500);
  };

  const toggleProjectStatus = (id: string, s: "Quoted" | "In Progress" | "Completed" | "On Hold") => {
    updateProject(id, { status: s });
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-teal-400" />
            {t.itServices}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Software milestones, domain and premium hosting renewals boards." : "অনলাইন ই-কমার্স সাইট, স্কুল ম্যানেজমেন্ট ও ডোমেন হোস্টিং প্রজেক্ট ট্র্যাকিং।"}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-500/10 hover:bg-slate-850 dark:hover:bg-teal-500/20 text-teal-300 font-bold px-4 py-2 border border-slate-800 dark:border-teal-500/20 rounded-lg text-xs shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addProject}</span>
        </button>
      </div>

      {toastAlert && (
        <div className="p-3.5 bg-slate-900 border border-slate-800 text-teal-300 dark:bg-emerald-500/10 dark:text-emerald-400 text-center font-bold font-mono rounded-lg animate-pulse">
          {toastAlert}
        </div>
      )}

      {/* Pop form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{t.addProject}</h3>
          
          <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Project Milestone Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Union website redesign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Client Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chowdhury Fish Traders"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Client Contact *</label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Development Class</label>
              <select
                value={projType}
                onChange={(e) => setProjType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="Website">Website Development</option>
                <option value="Mobile App">Mobile Application</option>
                <option value="Domain/Hosting">Domain Renewal Roster</option>
                <option value="IT Consult">Advisory IT Consult</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Contract Value (Tk) *</label>
              <input
                type="number"
                required
                placeholder="Total price in BDT"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Amount Paid Initial *</label>
              <input
                type="number"
                required
                placeholder="Advance paid in BDT"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Project Deadline Schedule</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Development Phase</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="Quoted">Quoted Estimations</option>
                <option value="In Progress">Active Execution</option>
                <option value="Completed">Handover Clear</option>
                <option value="On Hold">Hold</option>
              </select>
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
                Launch Venture
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const dueRemain = Math.max(0, proj.cost - proj.paid);
          return (
            <div 
              key={proj.id} 
              className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/60 font-bold font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    {proj.type}
                  </span>

                  <select
                    value={proj.status}
                    onChange={(e) => toggleProjectStatus(proj.id, e.target.value as any)}
                    className={`font-semibold text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 p-1 rounded font-bold ${
                      proj.status === "Completed" ? "text-emerald-500" :
                      proj.status === "In Progress" ? "text-amber-500" : "text-rose-500"
                    }`}
                  >
                    <option value="Quoted">Quoted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <h3 className="text-sm font-bold text-slate-850 dark:text-white leading-tight">{proj.title}</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">Client: {proj.clientName} ({proj.clientContact})</p>

                {/* Costs balances bar */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800 m-3 space-y-1 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Valuation total:</span>
                    <span>{proj.cost.toLocaleString()} Tk</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-emerald-500 font-bold">
                    <span>Amount Paid:</span>
                    <span>{proj.paid.toLocaleString()} Tk</span>
                  </div>
                  {dueRemain > 0 && (
                    <div className="flex justify-between items-center text-[10px] text-rose-500 font-bold border-t border-dashed border-slate-200 dark:border-slate-750 pt-1">
                      <span>Milestones balances (Due):</span>
                      <span>{dueRemain.toLocaleString()} Tk</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Installments triggers */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2.5">
                {dueRemain > 0 ? (
                  <button
                    onClick={() => incrementPaidProjectCash(proj.id, proj.cost, proj.paid, 5000)}
                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-white rounded text-[10px] transition font-mono flex items-center justify-center gap-1 shadow-sm uppercase shrink-0"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Pay 5000 Tk installment</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded inline-block">
                    ✓ Full clean contract settle
                  </span>
                )}

                <button
                  onClick={() => deleteProject(proj.id)}
                  className="text-slate-300 hover:text-rose-500 p-1.5 rounded hover:bg-rose-500/5 transition select-none cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
