"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

export default function JurusanPage() {
  const endpoint = "jurusan";

  const { data: jurusanData, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
  });

  // Ambil data unik dari DB untuk dijadikan dropdown
  const rawKodes = jurusanData?.map((item: any) => item.kode_jurusan).filter(Boolean) || [];
  const uniqueKodes = Array.from(new Set(rawKodes)) as string[];

  const columns = [
    { 
      header: "Nama Jurusan", 
      accessor: "nama_jurusan", 
      type: "text" as const 
    },
    { 
      header: "Kode Jurusan", 
      accessor: "kode_jurusan",
      type: "select" as const, // Cukup set "select", nanti UserTable yang mikir
      options: uniqueKodes
    },
    { 
      header: "Tanggal Dibuat", 
      accessor: "created_at" 
    },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable 
        title="Daftar Jurusan" 
        description="Kelola data program keahlian sekolah dengan sistem terpusat" 
        columns={columns} 
        data={jurusanData || []} 
        isLoading={isLoading}
        endpoint={endpoint} 
      />
    </div>
  );
}