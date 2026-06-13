/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { 
  LayoutDashboard, Laptop, BookOpen, Calculator, Users, 
  Receipt, Smartphone, Package, CheckSquare, FileText, 
  Settings, Globe, Moon, Sun, ShieldAlert, Wifi, Phone, Landmark
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, darkMode, setDarkMode, isSyncing } = useApp();
  const t = TRANSLATIONS[language];

  const menuItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "digital", label: t.digitalServices, icon: Laptop },
    { id: "links", label: t.serviceDirectory, icon: BookOpen },
    { id: "accounting", label: t.shopAccounting, icon: Calculator },
    { id: "customers", label: t.customerManagement, icon: Users },
    { id: "invoices", label: t.invoiceSystem, icon: Receipt },
    { id: "banking", label: t.mobileBanking, icon: Smartphone },
    { id: "inventory", label: t.inventory, icon: Package },
    { id: "employees", label: t.employeeManagement, icon: CheckSquare },
    { id: "documents", label: t.documentCenter, icon: FileText },
    { id: "it", label: t.itServices, icon: Landmark },
    { id: "admin", label: t.adminPanel, icon: Settings },
  ];

  return (
    <aside id="app-sidebar" className="w-68 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300 select-none shrink-0 sticky top-0">
      {/* Branding Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/10">
            RN
          </div>
          <div>
            <h1 className="text-md font-bold leading-tight tracking-tight text-white">
              R N Enterprise
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
              IT Service Center
            </p>
          </div>
        </div>
      </div>

      {/* Operator Status Indicator */}
      <div className="mx-4 mb-2 px-3 py-1.5 bg-slate-950/40 rounded-lg border border-slate-800 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? "bg-amber-400 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"}`} />
          <span>{isSyncing ? "Auto Syncing" : "Cloud Active"}</span>
        </div>
        <div className="text-slate-500 hover:text-indigo-400 cursor-help flex items-center gap-0.5">
          <Wifi className="w-3.5 h-3.5" />
          <span>Offline OK</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 transition-all duration-150 relative ${
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-600 rounded-r-md font-semibold pl-2.5" 
                  : "hover:bg-slate-800 hover:text-slate-200 text-slate-400 rounded-md"
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              <span className="truncate text-xs">{item.label}</span>
              {item.id === "inventory" && (
                <span className="absolute right-2 top-3 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Option Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2 shrink-0">
        
        {/* Toggle Language & Dark Mode */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-md font-semibold transition"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === "en" ? "বাংলা" : "English"}</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-md font-semibold transition"
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Brand signature */}
        <div className="text-[10px] text-slate-500 font-mono text-center mt-1">
          <p>Owner: Md. Safir Uddin Titu</p>
          <a href="tel:01824234587" className="text-indigo-400 hover:underline">
            01824234587
          </a>
        </div>
      </div>
    </aside>
  );
};
