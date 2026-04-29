"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; 

import AuthBackground from "@/components/auth/AuthBackground";
import BackButton from "@/components/auth/BackButton";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    remember: false 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-slate-950 min-h-screen relative overflow-hidden">
      <AuthBackground />
      <BackButton />

      <div className="w-full sm:max-w-[480px] z-10 relative flex flex-col justify-center min-h-screen sm:min-h-fit">
        <div className="bg-slate-950/60 sm:bg-slate-900/80 backdrop-blur-xl sm:backdrop-blur-2xl px-6 py-12 sm:p-14 sm:rounded-[3rem] sm:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border-y border-transparent sm:border sm:border-slate-800 relative overflow-hidden flex flex-col justify-center min-h-screen sm:min-h-fit transition-all duration-500 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] group/card">
          
          {/* Indigo Accent Line */}
          <div className="hidden sm:block absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500" />

          <div className="flex flex-col w-full max-w-sm mx-auto sm:max-w-none pt-10 sm:pt-0">
            <AuthHeader />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1.5 uppercase tracking-[0.15em]">Alamat Email</label>
                <div className="relative group">
                  <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors duration-300">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="user@lentera.com"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 font-semibold text-base sm:text-sm shadow-inner"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1.5 uppercase tracking-[0.15em]">Kata Sandi</label>
                <div className="relative group">
                  <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors duration-300">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-14 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 font-semibold text-base sm:text-sm shadow-inner"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2.5 rounded-full hover:bg-slate-800"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Lupa Sandi & Remember Me */}
              <div className="flex items-center justify-between text-[13px] px-1.5 pt-1">
                <div className="flex items-center space-x-2.5 group">
                  <button 
                    type="button"
                    role="checkbox"
                    aria-checked={formData.remember}
                    onClick={() => setFormData({...formData, remember: !formData.remember})}
                    className={`peer h-4.5 w-4.5 shrink-0 rounded-[4px] border transition-all duration-200 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
                      ${formData.remember 
                        ? "bg-indigo-500 border-indigo-500 text-slate-950" 
                        : "border-slate-600 bg-slate-950/50 group-hover:border-slate-500"
                      }`}
                  >
                    <Check className={`h-3 w-3 transition-transform duration-200 ${formData.remember ? "scale-100" : "scale-0"}`} strokeWidth={3.5} />
                  </button>
                  <label 
                    className="text-slate-400 font-semibold cursor-pointer group-hover:text-slate-200 transition-colors select-none"
                    onClick={() => setFormData({...formData, remember: !formData.remember})}
                  >
                    Ingat sesi saya
                  </label>
                </div>
                <Link href="/lupa-sandi" className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
                  Lupa sandi?
                </Link>
              </div>

              {/* Indigo Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-[15px] py-4.5 rounded-2xl transition-all duration-500 shadow-[0_15px_30px_-5px_rgba(79,70,229,0.25)] disabled:opacity-70 flex items-center justify-center gap-3 mt-5 active:scale-[0.98] group/btn overflow-hidden relative"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">MASUK KE DASHBOARD</span>
                    <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <AuthFooter />
        </div>
      </div>
    </div>
  );
}