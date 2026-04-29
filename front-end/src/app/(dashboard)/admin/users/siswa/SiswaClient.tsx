"use client";

import { useQuery } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import api from "@/libs/api-client";
import { useEffect } from "react";

export default function SiswaClient({ initialData }: { initialData: any }) {
  const endpoint = "users";

  // ===============================
  // 🔥 FETCH DATA SISWA
  // ===============================
  const { data: siswaData = [], isLoading } = useQuery({
    queryKey: [endpoint, "siswa"],
    queryFn: async () => {
      const res = await api.get(endpoint, { params: { peran: "siswa" } });
      return res.data?.data ?? res.data ?? [];
    },
    initialData,
  });

  // ===============================
  // 🔥 FETCH JURUSAN
  // ===============================
  const { data: jurusanData = [] } = useQuery({
    queryKey: ["opt-jurusan"],
    queryFn: async () => {
      const res = await api.get("jurusan");
      return res.data?.data ?? res.data ?? [];
    },
  });

  // ===============================
  // 🔥 FETCH KELAS
  // ===============================
  const { data: kelasData = [] } = useQuery({
    queryKey: ["opt-kelas"],
    queryFn: async () => {
      const res = await api.get("kelas");
      return res.data?.data ?? res.data ?? [];
    },
  });

  // ===============================
  // 🔥 HELPER STATUS (FIXED TYPE MISMATCH)
  // ===============================
  const getStatus = (row: any) => {
    // Pakai Number() buat antisipasi return API berbentuk string "0"
    if (Number(row.is_aktif) === 0) {
      return row.siswa?.status ? row.siswa.status : "nonaktif";
    }
    return "aktif";
  };

  // ===============================
  // 🔥 OPTIONS
  // ===============================
  const opsiJurusan = jurusanData.map((j: any) => ({
    label: j.nama_jurusan,
    value: j.id,
  }));

  const opsiKelas = kelasData.map((k: any) => ({
    label: k.nama_kelas,
    value: k.id,
  }));

  // ===============================
  // 🔥 COLUMNS
  // ===============================
  const columns = [
    {
      header: "Nama Lengkap",
      accessor: "name",
      type: "text" as const,
    },
    {
      header: "NISN",
      accessor: "siswa.nisn",
      formKey: "nisn",
      type: "text" as const,
      render: (row: any) => row.siswa?.nisn || "-",
    },
    {
      header: "Kelas",
      accessor: "siswa.kelas_id",
      formKey: "kelas_id",
      type: "select" as const,
      options: opsiKelas,
      render: (row: any) => row.siswa?.kelas?.nama_kelas || "-",
    },
    {
      header: "Jurusan",
      accessor: "siswa.jurusan_id",
      formKey: "jurusan_id",
      type: "select" as const,
      options: opsiJurusan,
      render: (row: any) => row.siswa?.jurusan?.nama_jurusan || "-",
    },
    {
      header: "No. HP",
      accessor: "no_hp",
      type: "text" as const,
    },
    {
      header: "Status",
      accessor: "status_combined",
      formKey: "status",
      type: "select" as const,
      options: [
        { label: "Aktif", value: "aktif" },
        { label: "Lulus", value: "lulus" },
        { label: "Pindah", value: "pindah" },
        { label: "Keluar", value: "keluar" },
        { label: "Nonaktif", value: "nonaktif" },
      ],
      render: (row: any) => {
        const status = getStatus(row);
        const colors: any = {
          aktif: "bg-green-500/10 text-green-500",
          lulus: "bg-blue-500/10 text-blue-500",
          pindah: "bg-yellow-500/10 text-yellow-500",
          keluar: "bg-rose-500/10 text-rose-500",
          nonaktif: "bg-gray-500/10 text-gray-400",
        };

        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[status] || colors['nonaktif']}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Tgl Lulus/Keluar",
      accessor: "siswa.tanggal_lulus_atau_keluar",
      formKey: "tanggal_lulus_atau_keluar",
      type: "date" as const,
      showCondition: (values: any) => {
        const currentStatus = values.status || getStatus(values);
        return ["lulus", "keluar", "pindah"].includes(currentStatus);
      },
      render: (row: any) => row.siswa?.tanggal_lulus_atau_keluar || "-",
    },
  ];

  return (
    <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserTable
        title="Data Siswa"
        description="Manajemen database siswa, distribusi kelas dan status akademik."
        columns={columns}
        data={siswaData}
        isLoading={isLoading}
        endpoint={endpoint}
        searchPlaceholder="Cari nama atau NISN..."
      />
    </div>
  );
}