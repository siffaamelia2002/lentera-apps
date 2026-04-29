import DendaClient from "./DendaClient";

export const metadata = {
  title: "Tagihan & Denda | Perpustakaan",
  description: "Daftar tagihan denda keterlambatan dan kerusakan buku",
};

export default function DendaPage() {
  return <DendaClient />;
}