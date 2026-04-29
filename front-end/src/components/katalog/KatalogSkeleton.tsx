export default function KatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-64 bg-slate-800/60 animate-pulse rounded-2xl"
        />
      ))}
    </div>
  );
}