import React from 'react';
import { ArrowRight, Book, Clock, CheckCircle2, LayoutGrid, Search, Bell, Star, ChevronRight, Bookmark, QrCode } from "lucide-react";

export default function HeroPeminjamanBalanced() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-40 pb-20 px-6 overflow-hidden bg-[#020617] font-sans">
      
      {/* Efek Cahaya Latar (Background Ornaments) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-500/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-teal-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- KOLOM KIRI: TEKS --- */}
          <div className="flex flex-col items-start space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Sistem Literasi Modern</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              PINJAM BUKU <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 italic font-light">
                TANPA ANTRI.
              </span>
            </h1>

            <p className="max-w-md text-slate-400 text-lg leading-relaxed font-medium">
              Kelola peminjaman buku perpustakaan Anda dengan antarmuka modern yang secepat kilat dan efisien. Pantau masa pinjam dalam satu genggaman.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <button className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3">
                MULAI SEKARANG <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mini Stats/Features */}
            <div className="flex gap-8 pt-8 border-t border-white/5 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={18} />
                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">Automated</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-emerald-500" size={18} />
                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">Real-time Status</span>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: MOCKUP HP --- */}
          <div className="relative flex items-center justify-center lg:justify-end order-1 lg:order-2">
            {/* Glow di belakang HP */}
            <div className="absolute w-[350px] h-[350px] bg-emerald-500/20 blur-[100px] rounded-full animate-pulse lg:right-10" />

            {/* Frame HP */}
            <div className="relative w-[300px] h-[620px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_50px_100px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden transform lg:hover:-rotate-2 transition-transform duration-500">
              
              {/* Screen Content - Realistic App UI */}
              <div className="absolute inset-0 bg-[#0B1120] flex flex-col">
                
                {/* Status Bar (Simulated) */}
                <div className="h-7 w-full flex justify-between items-center px-6 pt-2">
                  <span className="text-[10px] font-medium text-slate-300">9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-3 h-3 rounded-full border border-slate-300/50" />
                    <div className="w-3 h-3 rounded-full border border-slate-300/50" />
                    <div className="w-4 h-2.5 rounded-sm border border-slate-300/50" />
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col px-5 pt-3 pb-20 gap-5 custom-scrollbar">
                  
                  {/* Header App - LOGO LIBRA */}
                  <div className="flex justify-between items-center">
                    {/* Logo Libra disesuaikan ukurannya untuk HP */}
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0 group">
                        <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-lg opacity-100 transition-all duration-700" />
                        <div className="relative w-9 h-9 bg-gradient-to-br from-white to-slate-200 rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500">
                          <div className="w-3.5 h-3.5 bg-slate-950 rounded-sm rotate-45 transition-all duration-500" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-base font-black text-white tracking-[0.2em] leading-none uppercase">LIBRA</h1>
                        <p className="text-[6px] uppercase tracking-[0.3em] text-emerald-400 font-black mt-1 opacity-80">Sistem Digital</p>
                      </div>
                    </div>
                    
                    {/* Foto Profil Pengguna */}
                    <button className="relative rounded-full border-2 border-slate-800 hover:border-emerald-500/50 transition-colors">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                        alt="User Avatar" 
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0B1120]"></span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full mt-2">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Cari buku untuk dipinjam..." 
                      className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      readOnly
                    />
                  </div>

                  {/* Pinjaman Aktif (Fokus pada Peminjaman, bukan membaca) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <h3 className="text-white text-sm font-bold">Pinjaman Aktif</h3>
                      <span className="text-emerald-500 text-[10px] font-bold uppercase cursor-pointer hover:text-emerald-400">Lihat Semua</span>
                    </div>
                    
                    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-3.5 rounded-3xl border border-white/5 shadow-lg overflow-hidden group">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full"></div>
                      <div className="flex gap-4 relative z-10">
                        <img 
                          src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=150&auto=format&fit=crop" 
                          alt="Book Cover" 
                          className="w-16 h-24 object-cover rounded-xl shadow-lg border border-white/10"
                        />
                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Clock size={10} className="text-rose-400" />
                              <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Tenggat: 2 Hari Lagi</p>
                            </div>
                            <h4 className="text-white text-sm font-bold leading-tight mb-0.5 line-clamp-1">Filosofi Teras</h4>
                            <p className="text-slate-400 text-[10px]">Henry Manampiring</p>
                          </div>
                          
                          {/* Tombol Aksi Peminjaman */}
                          <div className="flex gap-2 mt-2">
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-lg border border-white/5 transition-colors">
                              Perpanjang
                            </button>
                            <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold py-1.5 rounded-lg border border-emerald-500/20 transition-colors">
                              Kembalikan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Rak / Kategori */}
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide mt-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <button className="whitespace-nowrap px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20">Tersedia</button>
                    <button className="whitespace-nowrap px-4 py-2 bg-slate-800/50 text-slate-300 text-xs font-medium rounded-xl border border-white/5 hover:bg-slate-800">Buku Baru</button>
                    <button className="whitespace-nowrap px-4 py-2 bg-slate-800/50 text-slate-300 text-xs font-medium rounded-xl border border-white/5 hover:bg-slate-800">Fiksi</button>
                    <button className="whitespace-nowrap px-4 py-2 bg-slate-800/50 text-slate-300 text-xs font-medium rounded-xl border border-white/5 hover:bg-slate-800">Sains</button>
                  </div>

                  {/* Rekomendasi Horizontal */}
                  <div className="flex flex-col gap-3 pb-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white text-sm font-bold">Populer Dipinjam</h3>
                      <ChevronRight size={16} className="text-slate-500" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {/* Book 1 */}
                      <div className="flex-none w-28 group cursor-pointer">
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                          <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center">
                            <Bookmark size={10} className="text-emerald-400" />
                          </div>
                        </div>
                        <h4 className="text-white text-xs font-bold truncate">Atomic Habits</h4>
                        <p className="text-emerald-500 text-[10px] font-medium mt-0.5">Tersedia 2 Salinan</p>
                      </div>
                      
                      {/* Book 2 */}
                      <div className="flex-none w-28 group cursor-pointer">
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                          <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="text-white text-xs font-bold truncate">The Alchemist</h4>
                        <p className="text-rose-400 text-[10px] font-medium mt-0.5">Sedang Dipinjam</p>
                      </div>

                       {/* Book 3 */}
                       <div className="flex-none w-28 group cursor-pointer">
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                          <img src="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=200&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="text-white text-xs font-bold truncate">Sapiens</h4>
                        <p className="text-emerald-500 text-[10px] font-medium mt-0.5">Tersedia 5 Salinan</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Navigation (Floating style inside phone) */}
                <div className="absolute bottom-5 left-5 right-5 h-16 bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-around shadow-[0_20px_40px_rgba(0,0,0,0.8)] px-2 z-20">
                  <button className="flex flex-col items-center gap-1 w-12 text-emerald-500 transition-colors">
                    <LayoutGrid size={20} />
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  </button>
                  <button className="flex flex-col items-center gap-1 w-12 text-slate-500 hover:text-slate-300 transition-colors">
                    <Search size={20} />
                  </button>
                  
                  {/* Center Action Button (Scan Barcode Buku) */}
                  <div className="relative -top-5">
                    <button className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_10px_20px_rgba(16,185,129,0.4)] border-4 border-[#0B1120] hover:scale-105 transition-transform group">
                      <QrCode size={24} className="text-slate-950 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  
                  <button className="flex flex-col items-center gap-1 w-12 text-slate-500 hover:text-slate-300 transition-colors">
                    <Bookmark size={20} />
                  </button>
                  <button className="flex flex-col items-center gap-1 w-12 text-slate-500 hover:text-slate-300 transition-colors">
                    <Book size={20} />
                  </button>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600/50 rounded-full z-20"></div>

              </div>
            </div>

            {/* Label Floating */}
            <div className="absolute -left-8 top-1/3 bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl hidden md:flex items-center gap-3 animate-bounce shadow-emerald-500/10 z-20">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Buku Dikembalikan</p>
                <p className="text-xs font-bold text-white">Bebas Denda</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}