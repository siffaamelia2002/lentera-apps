"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface KatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export default function KatalogPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: KatalogPaginationProps) {
  if (totalPages <= 1) return null;

  // Membuat array nomor halaman [1, 2, 3, ...]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 pt-12 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Tombol Previous */}
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 shadow-inner group"
      >
        <ChevronLeft size={20} className="group-active:-translate-x-1 transition-transform" />
      </button>

      {/* Nomor Halaman (Dark Indigo Style LENTERA) */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/30 rounded-[1.5rem] border border-slate-800/50">
        {pageNumbers.map((number) => {
          const isActive = currentPage === number;
          return (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-[11px] uppercase tracking-tighter transition-all duration-500 active:scale-90 ${
                isActive
                  ? "bg-indigo-600 border border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]" // LENTERA Indigo State
                  : "text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5"
              }`}
            >
              {number.toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {/* Tombol Next */}
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 shadow-inner group"
      >
        <ChevronRight size={20} className="group-active:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}