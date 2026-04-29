"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, GraduationCap, Users, ArrowLeft, Zap, BookOpen, Lamp } from "lucide-react";

export default function LoginBranding() {
  const roles = [
    { 
      label: "Admin", 
      icon: <ShieldCheck className="w-3.5 h-3.5" />, 
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20" 
    },
    { 
      label: "Guru", 
      icon: <Users className="w-3.5 h-3.5" />, 
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20" 
    },
    { 
      label: "Siswa", 
      icon: <GraduationCap className="w-3.5 h-3.5" />, 
      color: "bg-slate-500/10 text-slate-300 border-slate-500/20 group-hover:bg-slate-500/20" 
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 p-12 lg:p-16 relative overflow-hidden border-r border-slate-800/50 min-h-screen">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{
            backgroundImage: `linear-gradient(#312e81 1px, transparent 1px), linear-gradient(90deg, #312e81 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }}
        />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-indigo-900 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-15" />
      </div>

      {/* HEADER: Kembali ke Beranda */}
      <div className="relative z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-all duration-500 backdrop-blur-md group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        {/* New Logo Section - LENTERA */}
        <div className="flex items-start gap-5 mb-12">
          <div className="relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-700" />
            <div className="relative w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 border border-indigo-400/50">
              <Lamp className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-[0.2em] leading-none mt-1">LENTERA</h1>
            <p className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-bold mt-2.5 flex items-center gap-2">
              <span className="h-[2px] w-4 bg-indigo-500 rounded-full"></span>
              Layanan Edukasi, Navigasi Transaksi, Evaluasi, & Reservasi Arsip
            </p>
          </div>
        </div>
        
        {/* Headline */}
        <div className="space-y-4 mb-10">
          <h2 className="text-5xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">
            Terangi Jalan <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 italic">Pengetahuan.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed border-l-2 border-indigo-500/50 pl-6 italic font-medium">
            "Navigasi cerdas untuk manajemen arsip dan edukasi modern."
          </p>
        </div>

        {/* Feature Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-10 max-w-md">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-5 rounded-[2rem] hover:border-indigo-500/30 transition-all duration-500 group/item">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover/item:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <p className="text-white font-bold text-sm mb-1">Efisien & Cepat</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">Sistem reservasi arsip dengan teknologi otomasi terbaru.</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-5 rounded-[2rem] hover:border-blue-500/30 transition-all duration-500 group/item">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover/item:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <p className="text-white font-bold text-sm mb-1">Navigasi Terpadu</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">Pantau setiap transaksi dan evaluasi data secara real-time.</p>
          </div>
        </div>

        {/* Role Access Badges */}
        <div className="flex flex-wrap gap-3">
          {roles.map((role, idx) => (
            <div 
              key={idx} 
              className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-default ${role.color}`}
            >
              <span className="transition-transform group-hover:scale-110 group-hover:rotate-6">{role.icon}</span>
              <span className="text-xs font-bold tracking-widest uppercase">{role.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER: System Status */}
      <div className="relative z-10 flex justify-between items-end">
         <div className="space-y-2">
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase pl-1">
              &copy; 2026 LENTERA SYSTEM
            </p>
         </div>
         
         <div className="flex items-center gap-4 text-slate-600">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-tighter">Latency</span>
              <span className="text-xs font-mono text-indigo-500">12ms</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-[10px] font-bold text-indigo-400">
              v3.0.0
            </div>
         </div>
      </div>
    </div>
  );
}