"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

/**
 * Halaman Manajemen Kategori Buku
 * Kode kategori auto dari backend (Laravel FormRequest)
 */
export default function KategoriClient({ initialData }: any) {

  const endpoint = "kategori";

  const { data: kategoriData, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data; // 🔥 konsisten semua halaman
    },
    initialData,
  });

  const columns = [
    {
      header: "Nama Kategori",
      accessor: "nama_kategori",
      type: "text" as const,
    },

    {
      header: "Kode Sistem",
      accessor: "kode_kategori",
      type: undefined, // 🔥 tidak muncul di form (auto generate backend)
    },

    {
      header: "Dibuat Pada",
      accessor: "created_at",
      type: undefined, // 🔥 hanya tampil di tabel
      render: (row: any) =>
        row?.created_at
          ? new Date(row.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-",
    },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Kategori Buku"
        description="Kelola kategori buku. Kode akan dibuat otomatis oleh sistem."
        columns={columns}
        data={kategoriData || []}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari kategori..."
      />
    </div>
  );
}