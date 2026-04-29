import { fetchServer } from "@/libs/api-server";
import GuruClient from "./GuruClient";

export const dynamic = "force-dynamic";

export const metadata = { 
  title: "Kelola Guru | LIBRA",
  description: "Manajemen data pengajar perpustakaan"
};

export default async function GuruPage() {
  // Fetch data user dengan filter peran 'guru'
  const data = await fetchServer("/api/users?peran=guru");

  return <GuruClient initialData={data} />;
}