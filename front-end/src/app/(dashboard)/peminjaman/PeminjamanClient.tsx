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

  // Ref untuk menyimpan jejak data sebelumnya biar toast tidak spam
  const prevDataSignature = useRef<string | null>(null);

  // SULTAN FETCHING: TanStack Query dengan Auto-Update LENTERA Style
  const { data: peminjamanData, isLoading, isError, error } = useQuery({
    queryKey: ["peminjaman"],
    queryFn: async () => {
      // Pathing mengikuti standar LENTERA tanpa prefix 'api'
      const { data } = await api.get("peminjaman");
      const actualData = Array.isArray(data) ? data : (data.data || []);
      return actualData;
    },
    staleTime: 2000, 
    refetchInterval: 5000, // Refresh tiap 5 detik untuk data realtime
    refetchOnWindowFocus: true,
  });

  const displayData = peminjamanData || [];

  // 🔥 LOGIC TOAST NOTIFIKASI STATUS (LENTERA)
  useEffect(() => {
    const currentSignature = displayData
      .map((item: any) => `${item.id}-${item.status}`)
      .join("|");

    if (prevDataSignature.current !== null && prevDataSignature.current !== currentSignature) {
      toast.success("Pembaruan Status Sirkulasi! 📚", {
        description: "Petugas LENTERA baru saja memproses data sirkulasimu. Cek status terbarunya sekarang!",
        icon: <BellRing size={16} className="text-indigo-500" />,
        duration: 5000,
      });
    }

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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-rose-500">
        <p className="font-black uppercase tracking-[0.3em]">Gagal Sinkronisasi Data!</p>
        <p className="text-xs mt-2">{(error as any)?.message}</p>
      </div>
    );
  }

  if (isLoading && displayData.length === 0) return <SkeletonLoading />;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* HEADER LENTERA STYLE */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-500 mb-2">
             <LibraryBig size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sirkulasi & Arsip</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Daftar <span className="text-indigo-500">Sirkulasi</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <StatCard icon={<BookOpen size={20} />} label="Total Data" value={displayData.length} color="indigo" />
          <StatCard 
            icon={<Clock size={20} />} 
            label="Aktif" 
            value={displayData.filter((i:any) => i.status?.toLowerCase() === 'dipinjam').length} 
            color="indigo" 
          />
        </div>
      </header>

      <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} />

      {/* DATA LIST SIRKULASI */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item: any) => (
            <PeminjamanCard key={item.id} item={item} onOpenDetail={() => setSelectedItem(item)} />
          ))
        ) : (
          <div className="py-24 text-center bg-[#0B1120] border border-slate-900 rounded-[3rem] relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500">
            {/* Background Glow Indigo - Cinematic Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative flex flex-col items-center justify-center space-y-6">
              <div className="p-7 bg-slate-950 border border-slate-800 rounded-[2.2rem] text-indigo-500 shadow-2xl shadow-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                <LibraryBig size={56} strokeWidth={1.5} className="opacity-80 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-black uppercase italic tracking-tighter text-2xl">
                  Belum Ada <span className="text-indigo-500">Sirkulasi</span>
                </p>
                <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px]">
                  Arsip Data Tidak Ditemukan
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
    <div className="max-w-7xl mx-auto p-10 animate-pulse space-y-10">
      <div className="flex gap-4">
        <div className="h-10 w-48 bg-slate-800 rounded-xl" />
        <div className="h-10 w-48 bg-slate-800 rounded-xl" />
      </div>
      <div className="h-48 w-full bg-slate-900 rounded-[3rem]" />
      <div className="space-y-6">
        <div className="h-32 w-full bg-slate-900/50 rounded-[2.5rem]" />
        <div className="h-32 w-full bg-slate-900/50 rounded-[2.5rem]" />
      </div>
    </div>
  );
}