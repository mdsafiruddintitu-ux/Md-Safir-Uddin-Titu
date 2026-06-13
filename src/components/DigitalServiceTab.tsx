/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { 
  Laptop, ExternalLink, ShieldCheck, Heart, 
  Plus, Search, Globe, Landmark, DollarSign, CheckCircle2 
} from "lucide-react";

interface DigitalService {
  id: string;
  name: string;
  banglaName: string;
  desc: string;
  url: string;
  category: "Land" | "Civic" | "Business" | "Visa" | "Tickets";
  charge: number;
}

export const DigitalServiceTab: React.FC = () => {
  const { language, addAccountingLog, customers, addCustomer } = useApp();
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // WebView mock state
  const [activeIframeUrl, setActiveIframeUrl] = useState<string | null>(null);
  const [activeIframeName, setActiveIframeName] = useState<string>("");
  
  // Fast log service sale modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedService, setSelectedService] = useState<DigitalService | null>(null);
  const [serviceCustomerName, setServiceCustomerName] = useState("");
  const [serviceCustomerPhone, setServiceCustomerPhone] = useState("");
  const [serviceCharge, setServiceCharge] = useState<number>(350);
  const [serviceDiscount, setServiceDiscount] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState("");

  const digitalServicesList: DigitalService[] = [
    { id: "srv-namjari", name: "E-Namjari Registration", banglaName: "ই-নামজারি নামপত্তন আবেদন", desc: "Process online mutation application including record correction state-wise.", url: "https://mutation.land.gov.bd/", category: "Land", charge: 350 },
    { id: "srv-khatian", name: "Khatian & Porcha Search", banglaName: "খতিয়ান ও ই-পর্চা যাচাইকরণ", desc: "Download digital certified copies of BS, CS, RS, SA khatians online.", url: "https://www.eporcha.gov.bd/", category: "Land", charge: 200 },
    { id: "srv-mouza", name: "Mouza Map Search Engine", banglaName: "ডিজিটাল মৌজা ম্যাপ ডাউনলোড", desc: "Locate land maps and survey sheets under Sunamganj and other districts.", url: "https://www.eporcha.gov.bd/mouza-search", category: "Land", charge: 150 },
    { id: "srv-landtax", name: "Land Development Tax Portal", banglaName: "ভূমি উন্নয়ন কর খতিয়ান ভুক্তি", desc: "Submit yearly land assessment holdings and municipal tax online safely.", url: "https://ldtax.gov.bd/", category: "Land", charge: 100 },
    { id: "srv-nid", name: "NID Card Applications", banglaName: "জাতীয় পরিচয়পত্রCorrection / নতুন NID", desc: "Submit smartcard, corrections, server copies, or new NID registration details.", url: "https://services.nidw.gov.bd/", category: "Civic", charge: 250 },
    { id: "srv-passport", name: "E-Passport Portal", banglaName: "অনলাইন ই-পাসপোর্ট আবেদন", desc: "Submit passport enrollment forms, print application, and check delivery status.", url: "https://www.epassport.gov.bd/", category: "Civic", charge: 300 },
    { id: "srv-brta", name: "BRTA Service Center", banglaName: "বিআরটিএ ড্রাইভিং লাইসেন্স ও ট্যাক্স", desc: "Driving license slots registration, smartcard trackers, and token records.", url: "https://bsp.brta.gov.bd/", category: "Civic", charge: 500 },
    { id: "srv-birth", name: "Birth Register Gateway", banglaName: "ডিজিটাল জন্ম ও মৃত্যু নিবন্ধন", desc: "Register infants, translate birthplace coordinates, and correct certifications.", url: "https://bdris.gov.bd/", category: "Civic", charge: 150 },
    { id: "srv-trade", name: "E-Trade License Board", banglaName: "ডিজিটাল ট্রেড লাইসেন্স প্রক্রিয়াকরণ", desc: "File new municipal trade registrations and business operations tax certificates.", url: "https://www.etradelicense.gov.bd/", category: "Business", charge: 400 },
    { id: "srv-visa", name: "Indian Online Visa Application", banglaName: "অনলাইন ভারতীয় ভিসা আবেদন", desc: "File IVAC visa forms, schedule bio-metric dates, and manage appointments.", url: "https://www.ivacbd.com/", category: "Visa", charge: 350 },
    { id: "srv-rail", name: "Rail Sheba Train Tickets", banglaName: "রেলওয়ে অনলাইন টিকেট বুকিং", desc: "Check seats, class variations, routes, and print e-tickets directly.", url: "https://eticket.railway.gov.bd/", category: "Tickets", charge: 80 }
  ];

  const categories = ["All", "Land", "Civic", "Business", "Visa", "Tickets"];

  // Filtering
  const filteredServices = digitalServicesList.filter(service => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.banglaName.includes(searchTerm) ||
      service.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const launchLogModal = (srv: DigitalService) => {
    setSelectedService(srv);
    setServiceCharge(srv.charge);
    setServiceDiscount(0);
    setServiceCustomerName("");
    setServiceCustomerPhone("");
    setSuccessMsg("");
    setShowLogModal(true);
  };

  const handleSaveServiceLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !serviceCustomerName || !serviceCustomerPhone) return;

    // 1. Create client profile implicitly
    const netProfit = serviceCharge - serviceDiscount;
    addCustomer({
      name: serviceCustomerName,
      phone: serviceCustomerPhone,
      address: "Biswambarpur, Sunamganj",
      email: ""
    });

    // 2. Add accounting income transaction
    addAccountingLog({
      type: "income",
      amount: netProfit,
      category: "Digital Services",
      description: `${selectedService.name} - ${serviceCustomerName} (${serviceCustomerPhone})`,
      date: new Date().toISOString().split("T")[0]
    });

    setSuccessMsg(language === "en" ? "Service entry logged & synced to Account book!" : "সেবা সফলভাবে লিপিবদ্ধ করা হয়েছে!");
    setTimeout(() => {
      setShowLogModal(false);
      setSelectedService(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-teal-500" />
          {language === "en" ? "Government Digital Gates" : "ডিজিটাল সরকারি সেবা বাতায়ন"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          {language === "en" ? "Official Government URLs & direct integration portals." : "সহজে ও দ্রুত সরকারি ওয়েবসাইট ব্যবহারে সহায়তা কেন্দ্র।"}
        </p>
      </div>

      {/* Main Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition ${
                selectedCategory === cat 
                  ? "bg-slate-900 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300 font-bold" 
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
              }`}
            >
              {language === "en" ? cat : (
                cat === "All" ? "সবগুলো" : 
                cat === "Land" ? "ভূমি সেবা" :
                cat === "Civic" ? "নাগরিক সেবা" :
                cat === "Business" ? "ব্যবসা" :
                cat === "Visa" ? "ভিসা আবেদন" : "টিকেট বুকিং"
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Embedded Iframe Viewport */}
      {activeIframeUrl && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              <span className="font-bold">{activeIframeName}</span>
              <span className="text-[10px] text-slate-500 truncate max-w-sm hidden sm:inline">{activeIframeUrl}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-mono select-none">SSLSafe</span>
              <button 
                onClick={() => window.open(activeIframeUrl, "_blank")}
                className="hover:text-white font-semibold flex items-center gap-1 bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </button>
              <button 
                onClick={() => { setActiveIframeUrl(null); }}
                className="text-slate-400 hover:text-white font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900 flex flex-col items-center justify-center py-10 px-4 text-center border-b border-slate-800">
            <ShieldCheck className="w-12 h-12 text-teal-400 mb-2" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">SECURE REDIRECT LINK PORTAL</h4>
            <p className="text-xs text-slate-400 max-w-md mt-1.5">
              Due to Google sandbox containment structures & X-Frame restrictions, government portal frames cannot load directly in the workspace preview frame.
            </p>
            <button
              onClick={() => window.open(activeIframeUrl, "_blank")}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs rounded-lg shadow-md transition"
            >
              🚀 Launch Portal in New Browser Tab ({activeIframeName})
            </button>
          </div>
        </div>
      )}

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div 
            key={srv.id} 
            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                  srv.category === "Land" ? "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" :
                  srv.category === "Civic" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-300" :
                  srv.category === "Business" ? "bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-300" :
                  srv.category === "Visa" ? "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-300" :
                  "bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300"
                }`}>
                  {srv.category}
                </span>

                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                  {srv.charge} Tk fee
                </span>
              </div>

              <div className="mt-2.5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">{srv.name}</h3>
                <p className="text-xs text-slate-500 dark:text-teal-400 font-medium font-sans mt-0.5">{srv.banglaName}</p>
                <p className="text-xs text-slate-400 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{srv.desc}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => { setActiveIframeUrl(srv.url); setActiveIframeName(srv.name); }}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 hover:dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-teal-500" />
                <span>Launch Portal</span>
              </button>

              <button
                onClick={() => launchLogModal(srv)}
                className="flex items-center gap-1 bg-teal-500 hover:bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Service</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logging Entry Modal */}
      {showLogModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden relative p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1">
              {language === "en" ? "Register Civic Portal Transaction" : "ডিজিটাল সেবা হিসাবভুক্তি"}
            </h3>
            <p className="text-xs text-slate-400 font-sans mb-4">
              {selectedService.name} · Recommended Charge: {selectedService.charge} BDT
            </p>

            {successMsg ? (
              <div className="my-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center rounded-lg flex flex-col items-center justify-center gap-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <span className="font-bold">{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveServiceLog} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Md. Korim"
                    value={serviceCustomerName}
                    onChange={(e) => setServiceCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Customer Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 018XXXXXXXX"
                    value={serviceCustomerPhone}
                    onChange={(e) => setServiceCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Official Charge (Tk)</label>
                    <input
                      type="number"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Discount given (Tk)</label>
                    <input
                      type="number"
                      value={serviceDiscount}
                      onChange={(e) => setServiceDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg flex justify-between items-center font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Total Net Revenue:</span>
                  <span className="text-emerald-500 font-mono text-sm">{Math.max(0, serviceCharge - serviceDiscount)} BDT</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
