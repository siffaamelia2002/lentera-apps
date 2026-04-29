"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  RotateCcw, Calendar, Clock, ChevronRight, ChevronLeft,
  BookOpen, AlertTriangle, X, FileText, CheckCircle2, 
  ImageOff, User, ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import api from "@/libs/api-client";

export default function PengembalianClient() {
  const [activeTab, setActiveTab] = useState<"Semua" | "Aman" | "Bermasalah">("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Modal
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // FETCH DATA MURNI DARI PENGEMBALIAN CONTROLLER
  const { data: rawData = [], isLoading } = useQuery({
    queryKey: ["pengembalian-history"],
    queryFn: async () => {
      const res = await api.get("pengembalian");
      return res.data?.data ?? res.data ?? [];
    }
  });

  // Filter Data berdasarkan Tab Kondisi
  const filteredData = Array.isArray(rawData) ? rawData.filter((item) => {
    const kondisi = item.kondisi_buku?.toLowerCase() || 'baik';
    if (activeTab === "Semua") return true;
    if (activeTab === "Aman") return kondisi === 'baik';
    if (activeTab === "Bermasalah") return ['rusak', 'hilang'].includes(kondisi);
    return true;
  }) : [];

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page kalau tab berubah
  const handleTabChange = (tab: "Semua" | "Aman" | "Bermasalah") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // SKELETON UI LOADING
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
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 selection:bg-emerald-500/30">
      
      {/* MODAL DETAIL PENGEMBALIAN */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0B1120] border border-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Log Sistem</p>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                    {selectedItem.peminjaman?.kode_peminjaman || "DETAIL"}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="p-2 hover:bg-slate-900 rounded-full text-slate-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Info Siswa & Petugas */}
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-slate-950 rounded-2xl border border-slate-900 space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><User size={12}/> Peminjam</div>
                    <p className="text-sm font-bold text-white line-clamp-1">{selectedItem.peminjaman?.user?.name || "-"}</p>
                  </div>
                  <div className="flex-1 p-4 bg-slate-950 rounded-2xl border border-slate-900 space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2"><ShieldCheck size={12}/> Penerima</div>
                    <p className="text-sm font-bold text-emerald-400 line-clamp-1">{selectedItem.petugas?.name || "-"}</p>
                  </div>
                </div>

                {/* Info Buku */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <BookOpen size={14} /> Buku Dikembalikan
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                    {selectedItem.peminjaman?.details?.map((det: any, i: number) => (
                      <div key={i} className="flex flex-col p-3 bg-slate-950 border border-slate-900 rounded-2xl gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate w-48">{det.buku?.judul}</span>
                            <span className="text-[10px] font-black text-emerald-500">{det.jumlah} Unit</span>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Kondisi & Catatan */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <FileText size={14} /> Kondisi & Catatan
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Kondisi Final</span>
                      <span className={`text-xs font-black uppercase tracking-wider ${
                        selectedItem.kondisi_buku === 'baik' ? 'text-emerald-400' : 
                        selectedItem.kondisi_buku === 'rusak' ? 'text-amber-400' : 'text-rose-500'
                      }`}>
                        {selectedItem.kondisi_buku}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Catatan Petugas:</span>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        {selectedItem.catatan || "Tidak ada catatan pengembalian."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & SUMMARY */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <RotateCcw size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">History System</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              Riwayat <span className="text-emerald-500">Kembali</span>
            </h1>
          </div>
          
          <div className="flex gap-2 bg-[#0B1120] p-1.5 rounded-2xl w-max border border-slate-900">
            {(["Semua", "Aman", "Bermasalah"] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)} 
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-[1px] rounded-3xl text-white shrink-0">
          <div className="bg-[#0B1120] rounded-[1.7rem] p-4 flex items-center gap-5">
            <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <BookOpen size={20} />
            </div>
            <div className="pr-4">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Data Tampil</p>
              <p className="text-xl font-black text-white italic tracking-tighter">{filteredData.length} Catatan</p>
            </div>
          </div>
        </div>
      </header>

      {/* LIST KARTU PENGEMBALIAN */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-[#0B1120] border border-slate-900 rounded-[2rem]">
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest italic">
              Tidak ada data riwayat di tab ini
            </p>
          </div>
        ) : (
          paginatedData.map((item) => {
            const kondisi = item.kondisi_buku?.toLowerCase() || 'baik';
            
            // Konfigurasi Warna berdasarkan Kondisi
            let statusColor = "text-emerald-500";
            let borderColor = "border-emerald-500/30";
            let bgBadge = "bg-emerald-500/10";
            let StatusIcon = CheckCircle2;

            if (kondisi === 'rusak') {
              statusColor = "text-amber-500"; borderColor = "border-amber-500/30"; bgBadge = "bg-amber-500/10"; StatusIcon = AlertTriangle;
            } else if (kondisi === 'hilang') {
              statusColor = "text-rose-500"; borderColor = "border-rose-500/30"; bgBadge = "bg-rose-500/10"; StatusIcon = X;
            }

            const bookTitle = item.peminjaman?.details?.[0]?.buku?.judul || "Buku Koleksi";
            const bookCover = item.peminjaman?.details?.[0]?.buku?.cover || null;
            const borrowerName = item.peminjaman?.user?.name || "Siswa";

            return (
              <div 
                key={item.id}
                className={`group relative p-6 rounded-[2rem] border bg-[#0B1120] hover:border-slate-700 transition-all duration-500 overflow-hidden ${borderColor}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className={`relative w-[72px] h-[96px] shrink-0 rounded-2xl overflow-hidden border bg-slate-900 shadow-xl ${borderColor}`}>
                      {bookCover ? (
                        <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-950">
                          <ImageOff size={24} />
                        </div>
                      )}
                      <div className={`absolute top-0 right-0 p-1.5 rounded-bl-xl backdrop-blur-md border-b border-l text-white bg-slate-900/80`}>
                        <StatusIcon size={14} className={statusColor} />
                      </div>
                    </div>

                    <div className="space-y-1 py-1">
                      <span className="text-[9px] font-black text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md uppercase italic">
                        {item.peminjaman?.kode_peminjaman || "-"}
                      </span>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-slate-300 transition-colors line-clamp-1">
                        {bookTitle} {item.peminjaman?.details?.length > 1 && <span className="text-slate-500 text-sm italic">+{item.peminjaman.details.length - 1}</span>}
                      </h3>
                      <div className="text-[10px] font-black uppercase italic text-slate-400 flex items-center gap-1.5">
                        <User size={12} className="text-slate-500"/> {borrowerName}
                      </div>
                      <div className={`text-[9px] font-black uppercase italic inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md border ${borderColor} ${bgBadge} ${statusColor}`}>
                        <div className={`size-1.5 rounded-full bg-current`} />
                        Kondisi: {kondisi}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:gap-6 ml-0 md:ml-auto">
                    <div className="bg-slate-950/50 px-5 py-3 rounded-2xl border border-slate-800/50">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-1">
                        Tanggal Kembali
                      </p>
                      <div className={`flex items-center gap-2 font-bold text-xs text-slate-300`}>
                        <Calendar size={12} className="text-emerald-500" />
                        {item.tanggal_dikembalikan ? format(new Date(item.tanggal_dikembalikan), "dd MMM yyyy") : "-"}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 md:flex-none text-[10px] font-black text-white uppercase tracking-widest bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl hover:bg-slate-900 transition-all active:scale-95"
                      >
                        Detail & Log
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-xl border border-slate-900 bg-[#0B1120] text-slate-400 hover:text-emerald-500 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center bg-[#0B1120] border border-slate-900 p-1 rounded-2xl">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`min-w-[40px] h-10 rounded-xl text-[11px] font-black transition-all ${
                  currentPage === i + 1 ? 'bg-emerald-500 text-[#0B1120]' : 'text-slate-500 hover:text-white'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl border border-slate-900 bg-[#0B1120] text-slate-400 hover:text-emerald-500 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}