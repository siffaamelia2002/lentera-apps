import KatalogClient from "./KatalogClient";

export default function KatalogPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      {/* 🔥 kosongin initial biar gak blocking */}
      <KatalogClient initialBuku={[]} />
    </main>
  );
}