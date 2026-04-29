import { Book, Users, BookmarkCheck, AlertCircle } from "lucide-react";

/**
 * Konfigurasi ikon diperbarui ke skema Indigo & Slate
 * untuk selaras dengan branding LENTERA.
 */
const iconMap: any = {
  book: { icon: Book, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  users: { icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  check: { icon: BookmarkCheck, color: "text-slate-400", bg: "bg-slate-500/10" },
  alert: { icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
};

export default function DashboardStats({ stats }: { stats: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const IconConfig = iconMap[item.type] || iconMap.book;
        return (
          <div 
            key={item.label} 
            className="group p-6 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/40 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/5 relative overflow-hidden"
          >
            {/* Dekorasi Glow saat Hover */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${IconConfig.color} group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner`}>
                <IconConfig.icon size={22} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 tracking-[0.3em] uppercase">LENTERA</span>
                <div className="h-1 w-4 bg-indigo-500/30 rounded-full mt-1" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors duration-500">
                {item.value}
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] leading-tight">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}