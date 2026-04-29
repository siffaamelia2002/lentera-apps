export default function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <div className="rounded-[2.5rem] bg-slate-900/30 border border-slate-900 p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white tracking-tight uppercase">Aktivitas <span className="text-emerald-500">Terbaru</span></h3>
        <button className="text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">Lihat Semua</button>
      </div>
      <div className="space-y-6">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sm group-hover:border-emerald-500/50 transition-colors">👤</div>
              <div>
                <p className="text-sm font-bold text-white leading-none">{act.user} <span className="text-slate-500 font-medium ml-1">{act.action}</span></p>
                <p className="text-emerald-500 text-xs font-bold mt-1 tracking-tight">{act.book}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}