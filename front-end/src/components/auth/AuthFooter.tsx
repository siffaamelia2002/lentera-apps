// components/auth/AuthFooter.tsx
import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="mt-14 pb-8 sm:pb-0 text-center space-y-4">
      <div className="space-y-2">
        <p className="text-slate-500 text-sm font-medium">
          Butuh bantuan akses ke sistem LENTERA?
        </p>
        
        <p className="text-xs text-slate-500/80">
          Belum memiliki akun?{' '}
          <a 
            href="https://wa.me/nomor-admin" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline underline-offset-4 decoration-indigo-500/30"
          >
            Hubungi Admin untuk Pendaftaran
          </a>
        </p>
      </div>

      {/* Identitas Brand di Footer */}
      <div className="pt-4 border-t border-slate-800/50 max-w-[200px] mx-auto">
        <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase">
          &copy; 2026 LENTERA TECH
        </p>
      </div>
    </div>
  );
}