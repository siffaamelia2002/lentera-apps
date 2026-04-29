import type { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Dashboard Admin | LIBRA",
  description: "Panel kendali utama administrator LIBRA",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}