// app/peminjaman/page.tsx
import PeminjamanClient from "./PeminjamanClient";

export const metadata = {
  title: "Daftar Peminjaman | Perpustakaan Sultan",
  description: "Cek status peminjaman buku lu dengan gaya",
};

export default function PeminjamanPage() {
  return <PeminjamanClient />;
}