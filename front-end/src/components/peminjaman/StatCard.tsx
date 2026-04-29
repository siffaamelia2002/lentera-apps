"use client";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "indigo" | "rose" | "amber"; // Menyesuaikan palet LENTERA
}

export default function StatCard({ icon, label, value, color = "indigo" }: StatCardProps) {
  // Tema warna yang disesuaikan dengan estetika cinematic LENTERA
  const themes: any = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5",
  };

  return (
    <div className="bg-[#0B1120] border border-slate-900 p-5 rounded-[2rem] flex items-center gap-5 transition-all duration-300 hover:border-slate-800 group shadow-xl">
      {/* Icon Container dengan Glow Efek */}
      <div className={`size-12 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 shadow-lg ${themes[color] || themes.indigo}`}>
        {icon}
      </div>

      <div className="space-y-0.5">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic opacity-80">
          {label}
        </p>
        <p className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
          {value}
        </p>
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}