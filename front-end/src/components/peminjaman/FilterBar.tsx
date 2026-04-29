"use client";

import { Search } from "lucide-react";

interface FilterBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
}

export default function FilterBar({ activeTab, setActiveTab, setSearchQuery }: FilterBarProps) {
  const tabs = ["Semua", "Pending", "Disetujui", "Dipinjam", "Dikembalikan", "Terlambat"];

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#0B1120] p-4 rounded-[2.5rem] border border-slate-900 shadow-xl backdrop-blur-sm">
      {/* Tab Navigation - LENTERA Style */}
      <div className="flex p-1.5 bg-slate-950 rounded-[1.5rem] gap-1 overflow-x-auto w-full md:w-auto no-scrollbar border border-slate-900/50 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap active:scale-95 ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-t border-white/10" 
                  : "text-slate-600 hover:text-indigo-400 hover:bg-indigo-500/5"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search Input with Indigo Accent */}
      <div className="relative w-full md:w-80 group">
        <Search 
          size={16} 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" 
        />
        <input 
          type="text" 
          placeholder="Cari sirkulasi arsip..." 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[11px] font-bold text-white placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-inner" 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
    </div>
  );
}