"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

/**
 * Halaman Kategori Denda
 */
export default function KategoriDendaClient({ initialData }: any) {

  const endpoint = "/api/kategori-denda";

  const { data: kategoriData, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
    initialData,
  });

  // Fungsi helper untuk format Rupiah
  const formatRupiah = (amount: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const columns = [
    {
      header: "Nama Pelanggaran",
      accessor: "nama_pelanggaran",
      type: "text" as const,
    },
    {
      header: "Denda / Hari",
      accessor: "denda_per_hari",
      type: "number" as const,
      render: (row: any) => (
        <span className="font-semibold text-emerald-600">
          {row?.denda_per_hari > 0 ? formatRupiah(row.denda_per_hari) : "—"}
        </span>
      ),
    },
    {
      header: "Denda Flat",
      accessor: "denda_flat",
      type: "number" as const,
      render: (row: any) => (
        <span className="font-semibold text-rose-600">
          {row?.denda_flat > 0 ? formatRupiah(row.denda_flat) : "—"}
        </span>
      ),
    },
    {
      header: "Dibuat Pada",
      accessor: "created_at",
      type: undefined,
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
        title="Kategori Denda"
        description="Kelola jenis pelanggaran dan nominal dendanya."
        columns={columns}
        data={kategoriData || []}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari pelanggaran..."
      />
    </div>
  );
}