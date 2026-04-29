"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserStore } from "@/store/useUserStore"; 
import api from "@/libs/api-client";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardChart from "@/components/dashboard/DashboardChart";
import FavoriteBooks from "@/components/dashboard/FavoriteBooks";

export default function DashboardClient() {
  // 🔥 Ambil data & setter global dari store
  const user = useUserStore((s) => s.user);
  const dashboardData = useUserStore((s) => s.data.dashboard);
  const setGlobalData = useUserStore((s) => s.setGlobalData);

  // Loading hanya TRUE jika data di store (cache) benar-benar kosong
  const [loading, setLoading] = useState(!dashboardData);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/user");
        if (res.data.success) {
          // 🔥 FIX: Gunakan setGlobalData dengan key "dashboard"
          setGlobalData("dashboard", res.data.data); 
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [setGlobalData]);

  // 🔥 Logika Label Peran (Admin, Guru, Siswa)
  const getFriendlyRole = useMemo(() => {
    const peran = user?.peran?.toLowerCase();
    if (peran === "admin") return "Administrator";
    if (peran === "guru") return "Tenaga Pengajar";
    if (peran === "siswa") return "Siswa Aktif";
    return "Member";
  }, [user?.peran]);

  // 🔥 SKELETON HANYA MUNCUL SAAT DATA KOSONG (FIRST LOAD)
  if (loading && !dashboardData) {
    return (
      <div className="p-6 lg:p-10 space-y-12 animate-pulse">
        <div className="h-20 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-4xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 bg-slate-900 border border-slate-800 rounded-[2.5rem]"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-900 border border-slate-800 rounded-[3rem]"></div>
      </div>
    );
  }

  // Fallback data agar tidak crash saat render
  const displayData = dashboardData || { stats: [], chart: [], books: [], activities: [] };

  return (
    <div className="p-6 lg:p-10 space-y-12 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header dengan Nama dan Peran Dinamis */}
      <DashboardHeader 
        name={user?.name || "User"} 
        role={getFriendlyRole} 
      />
      
      <div className="space-y-12">
        {/* Render Stats jika ada */}
        {displayData.stats?.length > 0 && (
          <DashboardStats stats={displayData.stats} />
        )}
        
        {/* Render Chart jika ada */}
        {displayData.chart?.length > 0 && (
          <DashboardChart data={displayData.chart} />
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
           {/* Render Buku Favorit jika ada */}
           {displayData.books?.length > 0 && (
             <FavoriteBooks books={displayData.books} />
           )}

           {/* Render Aktivitas Terbaru jika ada */}
           {displayData.activities?.length > 0 && (
             <RecentActivity activities={displayData.activities} />
           )}
        </div>
      </div>
    </div>
  );
}