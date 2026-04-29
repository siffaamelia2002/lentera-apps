"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  RotateCcw, Calendar, BookOpen, AlertTriangle, X, FileText, CheckCircle2, 
  ImageOff, User, ShieldCheck, ChevronRight, ChevronLeft
} from "lucide-react";
import { format } from "date-fns";
import api from "@/libs/api-client";

export default function PengembalianClient() {
  const [activeTab, setActiveTab] = useState<"Semua" | "Aman" | "Bermasalah">("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Modal Detail
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // FETCH DATA MURNI DARI PENGEMBALIAN CONTROLLER (TANPA API PREFIX)
  const { data: rawData = [], isLoading } = useQuery({
    queryKey: ["pengembalian-history"],
    queryFn: async () => {
      const res = await api.get("pengembalian");
      return res.data?.data ?? res.data ?? [];
    }
  });

  // Filter Data berdasarkan Tab Kondisi LENTERA
  const filteredData = Array.isArray(rawData) ? rawData.filter((item) => {
    const kondisi = item.kondisi_buku?.toLowerCase() || 'baik';
    if (activeTab === "Semua") return true;
    if (activeTab === "Aman") return kondisi === 'baik';
    if (activeTab === "Bermasalah") return ['rusak', 'hilang'].includes(kondisi);
    return true;
  }) : [];

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tab: "Semua" | "Aman" | "Bermasalah") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // SKELETON UI LOADING - INDIGO THEME
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-slate-800 rounded-lg"></div>
            <div className="h-10 w-64 bg-slate-800 rounded-xl"></div>
          </div>
          <div className="h-20 w-48 bg-slate-800 rounded-3xl"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full bg-slate-900/40 border border-slate-800 rounded-[2rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 selection:bg-indigo-500/30">
      
      {/* MODAL DETAIL PENGEMBALIAN - LENTERA STYLE */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0B1120] border border-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
            <div className="p-8 space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Arsip Log LENTERA</p>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                    {selectedItem.peminjaman?.kode_peminjaman || "DETAIL"}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-500 transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-slate-950 border border-slate-900 rounded-2xl shadow-inner">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><User size={12}/> Peminjam</div>
                    <p className="text-sm font-bold text-white line-clamp-1">{selectedItem.peminjaman?.user?.name || "-"}</p>
                  </div>
                  <div className="flex-1 p-4 bg-slate-950 border border-slate-900 rounded-2xl shadow-inner">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><ShieldCheck size={12}/> Verifikator</div>
                    <p className="text-sm font-bold text-indigo-400 line-clamp-1">{selectedItem.petugas?.name || "-"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <BookOpen size={14} className="text-indigo-500" /> Item Terverifikasi
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                    {selectedItem.peminjaman?.details?.map((det: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-900 rounded-2xl group hover:border-indigo-500/30 transition-all">
                        <span className="text-xs font-bold text-white truncate max-w-[250px] uppercase italic">{det.buku?.judul}</span>
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-lg">x{det.jumlah}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <FileText size={14} className="text-indigo-500" /> Kondisi Fisik & Log
                  </div>
                  <div className="p-5 bg-slate-950 rounded-3xl border border-slate-900 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Kondisi Akhir</span>
                      <span className={`text-xs font-black uppercase tracking-widest ${
                        selectedItem.kondisi_buku === 'baik' ? 'text-indigo-400' : 
                        selectedItem.kondisi_buku === 'rusak' ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {selectedItem.kondisi_buku}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-2">Catatan Sistem:</span>
                      <p className="text-xs text-slate-400 italic leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                        {selectedItem.catatan || "Tidak ada rincian catatan tambahan."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & FILTER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-indigo-500/10 shadow-lg">
                <RotateCcw size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sirkulasi Arus Balik</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              Riwayat <span className="text-indigo-500">Arsip</span>
            </h1>
          </div>
          
          <div className="flex gap-2 bg-[#0B1120] p-1.5 rounded-2xl w-max border border-slate-900 shadow-xl">
            {(["Semua", "Aman", "Bermasalah"] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border-t border-white/10' 
                  : 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-[1px] rounded-[2rem] text-white shrink-0 shadow-2xl shadow-indigo-900/20">
          <div className="bg-[#0B1120] rounded-[1.9rem] p-5 flex items-center gap-5">
            <div className="size-11 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <BookOpen size={22} />
            </div>
            <div className="pr-6">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-0.5 opacity-70">Volume Data</p>
              <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{filteredData.length} <span className="text-xs not-italic text-slate-600 font-bold ml-1 uppercase">Unit</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* LIST KARTU PENGEMBALIAN */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-24 bg-[#0B1120] border border-slate-900 rounded-[3rem] relative overflow-hidden group">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
            <p className="text-slate-600 font-black uppercase text-xs tracking-[0.5em] italic relative z-10">
              ARSIP TIDAK DITEMUKAN
            </p>
          </div>
        ) : (
          paginatedData.map((item) => {
            const kondisi = item.kondisi_buku?.toLowerCase() || 'baik';
            
            let statusColor = "text-indigo-400";
            let borderColor = "border-indigo-500/20";
            let bgBadge = "bg-indigo-500/10";
            let StatusIcon = CheckCircle2;

            if (kondisi === 'rusak') {
              statusColor = "text-amber-500"; borderColor = "border-amber-500/20"; bgBadge = "bg-amber-500/10"; StatusIcon = AlertTriangle;
            } else if (kondisi === 'hilang') {
              statusColor = "text-rose-500"; borderColor = "border-rose-500/20"; bgBadge = "bg-rose-500/10"; StatusIcon = X;
            }

            const bookTitle = item.peminjaman?.details?.[0]?.buku?.judul || "Buku Koleksi";
            const bookCover = item.peminjaman?.details?.[0]?.buku?.cover || null;
            const borrowerName = item.peminjaman?.user?.name || "Siswa LENTERA";

            return (
              <div 
                key={item.id}
                className={`group relative p-6 rounded-[2.5rem] border bg-[#0B1120] hover:border-indigo-500/40 transition-all duration-500 overflow-hidden shadow-xl ${borderColor}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-6">
                    <div className={`relative w-[80px] h-[104px] shrink-0 rounded-2xl overflow-hidden border bg-slate-950 shadow-2xl transition-transform duration-500 group-hover:scale-105 ${borderColor}`}>
                      {bookCover ? (
                        <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-800">
                          <ImageOff size={28} />
                        </div>
                      )}
                      <div className={`absolute top-0 right-0 p-2 rounded-bl-2xl backdrop-blur-md border-b border-l bg-slate-900/90 ${borderColor}`}>
                        <StatusIcon size={14} className={statusColor} />
                      </div>
                    </div>

                    <div className="space-y-2 py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                          {item.peminjaman?.kode_peminjaman || "-"}
                        </span>
                        <div className={`text-[9px] font-black uppercase italic inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${borderColor} ${bgBadge} ${statusColor}`}>
                          <div className={`size-1.5 rounded-full bg-current`} />
                          Kondisi: {kondisi}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors line-clamp-1 leading-tight">
                        {bookTitle} {item.peminjaman?.details?.length > 1 && <span className="text-slate-600 text-sm not-italic ml-1">+{item.peminjaman.details.length - 1} ARSIP</span>}
                      </h3>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 italic">
                        <User size={12} className="text-indigo-500/50"/> {borrowerName}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8 ml-0 md:ml-auto">
                    <div className="bg-slate-950/50 px-6 py-4 rounded-[1.5rem] border border-slate-900 shadow-inner">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1.5 opacity-70">
                        Final Check-In
                      </p>
                      <div className={`flex items-center gap-2.5 font-black text-sm text-white italic tracking-tight`}>
                        <Calendar size={14} className="text-indigo-500" />
                        {item.tanggal_dikembalikan ? format(new Date(item.tanggal_dikembalikan), "dd MMM yyyy") : "-"}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 md:flex-none text-[10px] font-black text-white uppercase tracking-[0.2em] bg-indigo-600 border border-indigo-400/30 px-8 py-5 rounded-2xl hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
                    >
                      Detail & Log
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION - LENTERA STYLE */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-10">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-4 rounded-2xl border border-slate-800 bg-[#0B1120] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 disabled:opacity-20 transition-all shadow-lg active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center bg-[#0B1120] border border-slate-900 p-1.5 rounded-[1.5rem] shadow-inner">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`min-w-[44px] h-11 rounded-xl text-[11px] font-black tracking-tighter transition-all duration-300 ${
                  currentPage === i + 1 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-600 hover:text-white hover:bg-indigo-500/5'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-4 rounded-2xl border border-slate-800 bg-[#0B1120] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 disabled:opacity-20 transition-all shadow-lg active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}