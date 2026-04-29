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

  // Bikin array nomor halaman [1, 2, 3, ...]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 pt-8">
      {/* Tombol Previous */}
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Nomor Halaman (Dark Emerald Style) */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((number) => {
          const isActive = currentPage === number;
          return (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-emerald-950 border border-emerald-700 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" // Dark Emerald State
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
              }`}
            >
              {number}
            </button>
          );
        })}
      </div>

      {/* Tombol Next */}
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}