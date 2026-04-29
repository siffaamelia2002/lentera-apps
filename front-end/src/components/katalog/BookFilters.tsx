"use client";

interface Kategori {
  id: number;
  nama_kategori: string;
}

interface BookFiltersProps {
  categories: Kategori[];
  onFilterChange: (categoryName: string) => void;
  activeCategory: string; 
  isLoading?: boolean;
}

export default function BookFilters({
  categories = [],
  onFilterChange,
  activeCategory = "Semua",
  isLoading = false,
}: BookFiltersProps) {
  
  // SKELETON LOADING - Indigo Theme
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[42px] w-28 bg-indigo-900/20 border border-indigo-500/5 animate-pulse rounded-xl shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
      {/* Tombol Filter "Semua" */}
      <button
        onClick={() => onFilterChange("Semua")}
        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${
          activeCategory === "Semua"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-indigo-500/50"
            : "bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-indigo-500/30 hover:text-indigo-400"
        }`}
      >
        Semua Koleksi
      </button>

      {/* Mapping Kategori dari LENTERA System */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.nama_kategori)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${
            activeCategory === cat.nama_kategori
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-indigo-500/50"
              : "bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-indigo-500/30 hover:text-indigo-400"
          }`}
        >
          {cat.nama_kategori}
        </button>
      ))}
    </div>
  );
}