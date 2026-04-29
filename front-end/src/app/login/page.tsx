import type { Metadata } from "next";
import LoginBranding from "@/components/login/LoginBranding";
import LoginForm from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Login | LIBRA Perpustakaan Modern",
  description: "Masuk ke sistem informasi perpustakaan LIBRA untuk akses koleksi buku digital terlengkap.",
  openGraph: {
    title: "Login LIBRA",
    description: "Sistem Informasi Perpustakaan Masa Kini",
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex bg-white selection:bg-indigo-100 selection:text-indigo-700">
      {/* Visual Side (Kiri) */}
      <LoginBranding />

      {/* Input Side (Kanan) */}
      <LoginForm />
    </main>
  );
}