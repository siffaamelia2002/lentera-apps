import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard Member | Perpustakaan",
  description: "Panel informasi peminjaman dan aktivitas perpustakaan",
};

export default function UserDashboardPage() {
  return <DashboardClient />;
}