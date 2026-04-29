import { fetchServer } from "@/libs/api-server";
import PenulisClient from "./PenulisClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetchServer("/api/penulis");

  return <PenulisClient initialData={data} />;
}