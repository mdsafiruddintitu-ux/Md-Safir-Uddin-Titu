/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, WebsiteLink } from "../types";
import { BookOpen, Star, Plus, ShieldCheck, Globe, Trash2, ExternalLink, Search } from "lucide-react";

export const ServiceDirectoryTab: React.FC = () => {
  const { language, websiteLinks, addWebsiteLink, updateWebsiteLink, deleteWebsiteLink, incrementLinkClicks } = useApp();
  const t = TRANSLATIONS[language];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom link state
  const [newTitle, setNewTitle] = useState("");
  const [newTitleBn, setNewTitleBn] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Land");
  const [isFav, setIsFav] = useState(false);

  // Link categories
  const categories = ["All", "Land", "Civic", "Business", "Visa", "Tickets"];

  const handleAddNewLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    addWebsiteLink({
      title: newTitle,
      titleBn: newTitleBn || newTitle,
      url: newUrl,
      category: newCategory,
      isFavorite: isFav
    });

    setNewTitle("");
    setNewTitleBn("");
    setNewUrl("");
    setIsFav(false);
    setShowAddForm(false);
  };

  const toggleFavorite = (link: WebsiteLink) => {
    updateWebsiteLink(link.id, { isFavorite: !link.isFavorite });
  };

  const handleLaunchUrl = (link: WebsiteLink) => {
    incrementLinkClicks(link.id);
    window.open(link.url, "_blank");
  };

  const filteredLinks = websiteLinks.filter(link => {
    const matchesCat = selectedCategory === "All" || link.category === selectedCategory;
    const matchesSearch = 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            {t.serviceDirectory}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {language === "en" ? "Browse, search, and store critical corporate links." : "গুরুত্বপূর্ণ ও প্রয়োজনীয় সকল লিংক একসাথে সংরক্ষণ খুজে নেয়ার বুকমার্ক খাতা।"}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-500/10 hover:bg-slate-800 dark:hover:bg-teal-500/20 text-teal-300 font-bold px-4 py-2 border border-slate-800 dark:border-teal-500/20 rounded-lg text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addLink}</span>
        </button>
      </div>

      {/* Adding Popup / Form */}
      {showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">{t.addLink}</h3>
          
          <form onSubmit={handleAddNewLink} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Link Title (English) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bangladesh Custom Tax Portal"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">লিংক শিরোনাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: বাংলাদেশ কাস্টম ট্যাক্স বাতায়ন"
                value={newTitleBn}
                onChange={(e) => setNewTitleBn(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Web Address (URL) *</label>
              <input
                type="url"
                required
                placeholder="https://example.gov.bd"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="Land">Land Services</option>
                  <option value="Civic">Civic / NID</option>
                  <option value="Business">Business Portal</option>
                  <option value="Visa">Visa Services</option>
                  <option value="Tickets">Ticket Booking</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="link-fav"
                  checked={isFav}
                  onChange={(e) => setIsFav(e.target.checked)}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <label htmlFor="link-fav" className="text-slate-700 dark:text-slate-300 font-semibold select-none cursor-pointer">
                  {t.favorite}
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg shadow-md"
              >
                Save Shortcut
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                selectedCategory === cat 
                  ? "bg-slate-900 border border-slate-800 text-teal-300 dark:bg-teal-500/10 dark:text-teal-300 font-bold" 
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
              }`}
            >
              {language === "en" ? cat : (
                cat === "All" ? "সবগুলো" : 
                cat === "Land" ? "ভূমি সেবা" :
                cat === "Civic" ? "নাগরিক সেবা" :
                cat === "Business" ? "ব্যবসা" :
                cat === "Visa" ? "ভিসা" : "টিকেট"
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((link) => (
          <div 
            key={link.id} 
            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                  {link.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-slate-400">
                    {link.recentClicks} {t.recentClicks}
                  </span>
                  
                  <button 
                    onClick={() => toggleFavorite(link)}
                    className="text-slate-300 hover:text-amber-500 transition"
                  >
                    <Star className={`w-3.5 h-3.5 ${link.isFavorite ? "fill-amber-400 text-amber-500" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {language === "en" ? link.title : link.titleBn}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-mono truncate">{link.url}</p>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <button
                onClick={() => handleLaunchUrl(link)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Navigate Gateway</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => deleteWebsiteLink(link.id)}
                className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-500/5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <p className="text-xs italic text-center p-12 text-slate-400">
          {language === "en" ? "No bookmarks match your filters." : "কোন সংরক্ষিত লিংক খুঁজে পাওয়া যায়নি।"}
        </p>
      )}

    </div>
  );
};
