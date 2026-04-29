"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

export default function PetugasClient({ initialData }: { initialData: any }) {
  const endpoint = "users"; 

  const { data: petugasData = [], isLoading } = useQuery({
    queryKey: [endpoint, "petugas"],
    queryFn: async () => {
      const res = await api.get(endpoint, {
        params: { peran: 'admin' } 
      });
      return res.data?.data ?? res.data ?? [];
    },
    initialData,
  });

  const columns = [
    {
      header: "Nama Petugas",
      accessor: "name",
      type: "text" as const,
    },
    {
      header: "Email",
      accessor: "email",
      type: "text" as const,
    },
    {
      header: "No. HP",
      accessor: "no_hp",
      type: "text" as const,
    },
    {
      header: "Peran",
      accessor: "peran",
      type: "select" as const,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Guru", value: "guru" },
        { label: "Siswa", value: "siswa" },
      ],
    },
    {
      header: "Status",
      accessor: "is_aktif",
      type: "select" as const,
      options: [
        { label: "Aktif", value: 1 },
        { label: "Nonaktif", value: 0 },
      ],
      render: (row: any) => {
        const isAktif = Number(row.is_aktif) === 1;
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isAktif ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
            {isAktif ? "Aktif" : "Nonaktif"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Data Petugas"
        description="Manajemen akses administrator dan staf perpustakaan."
        columns={columns}
        data={petugasData}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari petugas (nama/email)..."
      />
    </div>
  );
}