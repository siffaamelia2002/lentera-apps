// components/peminjaman/PeminjamanCard.tsx
"use client";

import Image from "next/image";
import { ChevronRight, Calendar, ImageOff, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format, isValid } from "date-fns";

const STATUS_MAP: any = {
  pending: { label: "Pending", style: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: <Clock size={10} /> },
  disetujui: { label: "Disetujui", style: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: <CheckCircle2 size={10} /> },
  ditolak: { label: "Ditolak", style: "text-rose-400 bg-rose-400/10 border-rose-400/20", icon: <AlertCircle size={10} /> },
  dipinjam: { label: "Dipinjam", style: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20", icon: <Clock size={10} /> },
  dikembalikan: { label: "Kembali", style: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20", icon: <CheckCircle2 size={10} /> },
  terlambat: { label: "Terlambat", style: "text-rose-600 bg-rose-600/10 border-rose-600/20", icon: <AlertCircle size={10} /> },
};

export default function PeminjamanCard({ item, onOpenDetail }: any) {
  const statusKey = item.status?.toLowerCase() || "pending";
  const status = STATUS_MAP[statusKey] || STATUS_MAP.pending;
  
  // Ambil data buku pertama untuk cover
  const details = item.details || [];
  const bukuUtama = details[0]?.buku;
  const coverUrl = bukuUtama?.cover;
  const jumlahBukuLainnya = details.length - 1;

  // Helper Format Tanggal + Jam standar sirkulasi LENTERA
  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return "-";
    const dateObj = new Date(dateStr);
    return isValid(dateObj) ? format(dateObj, "dd MMM yyyy • HH:mm") : "Tanggal Invalid";
  };

  return (
    <div className="group bg-[#0B1120] border border-slate-900 p-5 rounded-[2.5rem] hover:border-indigo-500/40 transition-all shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        
        {/* IMAGE SECTION - LENTERA Style */}
        <div className="relative size-24 lg:size-28 shrink-0">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative h-full w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={bukuUtama?.judul || "Cover"}
                fill
                priority
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="120px"
              />
            ) : (
              <ImageOff className="text-slate-700" size={32} />
            )}

            {/* BADGE MULTI-BUKU (Indigo Theme) */}
            {jumlahBukuLainnya > 0 && (
              <div className="absolute inset-x-0 bottom-0 bg-indigo-600/90 backdrop-blur-sm py-1.5">
                <p className="text-[9px] font-black text-white text-center uppercase tracking-tighter">
                  +{jumlahBukuLainnya} Arsip Lainnya
                </p>
              </div>
            )}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.style}`}>
              {status.icon} {status.label}
            </div>
            <p className="text-[10px] text-indigo-500 font-black tracking-[0.2em] uppercase">
              {item.kode_peminjaman || "NO-CODE"}
            </p>
          </div>
          
          <h3 className="text-xl lg:text-2xl font-black text-white uppercase italic leading-tight tracking-tighter truncate max-w-md group-hover:text-indigo-400 transition-colors">
            {bukuUtama?.judul || "Judul Tidak Ada"}
            {jumlahBukuLainnya > 0 && <span className="text-indigo-500 ml-2">...</span>}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                Pengajuan: {formatDateFull(item.tanggal_pengajuan)}
              </span>
            </div>
            {item.tanggal_pinjam && (
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Dipinjam: {formatDateFull(item.tanggal_pinjam)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ACTION SECTION */}
        <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-900 pt-5 lg:pt-0">
          <div className="text-left lg:text-right">
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] leading-none mb-1.5">
              Target Kembali
            </p>
            <p className="text-sm text-white font-black italic tracking-tight">
              {formatDateFull(item.tanggal_kembali_seharusnya)}
            </p>
          </div>

          <button 
            onClick={onOpenDetail} 
            className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white hover:bg-indigo-600 hover:border-indigo-400 transition-all shadow-lg active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}