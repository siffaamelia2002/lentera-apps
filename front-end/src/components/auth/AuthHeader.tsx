// components/auth/AuthHeader.tsx
import { Lamp } from "lucide-react";

export default function AuthHeader() {
  return (
    <>
      <div className="mb-10 flex items-center justify-center gap-5 group cursor-pointer sm:cursor-default" tabIndex={0}>
        <div className="relative">
          {/* Efek Glow Indigo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-700" />
          
          {/* Container Logo - LENTERA Style */}
          <div className="relative w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110 border border-indigo-400/50">
            <Lamp className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-3xl font-black tracking-[0.2em] text-white leading-none">LENTERA</span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="h-[1.5px] w-3 bg-indigo-500 rounded-full"></span>
            <span className="text-[8px] uppercase tracking-[0.1em] text-slate-400 font-bold">
              Integrated Education & Archive
            </span>
          </div>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tighter mb-2.5">
          Selamat Datang Kembali
        </h1>
        <p className="text-slate-400 text-sm font-medium px-2 leading-relaxed max-w-sm mx-auto">
          Silakan masuk untuk mengakses sistem navigasi transaksi, evaluasi, dan reservasi arsip Anda.
        </p>
      </div>
    </>
  );
}