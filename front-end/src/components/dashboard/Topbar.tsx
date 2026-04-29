// components/Topbar/index.tsx (atau Topbar.tsx)
"use client";

import { Menu } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

import ClockWidget from "./ClockWidget";
import CartButton from "@/components/Topbar/CartButton";
import ProfileDropdown from "@/components/Topbar/ProfileDropdown";

interface TopbarProps {
  onToggleMobile: () => void;
  initialUser?: any;
}

export default function Topbar({ onToggleMobile, initialUser }: TopbarProps) {
  // Ambil peran user untuk dikirim ke CartButton (buat nentuin admin/bukan)
  const user = useUserStore((s) => s.user);
  const safePeran = user?.peran || initialUser?.peran || "";

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950 border-b border-slate-800 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        
        {/* KIRI: Hamburger Menu & Jam */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block">
            <ClockWidget />
          </div>
        </div>

        {/* KANAN: Keranjang & Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* 🔥 Component Cart terpisah & reaktif */}
          <CartButton peran={safePeran} />

          {/* Garis Pemisah */}
          <div className="h-8 w-px bg-slate-800 hidden md:block mx-1"></div>

          {/* 🔥 Component Dropdown terpisah */}
          <ProfileDropdown initialUser={initialUser} />
          
        </div>
      </div>
    </header>
  );
}