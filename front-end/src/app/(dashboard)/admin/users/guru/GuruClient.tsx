"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

export default function GuruClient({ initialData }: { initialData: any }) {
  const endpoint = "users";

  const { data: guruData = [], isLoading } = useQuery({
    queryKey: [endpoint, "guru"],
    queryFn: async () => {
      const res = await api.get(endpoint, {
        params: { peran: "guru" },
      });
      return res.data?.data ?? res.data ?? [];
    },
    initialData,
  });

  const columns = [
    {
      header: "Nama Lengkap",
      accessor: "name",
      type: "text" as const,
    },
    {
      header: "NIP / NUPTK",
      accessor: "guru.nip",
      formKey: "nip", // 🔥 PENTING: Mencegah error payload dari nested object
      type: "text" as const,
      render: (row: any) => row.guru?.nip || "-",
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
      header: "Alamat",
      accessor: "alamat",
      type: "textarea" as const, 
    },
    {
      header: "Status",
      accessor: "guru.status",
      formKey: "status", // 🔥 PENTING
      type: "select" as const,
      options: [
        { label: "Aktif", value: "aktif" },
        { label: "Resign", value: "resign" },
        { label: "Pensiun", value: "pensiun" },
        { label: "Cuti", value: "cuti" },
        { label: "Nonaktif", value: "nonaktif" },
      ],
      render: (row: any) => {
        let status = row.guru?.status || "aktif";
        
        // Handle jika diset is_aktif = 0 dari tabel users tapi status dari guru null
        if (Number(row.is_aktif) === 0 && !row.guru?.status) {
            status = "nonaktif";
        }

        const colors: Record<string, string> = {
          aktif: "bg-green-500/10 text-green-500",
          resign: "bg-red-500/10 text-red-500",
          pensiun: "bg-gray-500/10 text-gray-400",
          cuti: "bg-yellow-500/10 text-yellow-500",
          nonaktif: "bg-gray-500/10 text-gray-400",
        };
        
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[status] || 'bg-gray-500/10 text-gray-400'}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Data Guru"
        description="Kelola informasi pengajar, alamat, dan akses akun mereka."
        columns={columns}
        data={guruData}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari guru (nama/NIP/alamat)..."
      />
    </div>
  );
}