// components/BookDetailModal/BookInfo.tsx
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircle2, Building2, Calendar, ChevronDown, ChevronUp, Banknote } from "lucide-react";
import { Book } from "./types";

export default function BookInfo({ book }: { book: Book }) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Helper untuk format rupiah
  const formatRupiah = (angka: number | string | null) => {
    if (!angka || Number(angka) === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(angka));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-emerald-500/20">
          {book.category}
        </span>
        <Dialog.Title className="text-4xl font-black text-white mt-3 leading-tight uppercase italic tracking-tighter">
          {book.title}
        </Dialog.Title>
      </div>
      
      <div className="space-y-4">
        <InfoRow icon={<CheckCircle2 size={16} />} label="Penulis" value={book.author} />
        <InfoRow icon={<Building2 size={16} />} label="Penerbit" value={book.penerbit} />
        <InfoRow icon={<Calendar size={16} />} label="Tahun" value={book.tahun_terbit} />
        {/* Row Harga Ditambahkan Di Sini */}
        <InfoRow icon={<Banknote size={16} />} label="Harga" value={formatRupiah(book.harga)} />
      </div>

      <div className="bg-slate-950/50 rounded-[1.5rem] border border-slate-800/50 p-5 relative">
        <p className={`text-slate-400 text-sm leading-relaxed italic transition-all duration-300 ${!isDescExpanded ? 'line-clamp-4' : ''}`}>
          {book.deskripsi || "Tidak ada deskripsi tersedia untuk buku ini."}
        </p>
        {book.deskripsi && book.deskripsi.length > 150 && (
          <button 
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-3 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1 hover:text-emerald-400"
          >
            {isDescExpanded ? <><ChevronUp size={14}/> Sembunyikan</> : <><ChevronDown size={14}/> Lihat Selengkapnya</>}
          </button>
        )}
      </div>
    </div>
  );
}

// Sub-komponen kecil hanya dipakai di file ini
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-slate-400 text-sm">
      <div className="text-emerald-500 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10 shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="uppercase tracking-[0.2em] text-[9px] text-slate-500 font-black">{label}</span>
        <b className="text-slate-200 text-base tracking-tight">{value}</b>
      </div>
    </div>
  );
}