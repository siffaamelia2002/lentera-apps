// components/auth/BackButton.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 lg:hidden">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-all duration-500 shadow-[0_8px_32px_0_rgba(79,70,229,0.15)] backdrop-blur-md group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>
    </div>
  );
}