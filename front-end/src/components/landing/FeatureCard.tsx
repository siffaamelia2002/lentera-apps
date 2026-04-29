import { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureProps) {
  return (
    <div className="group relative p-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden">
      {/* Decorative Glow - LENTERA Style */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-500" />
      
      {/* Icon Container dengan Aksen Indigo */}
      <div className="relative w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 text-indigo-400 border border-indigo-500/10 group-hover:border-indigo-500/30 shadow-lg shadow-indigo-900/20">
        {icon}
      </div>

      {/* Content Area */}
      <div className="relative space-y-3">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 leading-relaxed text-sm font-medium italic opacity-80">
          {desc}
        </p>
      </div>

      {/* Bottom Indicator Line */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/40 transition-all duration-700" />
    </div>
  );
}