"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

/**
 * Halaman Manajemen Penulis
 */
export default function PenulisClient({ initialData }: any) {

  const endpoint = "penulis";

  const { data: penulisData, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
    initialData,
  });

  const columns = [
    { 
      header: "Nama Penulis", 
      accessor: "nama", 
      type: "text" as const 
    },

    { 
      header: "Dibuat Pada", 
      accessor: "created_at",
      type: undefined, // 🔥 INI KUNCINYA → gak masuk form
      render: (row: any) =>
        row?.created_at
          ? new Date(row.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-"
    },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Data Penulis"
        description="Kelola data penulis buku."
        columns={columns}
        data={penulisData || []}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari penulis..."
      />
    </div>
  );
}