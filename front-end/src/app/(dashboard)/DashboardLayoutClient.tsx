"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayoutClient({
  children,
  initialUser,
  serverTime,
}: any) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isInitialized = useRef(false);

  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  // Sync data dari SSR ke Zustand Store (hanya jika data di store masih kosong)
  useEffect(() => {
    if (!isInitialized.current && initialUser) {
      setUser(initialUser);
      isInitialized.current = true;
    }
  }, [initialUser, setUser]);

  // Gunakan data dari store jika sudah ada, jika belum gunakan data awal dari SSR
  const currentUser = user || initialUser;

  const role = pathname.includes("/admin") ? "admin" : pathname.includes("/guru") ? "guru" : "siswa";

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        role={role}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex flex-col min-h-screen w-full transition-all duration-300 ${isCollapsed ? "lg:pl-[85px]" : "lg:pl-72"}`}>
        <Topbar
          onToggleMobile={() => setIsMobileOpen(true)}
          initialUser={currentUser} 
          serverTime={serverTime}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}