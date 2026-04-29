export default function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <div className="rounded-[2.5rem] bg-slate-900/30 backdrop-blur-sm border border-slate-900 p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white tracking-tight uppercase">
          Aktivitas <span className="text-indigo-500">Terbaru</span>
        </h3>
        <button className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">
          Lihat Semua
        </button>
      </div>
      
      <div className="space-y-6">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-300 shadow-inner">
                {/* Visual placeholder untuk avatar atau icon aksi */}
                <span className="group-hover:scale-110 transition-transform">👤</span>
              </div>
              <div>
                <p className="text-sm font-black text-white leading-none uppercase tracking-tight">
                  {act.user} 
                  <span className="text-slate-500 font-bold ml-2 lowercase tracking-normal">
                    {act.action}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-[1px] w-3 bg-indigo-500/50 rounded-full"></span>
                  <p className="text-indigo-400 text-[11px] font-black uppercase tracking-wider">
                    {act.book}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">
                {act.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}