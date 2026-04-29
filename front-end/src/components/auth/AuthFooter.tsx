// components/auth/AuthFooter.tsx
import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="mt-14 pb-8 sm:pb-0 text-center space-y-2">
      <p className="text-slate-500 text-sm font-medium">
        Sudah punya akun?{' '}
        <Link href="/aktivasi-akun" className="text-emerald-500 font-bold hover:text-emerald-400 hover:underline underline-offset-4 transition-all">
          Aktivasi Akun
        </Link>
      </p>
      
      <p className="text-xs text-slate-500/80">
        Belum punya akun?{' '}
        <a href="https://wa.me/nomor-admin" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 font-semibold transition-colors">
          Hubungi Admin untuk Pendaftaran
        </a>
      </p>
    </div>
  );
}