"use client";

import { useState } from "react";
import { X, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import api from "@/libs/api-client";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk toggle visibility masing-masing field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Endpoint disesuaikan dengan standar tanpa prefix 'api'
      await api.put("/user/change-password", formData);
      toast.success("Password berhasil diperbarui!");
      setFormData({ current_password: "", new_password: "", new_password_confirmation: "" });
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
      {/* Overlay dengan Backdrop Blur Indigo-tinted */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Konten Modal LENTERA Style */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500" />

        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <ShieldCheck className="text-indigo-500" size={24} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Ganti Password</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[1px] w-3 bg-indigo-500 rounded-full"></span>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Security System LENTERA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Sekarang */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
              Password Sekarang (Wajib)
            </label>
            <div className="relative group">
              <input
                type={showCurrent ? "text" : "password"}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 pr-14 text-sm text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                placeholder="••••••••"
                value={formData.current_password}
                onChange={(e) => setFormData({...formData, current_password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-5 top-4 text-slate-600 hover:text-indigo-400 transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800/50 my-2" />

          {/* Password Baru */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
              Password Baru
            </label>
            <div className="relative group">
              <input
                type={showNew ? "text" : "password"}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 pr-14 text-sm text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                placeholder="Min. 8 karakter"
                value={formData.new_password}
                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-5 top-4 text-slate-600 hover:text-indigo-400 transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
              Konfirmasi Password Baru
            </label>
            <div className="relative group">
              <input
                type={showConfirm ? "text" : "password"}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 pr-14 text-sm text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                placeholder="Ulangi password baru"
                value={formData.new_password_confirmation}
                onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-5 top-4 text-slate-600 hover:text-indigo-400 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/40 transition-all mt-4 active:scale-95"
          >
            {isLoading ? "Memproses..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}