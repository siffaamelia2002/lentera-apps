// components/BookDetailModal/katalog-modal.ts

export interface Book {
  id: number;
  title: string;
  author: string;
  penerbit: string;
  stok: number;
  cover: string | null;
  category: string;
  deskripsi: string | null;
  tahun_terbit: number | string;
  harga: string | number | null; // Kolom harga ditambahkan
}