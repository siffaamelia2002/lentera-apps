"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

export default function PengembalianClient({ initialData }: any) {
  // Ditambahkan prefix api/ sesuai hasil php artisan route:list
  const endpoint = "api/pengembalian"; 

  const { data: pengembalianData, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data; 
    },
    initialData,
  });

  const columns = [
    {
      header: "Nama Peminjam",
      accessor: "peminjaman.user.name",
      render: (row: any) => (
        <span className="font-bold text-emerald-400">
          {row?.peminjaman?.user?.name || "-"}
        </span>
      )
    },
    {
      header: "Buku",
      accessor: "buku",
      render: (row: any) => {
        const details = row?.peminjaman?.details;
        if (Array.isArray(details)) {
            return details.map((d: any) => d.buku?.judul).join(", ");
        }
        return details?.buku?.judul || "-";
      }
    },
    {
      header: "Kondisi",
      accessor: "kondisi_buku",
      render: (row: any) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
          row.kondisi_buku === 'baik' ? 'bg-emerald-500/10 text-emerald-500' :
          row.kondisi_buku === 'rusak' ? 'bg-amber-500/10 text-amber-500' :
          'bg-rose-500/10 text-rose-500'
        }`}>
          {row.kondisi_buku || "BAIK"}
        </span>
      )
    },
    {
      header: "Catatan",
      accessor: "catatan",
      render: (row: any) => row.catatan ? `${row.catatan.substring(0, 30)}...` : "-"
    },
    {
      header: "Dikembalikan Pada",
      accessor: "created_at",
      render: (row: any) =>
        row?.created_at
          ? new Date(row.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-",
    },
    {
      header: "Petugas",
      accessor: "petugas.name",
      render: (row: any) => row?.petugas?.name || "-"
    }
  ];

  const tableData = pengembalianData?.data || pengembalianData || [];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Riwayat Pengembalian"
        description="Pantau detail buku yang telah dikembalikan ke perpustakaan."
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari data peminjam atau buku..."
        showAddButton={false}
        showEditButton={false}
        showDeleteButton={false}
        showDetailButton={true}
      />
    </div>
  );
}