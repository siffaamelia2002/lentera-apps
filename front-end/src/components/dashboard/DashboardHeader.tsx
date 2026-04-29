interface DashboardHeaderProps {
  name: string;
  role: string;
}

export default function DashboardHeader({ name, role }: DashboardHeaderProps) {
  // Fungsi untuk menentukan warna label berdasarkan peran - Diperbarui ke skema Indigo
  const getRoleBadgeColor = (roleName: string) => {
    const r = roleName.toLowerCase();
    // Warna Admin diubah dari Emerald menjadi Indigo sesuai branding LENTERA
    if (r.includes('admin')) return 'text-indigo-400';
    if (r.includes('petugas') || r.includes('guru')) return 'text-blue-400';
    if (r.includes('peminjam') || r.includes('siswa')) return 'text-slate-400';
    return 'text-slate-400';
  };

  // Fungsi untuk menentukan emoji berdasarkan peran
  const getRoleEmoji = (roleName: string) => {
    const r = roleName.toLowerCase();
    if (r.includes('admin')) return '👨‍💻';
    if (r.includes('petugas') || r.includes('guru')) return '👨‍🏫';
    return '📖'; // Default untuk peminjam/siswa agar sesuai konteks LENTERA
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
          LENTERA <span className="text-indigo-500">Overview</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          {/* Status indikator diubah ke Indigo */}
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
            System Status: Operational
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          {/* Menampilkan Nama User */}
          <p className="text-white text-sm font-black leading-none truncate max-w-[180px] uppercase tracking-tight">
            {name}
          </p>
          {/* Menampilkan Peran dengan aksen Indigo untuk Admin */}
          <p className={`${getRoleBadgeColor(role)} text-[10px] font-bold tracking-widest uppercase mt-1.5`}>
            {role}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/5">
          {getRoleEmoji(role)}
        </div>
      </div>
    </header>
  );
}