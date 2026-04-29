import { fetchServer } from "@/libs/api-server";
import KategoriClient from "./KategoriClient";

export const dynamic = "force-dynamic";

export default async function KategoriPage() {
  const data = await fetchServer("/api/kategori");

  return <KategoriClient initialData={data} />;
}