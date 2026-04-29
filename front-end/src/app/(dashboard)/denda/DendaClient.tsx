"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Receipt, Clock, CheckCircle2, AlertTriangle, 
  Calendar, QrCode, X, ImageOff, Banknote, ShieldCheck,
  ChevronRight, ArrowUpRight, Wallet, Info
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; 
import api from "@/libs/api-client";
import { useUserStore } from "@/store/useUserStore"; // 🔥 Import store

export default function DendaClient() {
  // 🔥 Ambil data global dan fungsi setter dari store
  const { data: globalData, setGlobalData } = useUserStore();
  
  // 🔥 Gunakan key 'denda'
  const dendaData = globalData.denda;

  // 🔥 Loading false jika data denda sudah ada di store (cache)
  const [loading, setLoading] = useState(!dendaData);
  const [activeTab, setActiveTab] = useState<"Semua" | "Belum Bayar" | "Lunas">("Semua");
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchDenda = async () => {
      try {
        const response = await api.get("/denda"); 
        const result = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        // 🔥 Simpan ke store global dengan key "denda"
        setGlobalData("denda", result);
      } catch (error) {
        console.error("Gagal memuat data denda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDenda();
  }, [setGlobalData]);

  // Data yang diproses diambil dari store
  const displayData = dendaData || [];

  const filteredData = displayData.filter(item => {
    if (activeTab === "Belum Bayar") return item.status_pembayaran === "belum_bayar";
    if (activeTab === "Lunas") return item.status_pembayaran === "lunas";
    return true;
  });

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  // 🔥 Skeleton UI hanya muncul jika data benar-benar kosong (first load)
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
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 selection:bg-emerald-500/30">
      
      {/* MODAL QR PEMBAYARAN */}
      {selectedItem && showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-slate-800 w-full max-w-sm rounded-[3.5rem] overflow-hidden shadow-2xl p-8 space-y-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Payment Ref</p>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                  {selectedItem.peminjaman?.kode_peminjaman || 'N/A'}
                </h2>
              </div>
              <button 
                onClick={() => {setSelectedItem(null); setShowQR(false)}} 
                className="p-2 bg-slate-900 hover:bg-rose-500/10 rounded-2xl text-slate-500 hover:text-rose-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="p-6 bg-white rounded-[3rem] shadow-2xl shadow-emerald-500/20 ring-8 ring-slate-900/50">
                <QRCodeSVG value={selectedItem.peminjaman?.kode_peminjaman || "0"} size={180} level="H" />
              </div>
              <div className="text-center space-y-3">
                <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                   <p className="text-2xl font-black text-emerald-500 tracking-tighter">{formatRupiah(selectedItem.jumlah_denda)}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[220px] mx-auto">
                  Scan QR ini di meja petugas perpustakaan untuk pelunasan.
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
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Finance Center</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Status <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Denda</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-[2rem] border border-slate-800/50">
          <div className="bg-[#0B1120] border border-slate-800 px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-xl">
            <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Record</p>
              <p className="text-2xl font-black text-white italic leading-none mt-1">
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
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shrink-0 ${
                activeTab === tab 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
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
          const peminjaman = item.peminjaman;
          const bookDetail = peminjaman?.details?.[0]?.buku;
          const bookTitle = bookDetail?.judul || "Informasi Buku";
          const bookCover = bookDetail?.cover || null;
          const kategoriName = item.kategori_denda?.nama_kategori || "Biaya Layanan";

          return (
            <div key={item.id} className={`group relative bg-[#0B1120] border p-1 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.01] ${isLunas ? 'border-emerald-900/30 hover:border-emerald-500/50' : 'border-rose-900/50 hover:border-rose-500/50'}`}>
              <div className={`flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-[2.3rem] ${isLunas ? 'bg-gradient-to-br from-emerald-500/[0.03] to-transparent' : 'bg-gradient-to-br from-rose-500/[0.03] to-transparent'}`}>
                
                <div className="flex-1 flex items-start gap-6">
                  <div className={`relative w-[70px] h-[95px] shrink-0 rounded-2xl overflow-hidden border-2 shadow-2xl transition-transform group-hover:-rotate-2 ${isLunas ? 'border-emerald-900/50' : 'border-rose-900/50'}`}>
                    {bookCover ? (
                      <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-700">
                        <ImageOff size={24} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {peminjaman?.kode_peminjaman || "NO-REF"}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                        isLunas ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                      }`}>
                        {isLunas ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {isLunas ? 'Clear' : 'Pending'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {bookTitle}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-1">
                        {kategoriName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:pl-10 md:border-l border-slate-900/80">
                  <div className="space-y-1.5 md:text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      {isLunas ? 'Diterima Pada' : 'Tagihan'}
                    </p>
                    {isLunas ? (
                      <div className="flex flex-col md:items-end">
                        <span className="text-emerald-400 text-lg font-black tracking-tighter italic leading-none">SUCCESS</span>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase mt-1">
                          <Calendar size={12} />
                          {item.tanggal_pembayaran ? format(new Date(item.tanggal_pembayaran), "dd MMM yyyy") : '-'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-500 text-2xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                        <Banknote size={20} className="text-rose-600" />
                        {formatRupiah(item.jumlah_denda)}
                      </div>
                    )}
                  </div>
                  
                  {!isLunas ? (
                    <button 
                      onClick={() => { setSelectedItem(item); setShowQR(true); }}
                      className="p-5 bg-rose-600 hover:bg-rose-500 text-white rounded-3xl transition-all shadow-xl shadow-rose-600/20 active:scale-95 border-b-4 border-rose-800"
                    >
                      <QrCode size={22} />
                    </button>
                  ) : (
                    <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-3xl border border-emerald-500/20">
                      <CheckCircle2 size={22} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-32 bg-[#0B1120] border-2 border-dashed border-slate-900 rounded-[4rem]">
            <Receipt size={40} className="mx-auto text-emerald-500/20 mb-6" />
            <p className="text-emerald-500 font-black uppercase text-xs tracking-[0.3em] italic mb-2">Zero Balance</p>
            <p className="text-slate-600 font-medium text-sm max-w-xs mx-auto">Semua tagihan denda sudah diselesaikan.</p>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="bg-[#0B1120] border border-emerald-900/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-6 justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20">
            <Info size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Informasi Penting</p>
            <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-md">
              Keterlambatan pengembalian buku dikenakan denda sesuai peraturan. Hubungi petugas jika ada ketidaksesuaian data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}