import { fetchServer } from "@/libs/api-server";
import KategoriDendaClient from "./KategoriDendaClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetchServer("/api/kategori-denda");

  return <KategoriDendaClient initialData={data} />;
}