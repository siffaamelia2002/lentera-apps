"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

export default function KelasPage() {
  const endpoint = "kelas";
  const jurusanEndpoint = "/api/jurusan";

  const { data: kelasData, isLoading: isKelasLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
  });

  const { data: jurusanData } = useQuery({
    queryKey: [jurusanEndpoint],
    queryFn: async () => {
      const res = await api.get(jurusanEndpoint);
      return res.data;
    },
  });

  const namaJurusanOptions = jurusanData?.map((j: any) => j.nama_jurusan) || [];

  const columns = [
    { header: "Nama Kelas", accessor: "nama_kelas", type: "text" as const },
    { 
      header: "Jurusan", 
      accessor: "jurusan_id", 
      type: "select" as const,
      options: namaJurusanOptions,
      // INI KUNCI AGAR TAMPIL NAMA
      render: (item: any) => {
        // Cek apakah ada data relasi dari backend
        if (item.jurusan?.nama_jurusan) {
          return item.jurusan.nama_jurusan;
        }
        
        // Cadangan: cari manual di jurusanData jika relasi belum termuat
        const match = jurusanData?.find((j: any) => j.id == item.jurusan_id);
        return match ? match.nama_jurusan : (item.jurusan_id || "N/A");
      },
    },
    { header: "Tanggal Dibuat", accessor: "created_at" },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable 
        title="Daftar Kelas" 
        description="Kelola data kelas. Pilih jurusan langsung dari daftar." 
        columns={columns} 
        data={kelasData || []} 
        isLoading={isKelasLoading}
        endpoint={endpoint} 
      />
    </div>
  );
}