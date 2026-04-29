import KeranjangClient from "./KeranjangClient";

export const metadata = {
  title: "Checkout Peminjaman | Perpustakaan",
  description: "Keranjang pengajuan peminjaman buku",
};

export default function KeranjangPengajuanPage() {
  return <KeranjangClient />;
}