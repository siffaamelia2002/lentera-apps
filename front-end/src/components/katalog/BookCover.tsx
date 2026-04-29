"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface BookCoverProps {
  cover: string | null;
  title: string;
}

export default function BookCover({ cover, title }: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
      {/* Decorative Glow - LENTERA Theme */}
      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {cover && !imageError ? (
        <img 
          src={cover} 
          alt={title} 
          onError={() => setImageError(true)} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-700 group-hover:text-indigo-500/50 transition-colors">
            <ImageOff size={48} strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            No Visual Preview
          </span>
        </div>
      )}

      {/* Glassmorphism Overlay Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
    </div>
  );
}