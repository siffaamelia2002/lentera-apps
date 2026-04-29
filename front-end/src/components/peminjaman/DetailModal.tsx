// components/peminjaman/DetailModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, QrCode, Calendar, Book, ImageOff } from "lucide-react";
import { format, isValid } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

export default function DetailModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [showQR, setShowQR] = useState(false);

  // Reset view QR kalau modal ditutup atau ganti item
  useEffect(() => {
    if (!item) setShowQR(false);
  }, [item]);

  if (!item) return null;

  const details = item.details || [];

  // Helper Format Tanggal + Jam yang Aman
  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return "-";
    const dateObj = new Date(dateStr);
    return isValid(dateObj) ? format(dateObj, "dd MMM yyyy • HH:mm") : "Tanggal Invalid";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0B1120] border border-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          
          {/* Header Modal */}
          <div className="flex justify-between items-start border-b border-slate-900 pb-4">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">
                Detail Transaksi
              </p>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {item.kode_peminjaman}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-900 rounded-full text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {showQR ? (
            /* TAMPILAN QR CODE */
            <div className="flex flex-col items-center justify-center py-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-500/20">
                <QRCodeSVG value={item.kode_peminjaman} size={200} level="H" />
              </div>
              <div className="text-center space-y-2 px-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                  Tunjukkan QR ini ke petugas untuk verifikasi pengembalian
                </p>
              </div>
              <button 
                onClick={() => setShowQR(false)} 
                className="text-emerald-500 text-[10px] font-black uppercase underline tracking-[0.2em] hover:text-emerald-400 transition-colors"
              >
                Kembali ke Info
              </button>
            </div>
          ) : (
            /* TAMPILAN INFO DETAIL */
            <div className="space-y-6 animate-in fade-in duration-500">
              
              {/* List Buku dengan Gambar per Baris */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Book size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Daftar Buku ({details.length})</p>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {details.map((det: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-900 rounded-2xl group hover:border-emerald-500/30 transition-all">
                       {/* Gambar Kecil per List */}
                       <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
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
                          <p className="text-[11px] font-bold text-white truncate group-hover:text-emerald-500 transition-colors uppercase italic italic tracking-tight">
                            {det.buku?.judul}
                          </p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter mt-0.5">
                            ISBN: {det.buku?.isbn || "N/A"}
                          </p>
                       </div>

                       <div className="text-right shrink-0">
                         <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {det.jumlah} Unit
                         </span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Waktu Pinjam</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white italic">
                    <Calendar size={12} className="text-emerald-500" />
                    {formatDateFull(item.tanggal_pinjam)}
                  </div>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Batas Kembali</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 italic">
                    <Calendar size={12} />
                    {formatDateFull(item.tanggal_kembali_seharusnya)}
                  </div>
                </div>
              </div>

              {/* Button Action */}
              <button 
                onClick={() => setShowQR(true)}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
              >
                <QrCode size={18} /> Tampilkan QR Pinjam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}