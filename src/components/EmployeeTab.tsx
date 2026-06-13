/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { CheckSquare, Plus, Trash2, Calendar, UserCheck } from "lucide-react";

export const EmployeeTab: React.FC = () => {
  const { language, employees, addEmployee, updateEmployee, deleteEmployee, markAttendance } = useApp();
  const t = TRANSLATIONS[language];

  const todayStr = "2026-06-13"; // Seed current time anchor

  const [showAddForm, setShowAddForm] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empRole, setEmpRole] = useState("Digital Portal Operator");
  const [empSalary, setEmpSalary] = useState("");
  const [toast, setToast] = useState("");

  const handleAddNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empPhone || !empSalary) return;

    addEmployee({
      name: empName,
      phone: empPhone,
      designation: empRole,
      salary: Number(empSalary)
    });

    setToast(language === "en" ? "Employee profile registered!" : "কর্মচারী সফলভাবে যুক্ত হয়েছে!");
    setTimeout(() => {
      setToast("");
      setEmpName("");
      setEmpPhone("");
      setEmpSalary("");
      setShowAddForm(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-400" />
            {t.employeeManagement}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Monitor staff Attendance logs, salaries, performance and roster indices." : "কর্মচারীদের দৈনিক উপস্থিতি, কাজের বিবরণ ও বেতন ওভারভিউ খাতা।"}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-500/10 hover:bg-slate-850 dark:hover:bg-teal-500/20 text-teal-300 font-bold px-4 py-2 border border-slate-800 dark:border-teal-500/20 rounded-lg text-xs shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addEmployee}</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-slate-900 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300 text-center font-bold text-xs rounded-lg animate-pulse">
          {toast}
        </div>
      )}

      {/* Pop up form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{t.addEmployee}</h3>
          
          <form onSubmit={handleAddNewEmployee} className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sajib Sen"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Mobile number *</label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={empPhone}
                onChange={(e) => setEmpPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Designation Role</label>
              <input
                type="text"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Monthly Salary (Tk) *</label>
              <input
                type="number"
                required
                placeholder="Monthly Wages in BDT"
                value={empSalary}
                onChange={(e) => setEmpSalary(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
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
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Marker sheet - 2 Columns */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span>Attends Sheet: Today ({todayStr})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">13th June 2026</span>
          </div>

          <div className="space-y-3.5">
            {employees.map(emp => {
              const currentStatus = emp.attendance[todayStr] || "Not Marked";
              return (
                <div 
                  key={emp.id} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-xs gap-3"
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{emp.designation}</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Status badges */}
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase ${
                      currentStatus === "Present" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" :
                      currentStatus === "Absent" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400" :
                      currentStatus === "Late" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {currentStatus}
                    </span>

                    {/* Controls */}
                    <div className="flex bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-750 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => markAttendance(emp.id, todayStr, "Present")}
                        className="py-1 px-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-emerald-500 rounded font-bold"
                      >
                        P
                      </button>
                      <button
                        onClick={() => markAttendance(emp.id, todayStr, "Late")}
                        className="py-1 px-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-500 rounded font-bold"
                      >
                        L
                      </button>
                      <button
                        onClick={() => markAttendance(emp.id, todayStr, "Absent")}
                        className="py-1 px-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-rose-500 rounded font-bold"
                      >
                        A
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Salaries ledger directory - 1 Column */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Payroll sheet</span>
            </h3>

            <div className="mt-4 space-y-3.5 divide-y divide-slate-100 dark:divide-slate-700">
              {employees.map(emp => (
                <div key={emp.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{emp.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">{emp.phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-indigo-500 font-mono">{emp.salary.toLocaleString()} Tk</p>
                    <button 
                      onClick={() => deleteEmployee(emp.id)}
                      className="text-[10px] text-slate-300 hover:text-rose-500 hover:underline font-mono"
                    >
                      Remove card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {employees.length === 0 && (
            <p className="text-center italic py-20 text-slate-400 text-xs">No employees profile currently setup.</p>
          )}
        </div>

      </div>

    </div>
  );
};
