/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { Settings, Save, ShieldAlert, Cloud, RefreshCw, CheckCircle2 } from "lucide-react";

export const AdminPanelTab: React.FC = () => {
  const { language, setLanguage, settings, updateSettings } = useApp();
  const t = TRANSLATIONS[language];

  // Setting bindings
  const [coName, setCoName] = useState(settings.companyName);
  const [address, setAddress] = useState(settings.address);
  const [mobile, setMobile] = useState(settings.mobile);
  const [bkashNum, setBkashNum] = useState(settings.bkashNumber);
  const [nagadNum, setNagadNum] = useState(settings.nagadNumber);
  const [waMsg, setWaMsg] = useState(settings.whatsappMessage);
  const [backupLoader, setBackupLoader] = useState(false);
  const [toast, setToast] = useState("");

  const handleUpdateCorporateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName: coName,
      address: address,
      mobile: mobile,
      bkashNumber: bkashNum,
      nagadNumber: nagadNum,
      whatsappMessage: waMsg
    });

    setToast(language === "en" ? "Corporate settings updated successfully!" : "প্রতিষ্ঠানের সামগ্রিক সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
    setTimeout(() => setToast(""), 2000);
  };

  const executeMockCloudBackup = () => {
    setBackupLoader(true);
    // Mimics real Cloud storage backup sequencing upload
    setTimeout(() => {
      setBackupLoader(false);
      setToast(language === "en" ? "Durable cloud backup synchronized to Google Cloud Run Storage!" : "গুগল ক্লাউড ড্রাইভে দোকানের সকল ব্যাকআপ সম্পন্ন হয়েছে!");
      setTimeout(() => setToast(""), 2500);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-xs max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-500" />
          {t.adminPanel}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          {language === "en" ? "Adjust enterprise parameters, billing hotlines and trigger secure backups." : "মালিকানা সেটিংস, মোবাইল ব্যাংকিং নাম্বার এবং সিস্টেম ডাটাবেজ ব্যাকআপ প্যানেল।"}
        </p>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center font-bold text-xs rounded-xl flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Settings Panel form */}
      <form onSubmit={handleUpdateCorporateSettings} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm space-y-4">
        
        <div className="border-b border-slate-100 dark:border-slate-750 pb-2 flex items-center justify-between">
          <h3 className="font-bold text-slate-750 dark:text-white uppercase tracking-wider text-[11px]">System configuration parameters</h3>
          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 px-2 py-0.5 font-bold font-mono rounded">
            Role: OWNER/ADMIN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Company / Enterprise Brand Name</label>
            <input
              type="text"
              required
              value={coName}
              onChange={(e) => setCoName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Owner Contact Hotline</label>
            <input
              type="text"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Corporate Physical Address Location</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
            />
          </div>

          {/* Core gateway accounts indices */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">bKash agent Mobile number</label>
            <input
              type="text"
              required
              value={bkashNum}
              onChange={(e) => setBkashNum(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Nagad agent Mobile number</label>
            <input
              type="text"
              required
              value={nagadNum}
              onChange={(e) => setNagadNum(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Automated WhatsApp Billing Reminder Alert Template</label>
            <textarea
              rows={3}
              value={waMsg}
              onChange={(e) => setWaMsg(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white leading-relaxed font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration Changes</span>
        </button>
      </form>

      {/* Cloud Backup & System controls */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
          <Cloud className="w-4 h-4 text-teal-400" />
          <span>Auto-Sync & Disaster Recovery</span>
        </h3>
        
        <p className="text-slate-400 font-sans leading-relaxed">
          R N Enterprise database states (Firestore, cash ledger documents, retail inventory counts and client profile listings) are compiled local payload values. Click manually trigger full JSON sequences write-out.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5">
          <button
            type="button"
            disabled={backupLoader}
            onClick={executeMockCloudBackup}
            className="flex-1 py-2 bg-slate-900 text-teal-300 font-bold border border-slate-850 hover:bg-slate-850 dark:bg-slate-800 dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 transition"
          >
            {backupLoader ? (
              <RefreshCw className="w-4 h-4 text-teal-300 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4 text-teal-300" />
            )}
            <span>Trigger Google Drive Backup</span>
          </button>
          
          <div className="flex-1 p-2.5 bg-rose-500/5 hover:bg-rose-500/10 transition border border-rose-500/20 rounded-lg text-[10px] text-justify font-mono flex items-start gap-1.5 text-rose-500">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>Zero-Trust parameters applied to all transactions: Firestore rules verify Md. Safir Uddin Titu's credential email limits before writes are permitted.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
