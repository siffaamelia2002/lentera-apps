"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.password !== passwordData.password_confirmation) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    if (passwordData.password.length < 8) {
      return toast.error("Password minimal 8 karakter!");
    }

    setSubmitting(true);
    try {
      // Menggunakan routing tanpa prefix 'api' sesuai instruksi standarisasi
      const res = await fetch("http://localhost:8000/activation/finalize", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        },
        body: JSON.stringify({ token, email, ...passwordData }),
      });

      const result = await res.json();

      if (res.ok) {
        router.replace(`/login?status=success&title=Berhasil&msg=${encodeURIComponent(result.message)}`);
      } else {
        toast.error(result.message || "Gagal mengaktifkan akun.");
      }
    } catch (err) {
      toast.error("Masalah koneksi ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Memverifikasi Identitas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* INDIGO GLOW DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full z-0" />

      <div className="w-full max-w-md bg-[#0B1120]/80 backdrop-blur-xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl space-y-8 z-10 hover:border-indigo-500/20 transition-colors duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-2">
            <ShieldCheck className="text-indigo-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Set Password</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate px-4">{email}</p>
        </div>

        <form onSubmit={handleFinalSubmit} className="space-y-4">
          {/* INPUT PASSWORD UTAMA */}
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password Baru</label>
             <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 text-sm shadow-inner"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ulangi Password</label>
             <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Ketik ulang password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 text-sm shadow-inner"
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                />
             </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={submitting}
              className="group w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                "SIMPAN & AKTIFKAN AKUN"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-[9px] text-slate-600 uppercase tracking-[0.2em] leading-relaxed">
          Satu langkah lagi untuk mengakses <br/> layanan penuh LENTERA SYSTEM.
        </p>
      </div>
    </div>
  );
}