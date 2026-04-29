import { fetchServer } from "@/libs/api-server";
import PetugasClient from "./PetugasClient";

export const dynamic = "force-dynamic";

export const metadata = { 
  title: "Kelola Petugas | LIBRA",
  description: "Halaman manajemen petugas perpustakaan"
};

export default async function PetugasPage() {
  // Ambil data dari server (SSR) agar SEO dan load awal cepat
  // Sesuaikan endpoint dengan API Laravel kamu (misal: /api/users)
const data = await fetchServer("/api/users?peran=admin");

  return <PetugasClient initialData={data} />;
}