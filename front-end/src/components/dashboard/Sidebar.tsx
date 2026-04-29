"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronRight, PanelLeftClose, PanelLeftOpen, ChevronDown, X 
} from "lucide-react";
import { getMenuItems, Role, MenuItem } from "@/config/menu";
import { useState, useRef } from "react";
import { domToPng } from "modern-screenshot";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  role: Role;
  isMobileOpen: boolean; // 🔥 Tambahan
  setIsMobileOpen: (value: boolean) => void; // 🔥 Tambahan
}

export default function Sidebar({ isCollapsed, setIsCollapsed, role, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const menuItems = getMenuItems(role);
  const logoRef = useRef<HTMLDivElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const downloadLogo = async () => {
    if (logoRef.current) {
      const element = logoRef.current;
      const logoIcon = element.querySelector('.logo-icon-box') as HTMLElement;
      const glowEffect = element.querySelector('.logo-glow') as HTMLElement;
      if (logoIcon) { logoIcon.style.transition = "none"; logoIcon.style.transform = "rotate(0deg)"; }
      if (glowEffect) { glowEffect.style.transition = "none"; glowEffect.style.opacity = "1"; }
      try {
        const dataUrl = await domToPng(element, { quality: 1, scale: 4, backgroundColor: null });
        const link = document.createElement("a");
        link.download = `libra-logo-fixed.png`;
        link.href = dataUrl;
        link.click();
      } finally {
        if (logoIcon) { logoIcon.style.transition = ""; logoIcon.style.transform = ""; }
        if (glowEffect) { glowEffect.style.transition = ""; glowEffect.style.opacity = ""; }
      }
    }
  };

  return (
    <>
      {/* 🔥 OVERLAY: Muncul di mobile saat menu terbuka. Klik untuk tutup. */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[115] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-900 z-[120] flex flex-col transition-all duration-300 ease-in-out overflow-hidden
          ${isCollapsed ? "lg:w-[85px] w-72" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* --- TOMBOL TUTUP DI MOBILE --- */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-7 right-4 p-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="pt-8 mb-10 px-6">
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? "lg:justify-center gap-0" : "gap-4"}`}>
            <div ref={logoRef} onClick={downloadLogo} className="relative shrink-0 group cursor-pointer p-2 bg-transparent">
              <div className="logo-glow absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-all duration-500" />
              <div className="logo-icon-box relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform duration-700 group-hover:rotate-[360deg]">
                <div className="w-4 h-4 bg-slate-950 rounded-sm rotate-45" />
              </div>
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-500 overflow-hidden">
                <h1 className="text-xl font-black text-white tracking-[0.15em] leading-none uppercase">LIBRA</h1>
                <div className="flex items-center gap-2 mt-1.5 whitespace-nowrap">
                  <span className="h-[1.5px] w-3 bg-emerald-500 rounded-full shrink-0"></span>
                  <p className="text-[8px] uppercase tracking-[0.05em] text-slate-500 font-bold">Akses Literasi Modern</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 px-2"><div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-30" /></div>
        </div>

        <nav className="flex-1 px-3 space-y-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item: MenuItem) => {
            const hasChild = item.child && item.child.length > 0;
            const isChildActive = hasChild && item.child?.some(child => pathname === child.href);
            const isActive = pathname === item.href || isChildActive;
            const isOpen = openSubMenu === item.name || isChildActive;
            const showText = !isCollapsed || isMobileOpen;

            return (
              <div key={item.name} className="space-y-1">
                {showText && item.group && (
                  <div className="flex items-center gap-3 px-5 mb-2 mt-4">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] whitespace-nowrap">{item.group}</p>
                    <div className="h-[1px] w-full bg-slate-900/50" />
                  </div>
                )}

                {hasChild ? (
                  <button
                    onClick={() => showText && toggleSubMenu(item.name)}
                    className={`w-full flex items-center rounded-xl transition-all duration-300 group py-3 
                      ${!showText ? "justify-center px-0" : "justify-between px-5"} 
                      ${isActive ? "bg-emerald-500/10 text-emerald-400" : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/50"}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon size={18} className={`shrink-0 ${isActive ? "text-emerald-400" : "group-hover:text-emerald-400"}`} />
                      {showText && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.name}</span>}
                    </div>
                    {showText && <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />}
                  </button>
                ) : (
                  <Link 
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)} // 🔥 Tutup saat menu diklik
                    className={`flex items-center rounded-xl transition-all duration-300 group py-3 
                      ${!showText ? "justify-center px-0" : "justify-between px-5"} 
                      ${isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/50"}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon size={18} className={`shrink-0 ${isActive ? "text-emerald-400" : "group-hover:text-emerald-400"}`} />
                      {showText && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.name}</span>}
                    </div>
                    {showText && isActive && <ChevronRight size={12} className="text-emerald-400 animate-pulse" />}
                  </Link>
                )}
                {showText && hasChild && isOpen && (
                  <div className="ml-9 space-y-1 border-l-2 border-slate-900 animate-in slide-in-from-top-2 duration-300">
                    {item.child?.map((sub) => (
                      <Link key={sub.name} href={sub.href} onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 py-2.5 pl-6 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === sub.href ? "text-emerald-500" : "text-slate-600 hover:text-slate-300"}`}>
                        <sub.icon size={12} /> {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block p-4 border-t border-slate-900/50">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 text-slate-600 hover:text-white hover:bg-slate-900 ${isCollapsed ? "justify-center" : "px-4 gap-3"}`}>
            {isCollapsed ? <PanelLeftOpen size={20} className="text-emerald-500" /> : <><PanelLeftClose size={18} /><span className="text-[10px] font-black uppercase tracking-widest">Kecilkan Menu</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}