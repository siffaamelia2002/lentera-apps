import { BookX } from "lucide-react";

export default function KatalogEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-600">
      <BookX size={64} className="mb-4 opacity-20" />
      <p className="text-lg font-bold italic uppercase tracking-widest opacity-50">
        Buku tidak ditemukan
      </p>
    </div>
  );
}