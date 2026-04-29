"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";

export default function BukuClient({ initialBuku }: { initialBuku: any[] }) {

  const endpoint = "buku";

  // ===============================
  // SINGLE SOURCE DATA 🔥
  // ===============================
  const { data: bukuData = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data?.data ?? res.data ?? [];
    },
    initialData: initialBuku,
  });

  // ===============================
  // AUTO OPTIONS (DARI DATA BUKU)
  // ===============================
  const opsiKategori = useMemo(() => {
    const map = new Map();
    bukuData.forEach((b: any) => {
      if (b.kategori) {
        map.set(b.kategori.id, {
          label: b.kategori.nama_kategori,
          value: String(b.kategori.id),
        });
      }
    });
    return Array.from(map.values());
  }, [bukuData]);

  const opsiPenulis = useMemo(() => {
    const map = new Map();
    bukuData.forEach((b: any) => {
      if (b.penulis) {
        map.set(b.penulis.id, {
          label: b.penulis.nama,
          value: String(b.penulis.id),
        });
      }
    });
    return Array.from(map.values());
  }, [bukuData]);

  const opsiPenerbit = useMemo(() => {
    const map = new Map();
    bukuData.forEach((b: any) => {
      if (b.penerbit) {
        map.set(b.penerbit.id, {
          label: b.penerbit.nama,
          value: String(b.penerbit.id),
        });
      }
    });
    return Array.from(map.values());
  }, [bukuData]);

  // ===============================
  // COLUMNS
  // ===============================
  const columns = useMemo(() => [
    {
      header: "Cover",
      accessor: "cover",
      type: "file" as const,
      render: (row: any) => (
        <div className="h-16 w-12 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-lg">
          <img
            src={row.cover || "https://placehold.co/400x600?text=No+Cover"}
            alt={row.judul}
            className="object-cover w-full h-full"
          />
        </div>
      ),
    },

    { header: "Judul Buku", accessor: "judul", type: "text" as const },

    {
      header: "Kategori",
      accessor: "kategori_id",
      type: "select" as const,
      options: opsiKategori,
      render: (row: any) => row.kategori?.nama_kategori || "-",
    },

    {
      header: "Penulis",
      accessor: "penulis_id",
      type: "select" as const,
      options: opsiPenulis,
      render: (row: any) => row.penulis?.nama || "-",
    },

    {
      header: "Penerbit",
      accessor: "penerbit_id",
      type: "select" as const,
      options: opsiPenerbit,
      render: (row: any) => row.penerbit?.nama || "-",
    },

    { header: "Stok", accessor: "stok", type: "number" as const },

    {
      header: "Harga",
      accessor: "harga",
      type: "number" as const,
      render: (row: any) =>
        row?.harga
          ? `Rp ${Number(row.harga).toLocaleString("id-ID")}`
          : "-",
    },

    // 🔥 FIELD TAMBAHAN (FORM SAJA)
    { header: "Tahun", accessor: "tahun_terbit", type: "text", hidden: true },
    { header: "Deskripsi", accessor: "deskripsi", type: "textarea", hidden: true },

  ], [opsiKategori, opsiPenulis, opsiPenerbit]);

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Katalog Buku"
        description="Kelola koleksi buku"
        columns={columns}
        data={Array.isArray(bukuData) ? bukuData : []} // 🔥 ANTI ERROR
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari judul buku..."
        filterOptions={opsiKategori}
        filterColumn="kategori_id"
        filterPlaceholder="Semua Kategori"
      />
    </div>
  );
}