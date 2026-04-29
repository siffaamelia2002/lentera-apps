// hooks/usePeminjaman.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api-client";

// Interface sederhana biar TypeScript gak rewel
export interface PeminjamanData {
  id: number;
  kode_peminjaman: string;
  status: string;
  tanggal_pengajuan: string;
  tanggal_pinjam?: string;
  tanggal_kembali_seharusnya: string;
  details: {
    buku: {
      judul: string;
      cover: string;
    };
  }[];
}

export const usePeminjaman = () => {
  return useQuery<PeminjamanData[]>({
    queryKey: ["peminjaman-list"], // Kunci unik buat cache
    queryFn: async () => {
      // Panggil API Laravel kita
      const res = await api.get("/peminjaman");
      // Sesuai struktur response controller: { success: true, data: [...] }
      return res.data.data;
    },
    // 🔥 AUTO UPDATE LOGIC
    refetchInterval: 5000,      // Cek data baru ke server tiap 5 detik (Polling)
    refetchOnWindowFocus: true, // Auto update pas user balik ke tab aplikasi
    staleTime: 2000,            // Data dianggap "basi" setelah 2 detik
  });
};