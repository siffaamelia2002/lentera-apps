// hooks/useAuth.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, logout as logoutApi, getUser } from "@/services/auth-service";
import { useUserStore } from "@/store/useUserStore";

export const useAuth = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (res: any) => {
      try {
        // 1. Ambil data user detail dari API
        const userData = await getUser();
        const user = userData.data;

        // 2. Simpan ke Zustand Store (Penting: NotifyHandler ambil nama dari sini)
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          peran: user.peran, 
        });

        // 3. Tentukan tujuan redirect & kirim status sukses
        // NotifyHandler bakal otomatis bikin pesan: "Selamat Datang, [Nama]!"
        const targetPath = user.peran === "admin" ? "/admin/dashboard" : "/dashboard";
        router.replace(`${targetPath}?status=login_success`);
        
      } catch (err: any) {
        console.error("GET USER ERROR:", err);
        router.replace("/login?status=error&title=Auth Error&msg=Gagal sinkronisasi profil user.");
      }
    },
    onError: (err: any) => {
      // Error dari fetch service berupa object {status, message}
      const errorMsg = err?.message || "Email atau password salah";
      
      // Kirim pesan error aseli dari Laravel (Status Lulus/Resign dll) ke NotifyHandler
      router.replace(`/login?status=error&title=Akses Ditolak&msg=${encodeURIComponent(errorMsg)}`);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: (res: any) => {
      // Ambil Nama & Peran sebelum store di-reset buat pesan perpisahan
      const currentUser = useUserStore.getState().user;
      const namaUser = currentUser?.name || "User";
      const peranUser = currentUser?.peran?.toUpperCase() || "USER";

      // 1. Reset Zustand Store
      setUser({
        id: "",
        name: "",
        email: "",
        peran: "user",
      });
      
      // 2. Siapkan pesan logout yang personal
      const logoutMsg = `Sampai jumpa kembali ${peranUser} ${namaUser}!`;
      
      // 3. Redirect ke login dengan params
      router.replace(`/login?status=success&title=Logout Berhasil&msg=${encodeURIComponent(logoutMsg)}`);
    },
    onError: (err: any) => {
      console.error("LOGOUT ERROR:", err);
      router.replace("/login?status=error&title=Logout Gagal&msg=Sesi mungkin sudah berakhir.");
    }
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
  };
};