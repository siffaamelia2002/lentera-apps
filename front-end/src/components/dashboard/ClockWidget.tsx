"use client";

import React, { useEffect, useState, memo } from "react";

/**
 * 🔥 FIX: Menggunakan React.memo
 * Menjaga stabilitas performa sistem LENTERA dengan mencegah re-render 
 * yang tidak perlu pada dashboard.
 */
function ClockWidgetComponent() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    const i = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(i);
  }, []);

  // Cegah Hydration Mismatch dengan skema warna Indigo
  if (!time) {
    return (
      <div className="h-8 w-32 animate-pulse bg-indigo-950/20 rounded-xl border border-indigo-900/20" />
    );
  }

  const date = time.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });

  const timeFull = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-indigo-900/40 bg-indigo-950/30 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
      <span className="text-indigo-400 text-xs">🕒</span>

      <span className="text-[11px] font-bold text-indigo-300/80 uppercase tracking-wider">
        {date}
      </span>

      <div className="w-[60px]">
        <span className="text-[11px] font-black text-white font-mono">
          {timeFull}
        </span>
      </div>
    </div>
  );
}

const ClockWidget = memo(ClockWidgetComponent);
export default ClockWidget;