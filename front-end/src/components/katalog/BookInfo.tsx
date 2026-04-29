// components/BookDetailModal/BookInfo.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircle2, Building2, Calendar, ChevronDown, ChevronUp, Banknote } from "lucide-react";
import { Book } from "@/types/katalog-modal";

export default function BookInfo({ book }: { book: Book }) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Helper untuk format rupiah LENTERA
  const formatRupiah = (angka: number | string | null) => {
    if (!angka || Number(angka) === 0) return "Akses Gratis";
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
        {/* Indigo Badge Kategori */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-[1.5px] w-3 bg-indigo-500 rounded-full"></span>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg border border-indigo-500/20">
            {book.category}
          </span>
        </div>
        
        <Dialog.Title className="text-4xl font-black text-white leading-tight uppercase italic tracking-tighter">
          {book.title}
        </Dialog.Title>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
        <InfoRow icon={<CheckCircle2 size={16} />} label="Penulis" value={book.author} />
        <InfoRow icon={<Building2 size={16} />} label="Penerbit" value={book.penerbit} />
        <InfoRow icon={<Calendar size={16} />} label="Tahun Terbit" value={book.tahun_terbit} />
        <InfoRow icon={<Banknote size={16} />} label="Nilai Buku" value={formatRupiah(book.harga)} />
      </div>

      <div className="bg-slate-950/50 rounded-[2rem] border border-slate-800/50 p-6 relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
        
        <p className={`text-slate-400 text-sm leading-relaxed italic transition-all duration-300 ${!isDescExpanded ? 'line-clamp-4' : ''}`}>
          {book.deskripsi || "Tidak ada deskripsi tersedia untuk buku ini dalam sistem LENTERA."}
        </p>
        
        {book.deskripsi && book.deskripsi.length > 150 && (
          <button 
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-4 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-indigo-400 transition-colors"
          >
            {isDescExpanded ? <><ChevronUp size={14}/> Sembunyikan Deskripsi</> : <><ChevronDown size={14}/> Lihat Selengkapnya</>}
          </button>
        )}
      </div>
    </div>
  );
}

// Sub-komponen InfoRow dengan aksen Indigo
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-slate-400 group/row">
      <div className="text-indigo-500 bg-indigo-500/5 p-2.5 rounded-xl border border-indigo-500/10 shadow-sm transition-all group-hover/row:border-indigo-500/30">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="uppercase tracking-[0.2em] text-[9px] text-slate-500 font-black mb-0.5">{label}</span>
        <b className="text-slate-200 text-[15px] font-black tracking-tight leading-none uppercase">{value}</b>
      </div>
    </div>
  );
}