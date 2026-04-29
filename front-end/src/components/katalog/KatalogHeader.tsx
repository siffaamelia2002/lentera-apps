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
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <LayoutGrid className="text-emerald-500" size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Book <span className="text-emerald-500">Catalogue</span>
          </h1>
        </div>

        <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase pl-1">
          {isLoading
            ? "MEMUAT DATA..."
            : isFetching
            ? "MEMPERBARUI..."
            : `DITEMUKAN ${totalBooks} KOLEKSI`}
        </p>
      </div>

      <div className="relative w-full md:w-96 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Cari judul atau penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>
    </header>
  );
}