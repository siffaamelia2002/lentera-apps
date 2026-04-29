import { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureProps) {
  return (
    <div className="group p-8 bg-slate-900/30 border border-white/5 rounded-3xl hover:bg-slate-900/50 hover:border-emerald-500/30 transition-all duration-500">
      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500 text-emerald-400">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
}