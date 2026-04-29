"use client";

import { useEffect, useState } from "react";
import { Zap, ShieldCheck, Globe } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureCard from "@/components/landing/FeatureCard";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-400 scroll-smooth">
      <Navbar />
      
      <main>
        <Hero />

        {/* FEATURES GRID */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap size={28} />} 
                title="Ultra Fast" 
                desc="Akses data katalog ribuan buku dalam waktu kurang dari 100ms dengan optimasi cache terbaru."
              />
              <FeatureCard 
                icon={<ShieldCheck size={28} />} 
                title="Secure Data" 
                desc="Keamanan data pengguna adalah prioritas. Kami menggunakan enkripsi end-to-end pada setiap transaksi."
              />
              <FeatureCard 
                icon={<Globe size={28} />} 
                title="Cloud Sync" 
                desc="Baca dan kelola daftar pustaka Anda dari perangkat mana saja, kapan saja, secara real-time."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-slate-950 text-center">
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">
          © 2026 LIBRA — MODERN LITERACY ECOSYSTEM
        </p>
      </footer>
    </div>
  );
}