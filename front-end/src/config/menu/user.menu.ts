import {
  LayoutDashboard,
  Search,
  Bookmark,
  RotateCcw,
  ReceiptText, // Icon alternatif yang cocok buat tagihan/denda
} from "lucide-react";

import type { MenuItem } from "@/types";

export const USER_MENU: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Katalog Buku",
    href: "/katalog",
    icon: Search,
    group: "EXPLORE",
  },
  {
    name: "Peminjaman",
    href: "/peminjaman",
    icon: Bookmark,
    group: "MY LIBRARY",
  },
  {
    name: "Pengembalian",
    href: "/pengembalian",
    icon: RotateCcw,
    group: "MY LIBRARY",
  },
  {
    name: "Denda & Tagihan",
    href: "/denda",
    icon: ReceiptText,
    group: "PAYMENT", // Gue ganti ACCOUNT jadi PAYMENT biar lebih tegas fungsinya
  },
];