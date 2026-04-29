// components/auth/BackButton.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 lg:hidden">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all duration-500 shadow-[0_8px_32px_0_rgba(16,185,129,0.1)] backdrop-blur-md group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>
    </div>
  );
}