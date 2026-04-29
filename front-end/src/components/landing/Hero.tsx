import React from 'react';
import { ArrowRight, Book, Clock, CheckCircle2, LayoutGrid, Search, ChevronRight, Bookmark, QrCode, ShieldCheck, Lamp } from "lucide-react";

export default function HeroLenteraSirkulasi() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-40 pb-20 px-6 overflow-hidden bg-[#020617] font-sans">
      
      {/* Background Ornaments - LENTERA Indigo Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- KOLOM KIRI: BRANDING --- */}
          <div className="flex flex-col items-start space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Arsip Sirkulasi Modern</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter uppercase">
              RESERVASI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 italic font-light">
                ARSIP DIGITAL.
              </span>
            </h1>

            <p className="max-w-md text-slate-400 text-lg leading-relaxed font-medium">
              Navigasi transaksi literasi Anda dengan LENTERA. Sistem sirkulasi yang dirancang untuk kecepatan, keamanan, dan efisiensi manajemen inventaris arsip.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <button className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 border-t border-white/20 active:scale-95">
                MULAI RESERVASI <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Core Features */}
            <div className="flex gap-8 pt-8 border-t border-white/5 w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-indigo-500" size={18} />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Secure Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-indigo-500" size={18} />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Real-time Node</span>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: MOCKUP HP --- */}
          <div className="relative flex items-center justify-center lg:justify-end order-1 lg:order-2">
            {/* Glow Indigo behind Phone */}
            <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse lg:right-0" />

            {/* Frame HP */}
            <div className="relative w-[300px] h-[620px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 overflow-hidden transform lg:hover:-rotate-1 lg:hover:scale-[1.02] transition-all duration-700 group">
              
              {/* Screen Content */}
              <div className="absolute inset-0 bg-[#0B1120] flex flex-col">
                
                {/* Status Bar */}
                <div className="h-7 w-full flex justify-between items-center px-6 pt-2">
                  <span className="text-[10px] font-black text-indigo-500/80 tracking-tighter uppercase italic">LENTERA.OS</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <div className="w-3 h-2 rounded-sm border border-indigo-500/30" />
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col px-5 pt-4 pb-20 gap-5">
                  
                  {/* --- LOGO LENTERA (Visual Lampu/Lentera) --- */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0 group">
                        {/* Efek Pendaran Lampu */}
                        <div className="absolute -inset-2 bg-indigo-500/40 rounded-full blur-xl opacity-100 animate-pulse transition-all duration-700" />
                        <div className="relative w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border-t border-white/20">
                          <Lamp size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-sm font-black text-white tracking-[0.2em] leading-none uppercase italic">LENTERA</h1>
                        <p className="text-[7px] uppercase tracking-[0.4em] text-indigo-400 font-black mt-1 opacity-80">Digital Flow</p>
                      </div>
                    </div>
                    
                    <div className="w-9 h-9 rounded-full border-2 border-slate-800 p-0.5 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                        alt="User" 
                        className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  </div>

                  {/* Search Bar - LENTERA Node */}
                  <div className="relative w-full">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/50" />
                    <input 
                      type="text" 
                      placeholder="Cari sirkulasi arsip..." 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-[10px] text-white placeholder:text-slate-600 focus:outline-none"
                      readOnly
                    />
                  </div>

                  {/* Active Sirkulasi Card */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Sirkulasi Aktif</h3>
                    <div className="relative bg-[#0F172A] p-4 rounded-[2rem] border border-indigo-500/20 shadow-xl overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-1 bg-indigo-600" />
                      <div className="flex gap-4">
                        <div className="w-16 h-20 bg-slate-800 rounded-xl overflow-hidden border border-white/5 shrink-0 shadow-2xl">
                          <img 
                            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=150&auto=format&fit=crop" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <p className="text-[8px] font-black text-rose-500 uppercase">Overdue: 48h</p>
                            </div>
                            <h4 className="text-white text-xs font-black uppercase tracking-tight italic">Filosofi Teras</h4>
                            <p className="text-slate-500 text-[8px] uppercase tracking-widest font-bold">H. Manampiring</p>
                          </div>
                          <button className="w-full bg-indigo-600 py-1.5 rounded-lg text-[8px] font-black text-white uppercase tracking-widest border-t border-white/20 active:scale-95 transition-transform">Kembalikan</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl shadow-inner">
                      <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Pinjam</p>
                      <p className="text-xl font-black text-white italic leading-none">04</p>
                    </div>
                    <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl shadow-inner">
                      <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Denda</p>
                      <p className="text-xl font-black text-rose-500 italic leading-none">Rp0</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-5 left-5 right-5 h-16 bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-white/5 flex items-center justify-around shadow-2xl px-2">
                  <button className="text-indigo-500"><LayoutGrid size={20} /></button>
                  <button className="text-slate-600"><Search size={20} /></button>
                  <div className="relative -top-5">
                    <button className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 border-4 border-[#0B1120] active:scale-90 transition-transform">
                      <QrCode size={24} strokeWidth={2.5} />
                    </button>
                  </div>
                  <button className="text-slate-600"><Bookmark size={20} /></button>
                  <button className="text-slate-600"><Book size={20} /></button>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-indigo-500/20 rounded-full"></div>

              </div>
            </div>

            {/* Floating Info Tag */}
            <div className="absolute -left-12 top-1/4 bg-[#0F172A]/90 backdrop-blur-xl border border-indigo-500/30 p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4 animate-bounce z-20">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-indigo-500/10">
                <CheckCircle2 size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sirkulasi</p>
                <p className="text-sm font-black text-white italic tracking-tighter uppercase">Verified Node</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}