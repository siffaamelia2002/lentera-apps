// components/Topbar/ProfileDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown, User as UserIcon } from "lucide-react";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useUserStore } from "@/store/useUserStore";
import { logout as logoutService } from "@/services/auth-service";

interface ProfileDropdownProps {
  initialUser?: any;
}

export default function ProfileDropdown({ initialUser }: ProfileDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);

  const safeName = user?.name || initialUser?.name || "User";
  const safePeran = user?.peran || initialUser?.peran || "";
  const profilePic = user?.profile_picture || initialUser?.profile_picture;

  const getProfileImage = () => {
    let cleanPic = profilePic || "";
    if (cleanPic) {
      try {
        cleanPic = decodeURIComponent(cleanPic);
      } catch (e) {}
      return cleanPic;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      safeName
    )}&background=0f172a&color=fff`;
  };

  const finalImage = getProfileImage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutSPA = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout API error", error);
    } finally {
      clearUser();
      localStorage.removeItem("user-storage");
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      router.replace(
        "/login?status=success&title=Logout Berhasil&msg=Sampai jumpa lagi di LIBRA!"
      );
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 p-1.5 pr-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 relative bg-slate-800">
            <Image
              key={finalImage}
              src={finalImage}
              alt="profile"
              fill
              sizes="40px"
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="hidden md:block text-left min-w-[100px]">
            <p className="text-[11px] font-black text-white uppercase truncate max-w-[120px]">
              {safeName}
            </p>
            <p className="text-[9px] font-bold text-emerald-500 uppercase">
              {safePeran}
            </p>
          </div>

          <ChevronDown
            size={14}
            className={`transition-transform duration-200 text-slate-500 ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-slate-950 border border-slate-800 rounded-3xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
            <Link
              href="/profile"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-slate-900 rounded-xl transition"
            >
              <UserIcon size={18} className="text-emerald-500" />
              Profil Saya
            </Link>

            <div className="h-px bg-slate-800 my-1 mx-2"></div>

            <button
              onClick={() => {
                setIsProfileOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutSPA}
        isLoading={isLoggingOut}
        title="Konfirmasi Logout"
        message={`Halo ${safeName}, yakin ingin keluar dari sistem?`}
      />
    </>
  );
}