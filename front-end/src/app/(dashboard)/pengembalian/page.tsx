import PengembalianClient from "./PengembalianClient";

export const metadata = {
  title: "Pengembalian Buku | Perpustakaan",
  description: "Daftar buku yang sedang dipinjam dan harus dikembalikan",
};

export default function PengembalianPage() {
  return <PengembalianClient />;
}