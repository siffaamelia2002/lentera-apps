import { fetchServer } from "@/libs/api-server";
import PenerbitClient from "./PenerbitClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetchServer("/api/penerbit");

  return <PenerbitClient initialData={data} />;
}