import { fetchServer } from "@/libs/api-server";
import PengembalianClient from "./PengembalianClient";

export const dynamic = "force-dynamic";

export default async function PengembalianPage() {
  // Tambahkan prefix /api agar sesuai dengan route di Laravel
  const data = await fetchServer("/api/pengembalian");

  return <PengembalianClient initialData={data} />;
}