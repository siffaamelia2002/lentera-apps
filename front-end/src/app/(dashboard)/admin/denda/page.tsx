import { fetchServer } from "@/libs/api-server";
import DendaClient from "./DendaClient";

export const dynamic = "force-dynamic";

export default async function DendaPage() {
  // Ambil data denda terbaru dari API
  const data = await fetchServer("/api/denda");

  return <DendaClient initialData={data} />;
}