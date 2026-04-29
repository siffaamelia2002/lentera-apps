import {
  LayoutDashboard,
  Users,
  Library,
  GraduationCap,
  UserCircle,
  ShieldCheck,
  ClipboardCheck,
  School,
  DoorOpen,
  Tags,
  BookUser,
  Building2,
  ReceiptText,
  BadgePercent,
  RotateCcw, // 🔥 Icon baru untuk pengembalian
} from "lucide-react";

import type { MenuItem } from "@/types";

export const ADMIN_MENU: MenuItem[] = [
  /**
   * DASHBOARD
   */
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  /**
   * USER MANAGEMENT
   */
  {
    name: "Manajemen User",
    href: "#",
    icon: Users,
    group: "USER MANAGEMENT",
    child: [
      { name: "Data Guru", href: "/admin/users/guru", icon: GraduationCap },
      { name: "Data Siswa", href: "/admin/users/siswa", icon: UserCircle },
      { name: "Data Admin", href: "/admin/users/admin", icon: ShieldCheck },
    ],
  },

  /**
   * ACADEMIC DATA
   */
  {
    name: "Data Akademik",
    href: "#",
    icon: School,
    group: "ACADEMIC DATA",
    child: [
      { name: "Daftar Jurusan", href: "/admin/akademik/jurusan", icon: Library },
      { name: "Daftar Kelas", href: "/admin/akademik/kelas", icon: DoorOpen },
    ],
  },

  /**
   * INVENTORY
   */
  {
    name: "Data Buku",
    href: "#",
    icon: Library,
    group: "INVENTORY",
    child: [
      {
        name: "Kategori Buku",
        href: "/admin/kategori-buku",
        icon: Tags,
      },
      {
        name: "Katalog Buku",
        href: "/admin/buku",
        icon: Library,
      },
      {
        name: "Penulis",
        href: "/admin/penulis",
        icon: BookUser,
      },
      {
        name: "Penerbit",
        href: "/admin/penerbit",
        icon: Building2,
      },
    ],
  },

  /**
   * TRANSACTION / VERIFIKASI
   */
  {
    name: "Verifikasi Peminjaman",
    href: "/admin/peminjaman",
    icon: ClipboardCheck,
    group: "REPORTS",
  },
  
  // 🔥 TAMBAHAN MENU PENGEMBALIAN
  {
    name: "Verifikasi Pengembalian",
    href: "/admin/pengembalian",
    icon: RotateCcw,
    group: "REPORTS",
  },

  /**
   * MANAJEMEN DENDA
   */
  {
    name: "Manajemen Denda",
    href: "#",
    icon: ReceiptText,
    group: "REPORTS",
    child: [
      {
        name: "Data Denda",
        href: "/admin/denda",
        icon: ReceiptText,
      },
      {
        name: "Kategori Denda",
        href: "/admin/kategori-denda",
        icon: BadgePercent,
      },
    ],
  },
];