"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserStore } from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api-client";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal"; // Import modal baru
import { KeyRound, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function ProfileClient() {
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { loading, previewImage, handleImageChange, updateProfile } = useUserProfile();
  const { user, setUser, clearUser } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await api.get("/api/user", { // Pastikan prefix /api konsisten
        withCredentials: true,
      });
      return res.data?.data ?? res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  const finalUser = user || data;

  useEffect(() => {
    if (!isLoading && !finalUser) {
      router.push("/login");
    }
  }, [isLoading, finalUser, router]);

  const userDataFormatted = finalUser
    ? {
        ...finalUser,
        role: finalUser?.peran?.toUpperCase(),
      }
    : null;

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "peran=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    clearUser();
    toast.success("Berhasil keluar sesi");
    router.push("/login");
    router.refresh();
  };

  if (isLoading && !finalUser) {
    return <div className="p-8 text-center text-slate-400">Loading profile...</div>;
  }

  if (!userDataFormatted) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4 lg:p-8 animate-in fade-in duration-300">
      
      <ProfileHeader
        user={userDataFormatted}
        previewImage={previewImage || finalUser?.profile_picture}
        onImageChange={handleImageChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ProfileForm
            data={userDataFormatted}
            onSubmit={updateProfile}
            isLoading={loading}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">
              Keamanan Akun
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setIsPasswordModalOpen(true)} // Buka Modal
                className="w-full flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <KeyRound size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    Ganti Password
                  </span>
                </div>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl hover:bg-rose-500/10 transition-all"
              >
                <LogOut size={18} className="text-rose-500" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                  Keluar Akun
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ganti Password */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}