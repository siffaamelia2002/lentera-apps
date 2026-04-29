"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Receipt, CheckCircle2, AlertTriangle, 
  Calendar, QrCode, X, ImageOff, Banknote, ShieldCheck,
  Info
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; 
import api from "@/libs/api-client";
import { useUserStore } from "@/store/useUserStore";

export default function DendaClient() {
  // Menggunakan store global untuk sinkronisasi data
  const { data: globalData, setGlobalData } = useUserStore();
  const dendaData = globalData.denda;

  const [loading, setLoading] = useState(!dendaData);
  const [activeTab, setActiveTab] = useState<"Semua" | "Belum Bayar" | "Lunas">("Semua");
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchDenda = async () => {
      try {
        // Endpoint sirkulasi denda tanpa prefix api
        const response = await api.get("/denda"); 
        const result = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        setGlobalData("denda", result);
      } catch (error) {
        console.error("Gagal sinkronisasi data denda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDenda();
  }, [setGlobalData]);

  const displayData = dendaData || [];

  const filteredData = displayData.filter(item => {
    if (activeTab === "Belum Bayar") return item.status_pembayaran === "belum_bayar";
    if (activeTab === "Lunas") return item.status_pembayaran === "lunas";
    return true;
  });

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(angka);
  };

  if (loading && !dendaData) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 animate-pulse">
        <div className="h-12 w-72 bg-slate-900 rounded-2xl mb-10"></div>
        <div className="h-16 w-full bg-slate-900 rounded-[2rem]"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 w-full bg-slate-900/40 border border-slate-800 rounded-[2.5rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 selection:bg-indigo-500/30">
      
      {/* MODAL QR PEMBAYARAN */}
      {selectedItem && showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-slate-800 w-full max-w-sm rounded-[3.5rem] overflow-hidden shadow-2xl p-8 space-y-6 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Billing Reference</p>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                  {selectedItem.peminjaman?.kode_peminjaman || 'N/A'}
                </h2>
              </div>
              <button 
                onClick={() => {setSelectedItem(null); setShowQR(false)}} 
                className="p-2.5 bg-slate-900 hover:bg-rose-500/10 rounded-xl text-slate-500 hover:text-rose-500 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="p-6 bg-white rounded-[3rem] shadow-2xl shadow-indigo-500/20 ring-8 ring-indigo-950/50">
                <QRCodeSVG value={selectedItem.peminjaman?.kode_peminjaman || "0"} size={180} level="H" />
              </div>
              <div className="text-center space-y-4">
                <div className="inline-block px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                   <p className="text-2xl font-black text-indigo-400 tracking-tighter">{formatRupiah(selectedItem.jumlah_denda)}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[220px] mx-auto italic">
                  Gunakan QR ini untuk verifikasi transaksi di Terminal Petugas LENTERA.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Financial Node</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Denda <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Tagihan</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-[2rem] border border-slate-800/50 backdrop-blur-sm">
          <div className="bg-[#0B1120] border border-slate-800 px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-2xl">
            <div className="size-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Record Density</p>
              <p className="text-2xl font-black text-white italic leading-none mt-1.5">
                {displayData.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="flex p-1.5 bg-slate-950/80 backdrop-blur-xl rounded-2xl gap-1.5 w-max border border-slate-800 shadow-2xl">
        {(["Semua", "Belum Bayar", "Lunas"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 active:scale-95 ${
                activeTab === tab 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border-t border-white/10" 
                : "text-slate-600 hover:text-indigo-400 hover:bg-slate-900/50"
              }`}
            >
              {tab}
            </button>
        ))}
      </div>

      {/* CARDS LIST */}
      <div className="grid gap-5">
        {filteredData.length > 0 ? filteredData.map((item) => {
          const isLunas = item.status_pembayaran === 'lunas';
          const bookDetail = item.peminjaman?.details?.[0]?.buku;
          const bookTitle = bookDetail?.judul || "Informasi Arsip";
          const bookCover = bookDetail?.cover || null;
          const kategoriName = item.kategori_denda?.nama_pelanggaran || "Biaya Layanan";

          return (
            <div key={item.id} className={`group relative bg-[#0B1120] border p-1 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.01] ${isLunas ? 'border-indigo-900/30 hover:border-indigo-500/50' : 'border-rose-900/50 hover:border-rose-500/50'}`}>
              <div className={`flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-[2.3rem] ${isLunas ? 'bg-gradient-to-br from-indigo-500/[0.03] to-transparent' : 'bg-gradient-to-br from-rose-500/[0.03] to-transparent'}`}>
                
                <div className="flex-1 flex items-start gap-6">
                  <div className={`relative w-[75px] h-[100px] shrink-0 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-500 group-hover:rotate-1 ${isLunas ? 'border-indigo-900/50' : 'border-rose-900/50'}`}>
                    {bookCover ? (
                      <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-800">
                        <ImageOff size={24} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                        {item.peminjaman?.kode_peminjaman || "NO-REF"}
                      </span>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                        isLunas ? 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20 animate-pulse'
                      }`}>
                        {isLunas ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {isLunas ? 'Cleared' : 'Settlement'}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {bookTitle}
                      </h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">
                        {kategoriName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 md:pl-10 md:border-l border-slate-900/80">
                  <div className="space-y-1.5 md:text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] leading-none">
                      {isLunas ? 'Verification Date' : 'Outstanding Balance'}
                    </p>
                    {isLunas ? (
                      <div className="flex flex-col md:items-end">
                        <span className="text-indigo-400 text-lg font-black tracking-tighter italic leading-none">VERIFIED</span>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase mt-1.5">
                          <Calendar size={12} className="text-indigo-500/50" />
                          {item.tanggal_pembayaran ? format(new Date(item.tanggal_pembayaran), "dd MMM yyyy") : '-'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-rose-500 text-2xl font-black tracking-tighter drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                        <Banknote size={20} className="text-rose-600" />
                        {formatRupiah(item.jumlah_denda)}
                      </div>
                    )}
                  </div>
                  
                  {!isLunas ? (
                    <button 
                      onClick={() => { setSelectedItem(item); setShowQR(true); }}
                      className="p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl transition-all shadow-xl shadow-indigo-900/30 active:scale-90 border-t border-white/20"
                    >
                      <QrCode size={22} />
                    </button>
                  ) : (
                    <div className="p-5 bg-indigo-500/10 text-indigo-400 rounded-3xl border border-indigo-500/20">
                      <CheckCircle2 size={22} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-32 bg-[#0B1120] border-2 border-dashed border-slate-900 rounded-[4rem] relative overflow-hidden group">
            <Receipt size={48} strokeWidth={1} className="mx-auto text-indigo-500/10 mb-6 group-hover:scale-110 transition-transform duration-700" />
            <p className="text-indigo-500 font-black uppercase text-xs tracking-[0.5em] italic mb-3">System Clear</p>
            <p className="text-slate-600 font-medium text-sm max-w-xs mx-auto uppercase tracking-tighter">Seluruh kewajiban arsip telah terpenuhi.</p>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="bg-[#0B1120] border border-indigo-900/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-6 justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50"></div>
        <div className="flex items-center gap-5">
          <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20 shadow-inner">
            <Info size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Service Protocol</p>
            <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-lg uppercase tracking-tight italic">
              Prosedur denda diatur secara sistematis untuk menjaga integritas sirkulasi arsip LENTERA. Hubungi Admin pusat jika memerlukan audit data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}