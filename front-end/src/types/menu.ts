import type { LucideIcon } from "lucide-react";

export interface SubMenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  group?: string;
  child?: SubMenuItem[];
}

// Update baris ini: Hapus "guru" & "siswa", ganti jadi "user"
export type Role = "admin" | "user";