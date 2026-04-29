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
  
  // SKELETON LOADING
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[42px] w-28 bg-slate-800/60 animate-pulse rounded-xl shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onFilterChange("Semua")}
        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          activeCategory === "Semua"
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
            : "bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300"
        }`}
      >
        Semua
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.nama_kategori)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeCategory === cat.nama_kategori
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
              : "bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300"
          }`}
        >
          {cat.nama_kategori}
        </button>
      ))}
    </div>
  );
}