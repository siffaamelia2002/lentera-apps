// components/auth/AuthHeader.tsx
export default function AuthHeader() {
  return (
    <>
      <div className="mb-10 flex items-center justify-center gap-4 group cursor-pointer sm:cursor-default" tabIndex={0}>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-700" />
          <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-[360deg]">
            <div className="w-6 h-6 bg-slate-950 rounded-md rotate-45" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black tracking-[0.2em] text-white leading-none">LIBRA</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold mt-1.5">Smart Library</span>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tighter mb-2.5">Selamat Datang</h1>
        <p className="text-slate-400 text-sm font-medium px-2 leading-relaxed max-w-sm mx-auto">
          Silakan masuk menggunakan kredensial akun Anda untuk mengakses dasbor literasi.
        </p>
      </div>
    </>
  );
}