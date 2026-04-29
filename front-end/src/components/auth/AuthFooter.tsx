// components/auth/AuthFooter.tsx
import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="mt-14 pb-8 sm:pb-0 text-center space-y-3">
      {/* Aktivasi Akun - Tetap Dipertahankan dengan Tema Indigo */}
      <p className="text-slate-500 text-sm font-medium">
        Sudah punya akun?{' '}
        <Link 
          href="/aktivasi-akun" 
          className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline underline-offset-4 transition-all"
        >
          Aktivasi Akun
        </Link>
      </p>
      
      {/* Pendaftaran via Admin */}
      <p className="text-xs text-slate-500/80">
        Belum punya akun?{' '}
        <a 
          href="https://wa.me/nomor-admin" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-400 hover:text-indigo-400 font-semibold transition-colors"
        >
          Hubungi Admin untuk Pendaftaran
        </a>
      </p>

      {/* Footer Brand LENTERA */}
      <div className="pt-6 opacity-40">
        <p className="text-[9px] text-slate-600 font-bold tracking-[0.3em] uppercase">
          &copy; 2026 LENTERA TECH SYSTEM
        </p>
      </div>
    </div>
  );
}