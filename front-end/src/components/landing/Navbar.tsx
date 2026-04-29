"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { domToPng } from "modern-screenshot";
import { 
  Home, 
  BookOpen, 
  LayoutGrid,
  HelpCircle, 
  LogIn, 
  ChevronDown,
  Lamp
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
      link.download = `lentera-logo.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 font-sans">
      {/* PEMBUNGKUS UTAMA NAVIGASI LENTERA */}
      <nav className="w-full max-w-6xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-4 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative overflow-hidden">
        
        {/* Glow Decor Background */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-indigo-500/10 blur-[60px] pointer-events-none" />

        {/* LEFT: LOGO AREA (Lentera Branding) */}
        <div className="flex items-center gap-4 pl-2">
          <div 
            ref={logoRef}
            onClick={downloadLogo}
            className="relative shrink-0 cursor-pointer group"
          >
            {/* Lamp Glow Effect */}
            <div className="absolute -inset-3 bg-indigo-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
            <div className="relative w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 border-t border-white/20">
              <Lamp size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform group-hover:rotate-12" />
            </div>
          </div>
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white tracking-[0.2em] leading-none uppercase italic">LENTERA</h1>
            <p className="text-[7px] uppercase tracking-[0.4em] text-indigo-400 font-black mt-1.5 opacity-80">Sirkulasi Digital</p>
          </div>
        </div>

        {/* CENTER: MENU NAVIGASI DENGAN IKON INDIGO */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5">
          {[
            { title: "Dashboard", url: "/", icon: <Home size={14} /> },
            { title: "Katalog", url: "#koleksi", icon: <BookOpen size={14} /> },
            { title: "Sirkulasi", url: "#sirkulasi", icon: <LayoutGrid size={14} /> },
            { title: "Bantuan", url: "#help", icon: <HelpCircle size={14} /> }
          ].map((item) => (
            <a 
              key={item.title}
              href={item.url} 
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
            >
              <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">
                {item.icon}
              </span>
              {item.title}
            </a>
          ))}
        </div>

        {/* RIGHT: CTA & LOGIN */}
        <div className="flex items-center gap-3">
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-indigo-400 transition-colors group">
             <span className="text-[10px] font-black uppercase tracking-widest">ID-ID</span>
             <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

          <Link 
            href="/login" 
            className="group relative flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:translate-y-0 border-t border-white/20"
          >
            <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>Akses Node</span>
          </Link>
        </div>

      </nav>
    </header>
  );
}