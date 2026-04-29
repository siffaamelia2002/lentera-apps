import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // HAPUS fetchServer dan redirect di sini!
  // Biarkan middleware.ts atau DashboardLayoutClient yang jaga pintu.

  const serverTime = new Date().toISOString();

  return (
    <DashboardLayoutClient serverTime={serverTime}>
      {children}
    </DashboardLayoutClient>
  );
}