"use client";

import { Search, LayoutGrid } from "lucide-react";

interface KatalogHeaderProps {
  isLoading: boolean;
  isFetching: boolean;
  totalBooks: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function KatalogHeader({
  isLoading,
  isFetching,
  totalBooks,
  searchTerm,
  setSearchTerm,
}: KatalogHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {/* Indigo Icon Container - LENTERA Style */}
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <LayoutGrid className="text-indigo-500" size={22} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
            LENTERA <span className="text-indigo-500">Katalog</span>
          </h1>
        </div>

        {/* Dynamic Status Label with Wide Tracking */}
        <div className="flex items-center gap-2 mt-1.5 pl-1">
          <span className={`h-1.5 w-1.5 rounded-full ${isFetching || isLoading ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
          <p className="text-slate-500 text-[9px] font-black tracking-[0.3em] uppercase">
            {isLoading
              ? "MENYIAPKAN KOLEKSI..."
              : isFetching
              ? "SINKRONISASI DATA..."
              : `TERSEDIA ${totalBooks} ARSIP LITERASI`}
          </p>
        </div>
      </div>

      {/* Modern Search Input with Indigo Glow */}
      <div className="relative w-full md:w-96 group">
        <div className="absolute inset-0 bg-indigo-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors z-10"
          size={18}
        />
        <input
          type="text"
          placeholder="Cari arsip judul atau penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="relative w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all z-10 shadow-inner"
        />
      </div>
    </header>
  );
}