// components/aktivasi/StepTwoForm.tsx
"use client";

import { Mail, Send } from "lucide-react";

export default function StepTwoForm({ targetUser, formData, setFormData, onSubmit, isPending, onBack }: any) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Langsung submit untuk mentrigger pengiriman email dari backend
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* INFO PROFIL YANG DITEMUKAN */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-[2rem] text-center space-y-1 relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
            Profil Teridentifikasi
            </p>
            <h3 className="text-white font-bold italic uppercase text-lg leading-tight">
                {targetUser.name}
            </h3>
            <div className="inline-block px-3 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mt-2">
                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter">
                Role: {targetUser.role}
                </p>
            </div>
        </div>
      </div>

      {/* INPUT EMAIL AKTIF */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Email Konfirmasi
          </label>
        </div>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="email"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-700 text-sm font-medium shadow-inner"
            placeholder="masukkan@email-aktif-anda.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
                <span className="text-indigo-500 font-bold">INFO:</span> Kami akan mengirimkan <b>Link Verifikasi</b> ke email di atas. Silakan buka link tersebut untuk membuat password baru dan mengaktifkan akun di sistem LENTERA.
            </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-4 pt-2">
        <button
          disabled={isPending}
          className="group w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/30 disabled:text-slate-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {isPending ? (
            <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>MENGIRIM LINK...</span>
            </>
          ) : (
            <>
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>KIRIM LINK VERIFIKASI</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] hover:text-indigo-400 transition-colors py-2"
        >
          Salah Akun? Kembali
        </button>
      </div>
    </form>
  );
}