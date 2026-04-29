"use client";

import { useState, useEffect, useRef } from "react";
import { Save, User, Hash, Phone, MapPin, Loader2 } from "lucide-react";

export default function ProfileForm({ data, onSubmit, isLoading }: any) {
  const hasInitialized = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    no_hp: "",
    alamat: "",
  });

  /**
   * 🚀 INIT SEKALI SAJA (ANTI FLICKER)
   */
  useEffect(() => {
    if (!data || hasInitialized.current) return;

    setFormData({
      name: data?.name || "",
      no_hp: data?.no_hp || "",
      alamat: data?.alamat || "",
    });

    hasInitialized.current = true;
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const safeData = data ?? {};

  const getIdentityLabel = () => {
    if (safeData?.peran === "siswa") return "NISN (Nomor Induk Siswa)";
    if (safeData?.peran === "guru") return "NIP (Nomor Induk Pegawai)";
    return "ID Admin / Sistem";
  };

  const getIdentityValue = () => {
    if (safeData?.peran === "siswa") return safeData.siswa?.nisn || "-";
    if (safeData?.peran === "guru") return safeData.guru?.nip || "-";
    return safeData?.id ? `#${safeData.id}` : "-";
  };

  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-8 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Detail Akun LENTERA
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Data tersinkronisasi otomatis dengan sistem
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-3 px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nama */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
              Nama Lengkap
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-slate-950/50 border border-slate-900 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
              {getIdentityLabel()}
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={18} />
              <input
                value={getIdentityValue()}
                disabled
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* No HP */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
              No. WhatsApp
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
              Alamat Domisili
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}