import { fetchServer } from "@/libs/api-server";
import PeminjamanClient from "./PeminjamanClient";

export const dynamic = "force-dynamic";

export default async function PeminjamanPage() {
  // Ambil data peminjaman terbaru dari API
  const data = await fetchServer("/api/peminjaman");

  // Ubah nama prop menjadi initialData agar sinkron dengan Client Component
  return <PeminjamanClient initialData={data} />;
}