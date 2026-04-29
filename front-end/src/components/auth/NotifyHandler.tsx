"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useNotify } from "@/hooks/use-notify";
import { useUserStore } from "@/store/useUserStore";

export default function NotifyHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const notify = useNotify();
  const user = useUserStore((state) => state.user);
  
  // Gunakan Ref agar tidak terjadi duplikat saat re-render
  const lastProcessedPath = useRef<string>("");

  useEffect(() => {
    const status = searchParams.get("status"); // contoh: success, error, info
    const title = searchParams.get("title");   // contoh: "Berhasil!"
    const msg = searchParams.get("msg");       // contoh: "Data disimpan"

    // Unik key buat nandain notif ini sudah tampil di path ini
    const currentEventKey = `${pathname}?${status}${title}${msg}`;

    if (status && lastProcessedPath.current !== currentEventKey) {
      lastProcessedPath.current = currentEventKey;

      // 1. Bersihkan URL (Hapus semua query params agar bersih)
      const newPath = window.location.pathname;
      window.history.replaceState(null, "", newPath);

      // 2. Logika Pesan Custom
      let finalTitle = title;
      let finalMsg = msg;

      // Kasus khusus Login (biar otomatis ambil nama user dari store)
      if (status === "login_success" && user?.name) {
        finalTitle = `Selamat Datang, ${user.name}!`;
        finalMsg = "Anda berhasil masuk ke dashboard LIBRA.";
        notify.success(finalTitle, finalMsg);
      } 
      // Kasus umum (Custom message dari URL)
      else if (status === "success") {
        notify.success(finalTitle || "Berhasil!", finalMsg || "");
      } 
      else if (status === "error") {
        notify.error(finalTitle || "Gagal!", finalMsg || "Terjadi kesalahan.");
      }
    }
  }, [searchParams, pathname, notify, user]);

  return null;
}