import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import NotifyHandler from "@/components/auth/NotifyHandler"; // 🔥 Import Handler Global
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lentera - Digital Library",
  description: "Sistem Informasi Perpustakaan Modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
        <Providers>
          {/* 🔥 NOTIFY HANDLER (Global)
             Diletakkan di sini agar aktif di seluruh rute aplikasi.
             Tugasnya mendeteksi ?status=... di URL dan memicu Sonner.
          */}
          <NotifyHandler />

          {children}

          {/* KONFIGURASI TOASTER MODERN 
          */}
          <Toaster 
            theme="dark" 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                borderRadius: '1.25rem',
                border: '1px solid rgba(30, 41, 59, 0.5)', // slate-800/50
                background: 'rgba(2, 6, 23, 0.8)', // slate-950 dengan blur
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}