/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../types";
import { Package, Plus, Trash2, Search, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

export const InventoryTab: React.FC = () => {
  const { language, products, addProduct, updateProduct, deleteProduct } = useApp();
  const t = TRANSLATIONS[language];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBarcodeScannerSim, setShowBarcodeScannerSim] = useState(false);
  const [toastAlert, setToastAlert] = useState("");

  // Product addition binding
  const [name, setName] = useState("");
  const [category, setCategory] = useState("IT Accessories");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [sku, setSku] = useState("");

  // Simulated scan state
  const [barcodeInput, setBarcodeInput] = useState("");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock || !buyingPrice || !sellingPrice) return;

    const formattedSku = sku || "RNE-APP-" + Math.floor(1000 + Math.random() * 9000).toString();

    addProduct({
      name,
      category,
      stock: Number(stock),
      minStock: Number(minStock) || 3,
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      sku: formattedSku
    });

    setToastAlert(language === "en" ? "Inventory stock register updated!" : "পণ্য সফলভাবে ক্যাবেরিট ইনভেন্টরিতে যুক্ত হয়েছে!");
    setTimeout(() => {
      setToastAlert("");
      setName("");
      setStock("");
      setMinStock("");
      setBuyingPrice("");
      setSellingPrice("");
      setSku("");
      setShowAddForm(false);
    }, 1200);
  };

  const executeBarcodeSimScan = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanB = barcodeInput.trim().toUpperCase();
    if (!cleanB) return;

    const matched = products.find(p => p.sku.toUpperCase() === cleanB || p.id === barcodeInput);
    if (matched) {
      updateProduct(matched.id, { stock: matched.stock + 10 });
      setToastAlert(`Laser Match: Added +10 Stock count to "${matched.name}"!`);
    } else {
      setToastAlert(`Error: SKU "${cleanB}" does not correspond to any registered item.`);
    }

    setBarcodeInput("");
    setTimeout(() => {
      setToastAlert("");
      setShowBarcodeScannerSim(false);
    }, 2000);
  };

  const adjustStockStep = (id: string, current: number, step: number) => {
    updateProduct(id, { stock: Math.max(0, current + step) });
  };

  const categories = ["All", "IT Accessories", "Network Equipment", "Storage Devices", "Cables", "Services"];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-500" />
            {language === "en" ? "Hardware Warehouse & Stock" : "মালামাল স্টক ও ইনভেন্টরি"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Monitor stock depletion, low warning alarms, price margin calculation." : "বিএসআর ও আইটি এক্সেসরিজ স্টক কাউন্টার এবং বারকোড রিসিভার।"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setShowBarcodeScannerSim(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-teal-400 font-bold px-3 py-2 border border-slate-800 dark:border-slate-700 rounded-lg text-xs transition active:scale-95"
          >
            <span>📷 Barcode Laser Sim</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addProduct}</span>
          </button>
        </div>
      </div>

      {toastAlert && (
        <div className="px-4 py-3.5 bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300 text-center font-bold text-xs rounded-xl flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{toastAlert}</span>
        </div>
      )}

      {/* Adding Popup Form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{t.addProduct}</h3>
          
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div className="md:col-span-2">
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Product Description Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. A4tech USB Bangla Keyboard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Item Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="IT Accessories">IT Accessories</option>
                <option value="Network Equipment">Network Equipment</option>
                <option value="Storage Devices">Storage Devices</option>
                <option value="Cables">Cables</option>
                <option value="Services">Services / Forms</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Unique SKU / Barcode</label>
              <input
                type="text"
                placeholder="e.g. RNE-MOU-05"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Buying Price (Tk) *</label>
              <input
                type="number"
                required
                placeholder="Cost price"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Selling Price (Tk) *</label>
              <input
                type="number"
                required
                placeholder="Sale price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">In-Stock Quantity *</label>
              <input
                type="number"
                required
                placeholder="Qty count"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Minimum Alarming Stock *</label>
              <input
                type="number"
                required
                placeholder="Low warning limit"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
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
                Register Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playful Interactive Barcode laser scan sim modal */}
      {showBarcodeScannerSim && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-md w-full rounded-xl p-5 shadow-2xl relative text-xs">
            <button onClick={() => setShowBarcodeScannerSim(false)} className="absolute right-4 top-4 hover:bg-slate-150 p-1 font-bold">✕</button>
            <h3 className="font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-2">LASER BARCODE SCAN SIMULATOR</h3>
            <p className="text-slate-400 mb-4 lh-relaxed font-sans">
              Enter or select an item SKU code and click "Laser Scan". This simulates scanning a physical component barcode, automatically adding +10 to warehouses stocks.
            </p>

            <form onSubmit={executeBarcodeSimScan} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Select SKU to Scan</label>
                <select
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                >
                  <option value="">-- Choose Stock SKU --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.sku} ({p.name})</option>
                  ))}
                </select>
              </div>

              <div className="bg-rose-500/10 py-1 px-2.5 rounded-md text-rose-500 text-[10px] font-mono text-center flex items-center justify-center gap-1.5 select-none animation-pulse animate-pulse border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Simulating Real Hardware Laser Feed...</span>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowBarcodeScannerSim(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!barcodeInput}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 font-bold text-white rounded-lg shadow-md transition disabled:opacity-50"
                >
                  📡 Simulate Laser Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                selectedCat === cat 
                  ? "bg-slate-900 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300 font-bold border border-slate-800" 
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
              }`}
            >
              {language === "en" ? cat : (
                cat === "All" ? "সবগুলো" : 
                cat === "IT Accessories" ? "আইটি সামগ্রী" :
                cat === "Network Equipment" ? "নেটওয়ার্ক ক্যাবল" :
                cat === "Storage Devices" ? "পেনড্রাইভ" :
                cat === "Cables" ? "ক্যাবল" : "সেবা"
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-850 dark:text-white"
          />
        </div>
      </div>

      {/* Stock lists table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-mono font-bold tracking-widest uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">SKU Item</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Buying Price</th>
                <th className="px-5 py-3.5 text-right">Selling Price</th>
                <th className="px-5 py-3.5 text-center">In Store Stock</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Manual Adjust</th>
                <th className="px-5 py-3.5 text-center">Removals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-sans text-slate-700 dark:text-slate-300">
              {filteredProducts.map((p) => {
                const isUnderAlert = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/15 transition">
                    <td className="px-5 py-3 flex items-center gap-1.5">
                      <div className="w-7 h-7 bg-slate-100 dark:bg-slate-900 rounded flex items-center justify-center font-bold">📦</div>
                      <div>
                        <p className="font-bold text-slate-850 dark:text-white">{p.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">SKU: {p.sku}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">{p.category}</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-400">{p.buyingPrice} Tk</td>
                    <td className="px-5 py-3 text-right font-mono font-bold">{p.sellingPrice} Tk</td>
                    <td className={`px-5 py-3 text-center font-mono font-bold ${isUnderAlert ? "text-rose-500" : "text-emerald-500"}`}>
                      {p.stock}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {isUnderAlert ? (
                        <span className="px-2 py-0.5 bg-rose-550/10 text-rose-500 font-mono font-bold rounded text-[9px] uppercase">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono font-bold rounded text-[9px] uppercase">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => adjustStockStep(p.id, p.stock, -1)}
                          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 hover:dark:bg-slate-650 w-5 h-5 rounded font-bold transition select-none flex items-center justify-center"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustStockStep(p.id, p.stock, 1)}
                          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 hover:dark:bg-slate-650 w-5 h-5 rounded font-bold transition select-none flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-500/5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <p className="italic text-center py-10 text-slate-400">
            No stock item matched parameters.
          </p>
        )}
      </div>

    </div>
  );
};
