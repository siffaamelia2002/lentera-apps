// components/peminjaman/DetailModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, QrCode, Calendar, Book, ImageOff } from "lucide-react";
import { format, isValid } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

export default function DetailModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [showQR, setShowQR] = useState(false);

  // Reset view QR jika modal ditutup atau ganti item LENTERA
  useEffect(() => {
    if (!item) setShowQR(false);
  }, [item]);

  if (!item) return null;

  const details = item.details || [];

  // Helper Format Tanggal + Jam standar sirkulasi LENTERA
  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return "-";
    const dateObj = new Date(dateStr);
    return isValid(dateObj) ? format(dateObj, "dd MMM yyyy • HH:mm") : "Tanggal Invalid";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0B1120] border border-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />

        <div className="p-8 space-y-6">
          
          {/* Header Modal - LENTERA Identity */}
          <div className="flex justify-between items-start border-b border-slate-900 pb-4">
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">
                Arsip Sirkulasi
              </p>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {item.kode_peminjaman}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-500 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {showQR ? (
            /* TAMPILAN QR CODE UNTUK PETUGAS */
            <div className="flex flex-col items-center justify-center py-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 border-4 border-indigo-500/10">
                <QRCodeSVG value={item.kode_peminjaman} size={200} level="H" />
              </div>
              <div className="text-center space-y-2 px-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                  Tunjukkan QR ini ke petugas LENTERA untuk verifikasi sirkulasi
                </p>
              </div>
              <button 
                onClick={() => setShowQR(false)} 
                className="text-indigo-500 text-[10px] font-black uppercase underline tracking-[0.2em] hover:text-indigo-400 transition-colors"
              >
                Kembali ke Rincian
              </button>
            </div>
          ) : (
            /* TAMPILAN INFO DETAIL ARSIP */
            <div className="space-y-6 animate-in fade-in duration-500">
              
              {/* List Buku LENTERA */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Book size={14} className="text-indigo-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Koleksi Buku ({details.length})</p>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {details.map((det: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-900 rounded-2xl group hover:border-indigo-500/30 transition-all">
                       <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center shadow-inner">
                          {det.buku?.cover ? (
                            <Image
                              src={det.buku.cover}
                              alt="Cover"
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <ImageOff className="text-slate-700" size={16} />
                          )}
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-white truncate group-hover:text-indigo-400 transition-colors uppercase italic tracking-tight leading-none">
                            {det.buku?.judul}
                          </p>
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter mt-1.5">
                            ARSIP ID: {det.buku?.isbn || "N/A"}
                          </p>
                       </div>

                       <div className="text-right shrink-0">
                         <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg">
                          {det.jumlah} QTY
                         </span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Timeline Sirkulasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 shadow-inner">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Awal Sirkulasi</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white italic tracking-tight">
                    <Calendar size={12} className="text-indigo-500" />
                    {formatDateFull(item.tanggal_pinjam)}
                  </div>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 shadow-inner">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Target Kembali</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500 italic tracking-tight">
                    <Calendar size={12} />
                    {formatDateFull(item.tanggal_kembali_seharusnya)}
                  </div>
                </div>
              </div>

              {/* QR Trigger Button - Indigo Style */}
              <button 
                onClick={() => setShowQR(true)}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] border-t border-white/10"
              >
                <QrCode size={18} /> Tampilkan QR Sirkulasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}