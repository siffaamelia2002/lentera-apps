"use client";

import React, { useEffect, useState, memo } from "react";

/**
 * 🔥 FIX: Menggunakan React.memo
 * Ini mencegah komponen Clock memicu re-render ke parent/child lain 
 * yang tidak berhubungan setiap detiknya.
 */
function ClockWidgetComponent() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set waktu awal segera setelah mount
    setTime(new Date());

    const i = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(i);
  }, []);

  // Cegah Hydration Mismatch (Server vs Client)
  if (!time) {
    return (
      <div className="h-8 w-32 animate-pulse bg-emerald-950/20 rounded-xl border border-emerald-900/20" />
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
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-900/40 bg-emerald-950/30 backdrop-blur-sm">
      <span className="text-emerald-400 text-xs">🕒</span>

      <span className="text-[11px] font-bold text-emerald-300/80 uppercase">
        {date}
      </span>

      <div className="w-[60px]"> {/* Fixed width agar teks jam tidak goyang */}
        <span className="text-[11px] font-black text-white font-mono">
          {timeFull}
        </span>
      </div>
    </div>
  );
}

// 🔥 Ekspor dengan React.memo agar stabil
const ClockWidget = memo(ClockWidgetComponent);
export default ClockWidget;