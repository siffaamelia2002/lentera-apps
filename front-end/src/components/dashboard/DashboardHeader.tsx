interface DashboardHeaderProps {
  name: string;
  role: string;
}

export default function DashboardHeader({ name, role }: DashboardHeaderProps) {
  // Fungsi untuk menentukan warna label berdasarkan peran
  const getRoleBadgeColor = (roleName: string) => {
    const r = roleName.toLowerCase();
    if (r.includes('admin')) return 'text-emerald-500';
    if (r.includes('guru')) return 'text-blue-400';
    if (r.includes('siswa')) return 'text-amber-400';
    return 'text-slate-400';
  };

  // Fungsi untuk menentukan emoji berdasarkan peran
  const getRoleEmoji = (roleName: string) => {
    const r = roleName.toLowerCase();
    if (r.includes('admin')) return '👨‍💻';
    if (r.includes('guru')) return '👨‍🏫';
    return '🎓'; // Default siswa
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
          System <span className="text-emerald-500">Overview</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
            Server Status: Operational
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          {/* DINAMIS: Menampilkan Nama */}
          <p className="text-white text-sm font-bold leading-none truncate max-w-[150px]">
            {name}
          </p>
          {/* DINAMIS: Menampilkan Peran dengan warna berbeda */}
          <p className={`${getRoleBadgeColor(role)} text-[10px] font-bold tracking-tighter uppercase mt-1`}>
            {role}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-lg">
          {/* DINAMIS: Emoji berubah sesuai peran */}
          {getRoleEmoji(role)}
        </div>
      </div>
    </header>
  );
}