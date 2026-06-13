/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { DashboardTab } from "./components/DashboardTab";
import { DigitalServiceTab } from "./components/DigitalServiceTab";
import { ServiceDirectoryTab } from "./components/ServiceDirectoryTab";
import { AccountingTab } from "./components/AccountingTab";
import { CustomerTab } from "./components/CustomerTab";
import { InvoiceTab } from "./components/InvoiceTab";
import { MobileBankingTab } from "./components/MobileBankingTab";
import { InventoryTab } from "./components/InventoryTab";
import { EmployeeTab } from "./components/EmployeeTab";
import { DocumentTab } from "./components/DocumentTab";
import { ItManagementTab } from "./components/ItManagementTab";
import { AdminPanelTab } from "./components/AdminPanelTab";
import { Menu, X, PhoneCall, HelpCircle, Sun, Moon } from "lucide-react";

const AppContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { darkMode, language, settings } = useApp();

  // Keep track of active clock
  const [currentTime, setCurrentTime] = useState("");
  
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      
      const locale = language === "en" ? "en-US" : "bn-BD";
      setCurrentTime(d.toLocaleDateString(locale, options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Apply dark mode theme class directly onto root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Render the currently selected tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "digital":
        return <DigitalServiceTab />;
      case "links":
        return <ServiceDirectoryTab />;
      case "accounting":
        return <AccountingTab />;
      case "customers":
        return <CustomerTab />;
      case "invoices":
        return <InvoiceTab />;
      case "banking":
        return <MobileBankingTab />;
      case "inventory":
        return <InventoryTab />;
      case "employees":
        return <EmployeeTab />;
      case "documents":
        return <DocumentTab />;
      case "it":
        return <ItManagementTab />;
      case "admin":
        return <AdminPanelTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* 1. Large Screen Sidebar View */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 2. Mobile Screen Drawer Sidebar View */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay filter */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
          />
          
          {/* Drawer container body */}
          <div className="relative flex flex-col w-68 bg-slate-900 h-full animate-slide-in shadow-2xl z-50">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-4 top-4 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg z-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }} 
            />
          </div>
        </div>
      )}

      {/* 3. Primary Workspace Area Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Banner control frame */}
        <header id="app-header" className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 select-none">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Display running clock */}
            <p className="text-xs font-mono font-semibold tracking-tight text-slate-500 bg-slate-100 dark:bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-150 dark:border-slate-800">
              {currentTime || "..."}
            </p>
          </div>

          {/* User profiles & Hotlines shortcuts */}
          <div className="flex items-center gap-3.5">
            <a 
              href={`tel:${settings.mobile}`}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-md shadow-indigo-600/15 transition-all duration-150 transform hover:-translate-y-0.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{settings.mobile}</span>
            </a>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-right">
                <p className="text-xs font-bold leading-none text-slate-850 dark:text-gray-100">Md. Safir Uddin Titu</p>
                <p className="text-[10px] text-slate-450 dark:text-gray-400 font-mono mt-0.5 uppercase tracking-wide">Owner / Operator</p>
              </div>
            </div>
          </div>

        </header>

        {/* 4. Scrollable Container tab panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative focus:outline-none bg-slate-50 dark:bg-slate-950 select-text">
          {renderActiveTabContent()}
        </main>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}
