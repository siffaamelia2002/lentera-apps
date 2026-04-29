export default function StatCard({ icon, label, value, color }: any) {
  const themes: any = {
    emerald: "text-emerald-500 bg-emerald-500/10",
    indigo: "text-indigo-500 bg-indigo-500/10",
  };
  return (
    <div className="bg-[#0B1120] border border-slate-900 p-4 rounded-3xl flex items-center gap-4">
      <div className={`size-10 rounded-2xl flex items-center justify-center ${themes[color]}`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase">{label}</p>
        <p className="text-xl font-black text-white italic">{value}</p>
      </div>
    </div>
  );
}