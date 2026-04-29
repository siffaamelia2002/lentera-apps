"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { domToPng } from "modern-screenshot";
import { 
  Home, 
  BookOpen, 
  Info, 
  HelpCircle, 
  LogIn, 
  LayoutGrid,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const logoRef = useRef<HTMLDivElement>(null);

  const downloadLogo = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (logoRef.current) {
      const dataUrl = await domToPng(logoRef.current, {
        quality: 1,
        scale: 4,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `libra-logo.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 font-display">
      {/* PEMBUNGKUS UTAMA NAVIGASI */}
      <nav className="w-full max-w-6xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
        
        {/* LEFT: LOGO AREA */}
        <div className="flex items-center gap-4 pl-2">
          <div 
            ref={logoRef}
            onClick={downloadLogo}
            className="relative shrink-0 cursor-pointer group"
          >
            <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-white to-slate-200 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
              <div className="w-4 h-4 bg-slate-950 rounded-sm rotate-45 group-hover:rounded-full transition-all duration-500" />
            </div>
          </div>
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white tracking-[0.2em] leading-none uppercase">LIBRA</h1>
            <p className="text-[7px] uppercase tracking-[0.3em] text-emerald-400 font-black mt-1.5 opacity-80">Sistem Digital</p>
          </div>
        </div>

        {/* CENTER: MENU NAVIGASI DENGAN IKON */}
        <div className="hidden md:flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          {[
            { title: "Beranda", url: "/", icon: <Home size={14} /> },
            { title: "Katalog", url: "#koleksi", icon: <BookOpen size={14} /> },
            { title: "Layanan", url: "#features", icon: <LayoutGrid size={14} /> },
            { title: "Bantuan", url: "#help", icon: <HelpCircle size={14} /> }
          ].map((item) => (
            <a 
              key={item.title}
              href={item.url} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
            >
              <span className="text-slate-500 group-hover:text-emerald-400 transition-colors">
                {item.icon}
              </span>
              {item.title}
            </a>
          ))}
        </div>

        {/* RIGHT: CTA & LOGIN */}
        <div className="flex items-center gap-3">
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
             <span className="text-[10px] font-black uppercase tracking-widest">ID</span>
             <ChevronDown size={14} />
          </button>

          <Link 
            href="/login" 
            className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>Masuk</span>
          </Link>
        </div>

      </nav>
    </header>
  );
}