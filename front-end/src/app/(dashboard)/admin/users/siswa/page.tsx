import { fetchServer } from "@/libs/api-server";
import SiswaClient from "./SiswaClient";

export const dynamic = "force-dynamic";

export const metadata = { 
  title: "Kelola Siswa | LIBRA",
  description: "Manajemen data siswa perpustakaan"
};

export default async function SiswaPage() {
  // Fetch awal menggunakan SSR untuk data User dengan peran siswa
  const data = await fetchServer("/api/users?peran=siswa");

  return <SiswaClient initialData={data || []} />;
}