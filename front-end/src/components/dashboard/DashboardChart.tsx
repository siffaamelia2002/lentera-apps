"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { name: "Mon", total: 40 },
  { name: "Tue", total: 30 },
  { name: "Wed", total: 65 },
  { name: "Thu", total: 45 },
  { name: "Fri", total: 90 },
  { name: "Sat", total: 70 },
  { name: "Sun", total: 85 },
];

export default function DashboardChart() {
  // 🔥 FIX: Mencegah error hydration/width di Next.js
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-[450px] bg-slate-900/40 animate-pulse rounded-[2.5rem]" />;
  }

  return (
    <div className="w-full h-[450px] bg-slate-900/40 border border-slate-900 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight uppercase">
            Activity <span className="text-indigo-500">Analytics</span>
          </h3>
          <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">
            Statistik Peminjaman Buku Mingguan
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 uppercase">Live Data</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                {/* Gradient menggunakan Indigo 500 */}
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={15}
              fontWeight="bold"
            />
            <YAxis 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              fontWeight="bold"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#020617', 
                border: '1px solid #1e293b',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#6366f1' }}
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#6366f1" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}