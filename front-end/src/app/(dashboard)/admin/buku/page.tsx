import { fetchServer } from "@/libs/api-server";
import BukuClient from "./BukuClient";

export const dynamic = "force-dynamic";

export default async function BukuPage() {
  const data = await fetchServer("/api/buku");

  return <BukuClient initialBuku={data} />;
}