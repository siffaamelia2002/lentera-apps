import { Book, Users, BookmarkCheck, AlertCircle } from "lucide-react";

const iconMap: any = {
  book: { icon: Book, color: "text-blue-400" },
  users: { icon: Users, color: "text-emerald-400" },
  check: { icon: BookmarkCheck, color: "text-purple-400" },
  alert: { icon: AlertCircle, color: "text-rose-400" },
};

export default function DashboardStats({ stats }: { stats: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const IconConfig = iconMap[item.type] || iconMap.book;
        return (
          <div key={item.label} className="group p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${IconConfig.color} group-hover:scale-110 transition-transform duration-500`}>
                <IconConfig.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Stats</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter">{item.value}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}