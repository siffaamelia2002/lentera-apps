"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link"; // Navigasi SPA
import { Mail, ArrowRight, ArrowLeft, Fingerprint, CheckCircle2 } from "lucide-react";
import api from "@/libs/api-client";

export default function LupaSandi() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      // Sesuaikan dengan endpoint API Laravel/Backend kamu
      const res = await api.post("/forgot-password", data);
      return res.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Email tidak ditemukan atau terjadi kesalahan.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  return (
    // Container Utama: Full Center & Full Background
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-6">
      
      {/* --- BACKGROUND ABSTRACT --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-slate-600 blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600 blur-[150px] opacity-15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[180px] opacity-5 pointer-events-none" />
      </div>

      {/* --- TOMBOL KEMBALI (SPA MODE) --- */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all duration-500 shadow-[0_8px_32px_0_rgba(16,185,129,0.1)] backdrop-blur-md group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Login
        </Link>
      </div>

      {/* --- FORM CARD --- */}
      <div className="w-full max-w-[480px] z-10 relative">
        <div className="bg-slate-900/40 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] border border-slate-800 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30 group/card">
          
          {/* Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-600 to-emerald-500" />

          <div className="flex flex-col items-center text-center">
            {/* Icon Header */}
            <div className="mb-8">
              <div className="relative inline-block group">
                <div className="absolute -inset-4 bg-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
                <div className="relative w-20 h-20 bg-slate-950 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-2xl">
                  {isSubmitted ? (
                    <CheckCircle2 size={42} className="text-emerald-500 animate-bounce" />
                  ) : (
                    <Fingerprint size={42} className="text-emerald-500" />
                  )}
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              /* --- STATE 1: FORM INPUT EMAIL --- */
              <>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Lupa Sandi?</h1>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-[320px]">
                  Masukkan alamat email Anda yang terdaftar, kami akan mengirimkan instruksi pemulihan.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div className="text-left space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Email Terdaftar</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        placeholder="nama@email.com"
                        className="w-full pl-12 pr-5 py-4.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium shadow-inner"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:to-emerald-400 text-white font-bold py-4.5 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                  >
                    {forgotPasswordMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10">KIRIM LINK RESET</span>
                        <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* --- STATE 2: SUCCESS MESSAGE --- */
              <div className="space-y-6 py-4">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Cek Email Anda</h1>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Instruksi reset sandi telah dikirim ke <br />
                  <span className="text-emerald-400 font-bold break-all">{email}</span>.
                </p>
                <div className="pt-4">
                  <Link 
                    href="/login"
                    className="inline-flex items-center justify-center w-full py-4 text-emerald-500 font-bold hover:text-emerald-400 transition-all border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/5"
                  >
                    Kembali Masuk
                  </Link>
                </div>
              </div>
            )}

            {/* Footer Help */}
            <div className="mt-10 pt-8 border-t border-slate-800/50 w-full text-center">
              <p className="text-xs text-slate-500">
                Ada kendala?{" "}
                <a href="https://wa.me/nomor-admin" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">
                  Tanya Admin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}