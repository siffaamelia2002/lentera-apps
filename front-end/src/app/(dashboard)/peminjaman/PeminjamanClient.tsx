// app/peminjaman/PeminjamanClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api-client";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner"; 

// Import Components
import StatCard from "@/components/peminjaman/StatCard";
import FilterBar from "@/components/peminjaman/FilterBar";
import PeminjamanCard from "@/components/peminjaman/PeminjamanCard";
import DetailModal from "@/components/peminjaman/DetailModal";
import { LibraryBig, BookOpen, Clock, BellRing } from "lucide-react";

export default function PeminjamanClient() {
  const user = useUserStore((state) => state.user); 
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Ref untuk menyimpan jejak data sebelumnya biar toast gak spam
  const prevDataSignature = useRef<string | null>(null);

  // SULTAN FETCHING: TanStack Query dengan Auto-Update
  const { data: peminjamanData, isLoading, isError, error } = useQuery({
    queryKey: ["peminjaman"],
    queryFn: async () => {
      const { data } = await api.get("peminjaman");
      const actualData = Array.isArray(data) ? data : (data.data || []);
      return actualData;
    },
    staleTime: 2000, 
    refetchInterval: 5000, // Refresh tiap 5 detik
    refetchOnWindowFocus: true,
  });

  const displayData = peminjamanData || [];

  // 🔥 LOGIC TOAST KHUSUS PEMINJAM (USER)
  useEffect(() => {
    // Bikin "Tanda Tangan" unik dari data (gabungan ID dan Status)
    const currentSignature = displayData
      .map((item: any) => `${item.id}-${item.status}`)
      .join("|");

    // Kalau prevData udah ada isinya (bukan load pertama kali) DAN datanya beda
    if (prevDataSignature.current !== null && prevDataSignature.current !== currentSignature) {
      // Bahasa disesuaikan untuk User/Peminjam
      toast.success("Pembaruan Status Buku! 📚", {
        description: "Admin baru saja memproses pengajuan atau peminjaman bukumu. Yuk cek status terbarunya!",
        icon: <BellRing size={16} className="text-emerald-500" />,
        duration: 5000, // Tampil 5 detik biar user sempat baca
      });
    }

    // Simpan data terbaru buat perbandingan di 5 detik berikutnya
    if (displayData.length > 0 || prevDataSignature.current !== null) {
      prevDataSignature.current = currentSignature;
    }
  }, [displayData]);

  // Hasil filter data
  const filteredData = displayData.filter((item: any) => {
    const matchesTab = activeTab === "Semua" || item.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      item.kode_peminjaman?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.details?.some((d: any) => d.buku?.judul?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Tampilkan error jika fetch gagal
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-rose-500">
        <p className="font-black uppercase tracking-widest">Gagal Load Data!</p>
        <p className="text-xs">{(error as any)?.message}</p>
      </div>
    );
  }

  if (isLoading && displayData.length === 0) return <SkeletonLoading />;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
             <LibraryBig size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Status & Data</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Daftar <span className="text-emerald-500">Peminjaman</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <StatCard icon={<BookOpen size={20} />} label="Total" value={displayData.length} color="emerald" />
          <StatCard 
            icon={<Clock size={20} />} 
            label="Dipinjam" 
            value={displayData.filter((i:any) => i.status?.toLowerCase() === 'dipinjam').length} 
            color="indigo" 
          />
        </div>
      </header>

      <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} />

      {/* DATA LIST */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item: any) => (
            <PeminjamanCard key={item.id} item={item} onOpenDetail={() => setSelectedItem(item)} />
          ))
        ) : (
          <div className="py-24 text-center bg-[#0B1120] border border-slate-900 rounded-[3rem] relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full" />
            
            <div className="relative flex flex-col items-center justify-center space-y-5">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] text-emerald-500 shadow-2xl shadow-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                <LibraryBig size={48} strokeWidth={1.5} className="opacity-80 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="space-y-1">
                <p className="text-white font-black uppercase italic tracking-tighter text-xl">
                  Belum Ada <span className="text-emerald-500">Data</span>
                </p>
                <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">
                  Data Tidak Ditemukan
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="max-w-7xl mx-auto p-10 animate-pulse space-y-8">
      <div className="h-10 w-48 bg-slate-800 rounded-xl" />
      <div className="h-40 w-full bg-slate-900 rounded-[2.5rem]" />
      <div className="space-y-4">
        <div className="h-32 w-full bg-slate-900/50 rounded-[2rem]" />
        <div className="h-32 w-full bg-slate-900/50 rounded-[2rem]" />
      </div>
    </div>
  );
}