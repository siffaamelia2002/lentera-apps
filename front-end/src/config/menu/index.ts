import { ADMIN_MENU } from "./admin.menu";
import { USER_MENU } from "./user.menu"; // Import menu user yang baru

import type { Role, MenuItem } from "@/types";

export const MENU_CONFIG: Record<Role, MenuItem[]> = {
  admin: ADMIN_MENU,
  user: USER_MENU,
};

export const getMenuItems = (role: Role): MenuItem[] => {
  // Jika role tidak ditemukan, default balik ke menu user
  return MENU_CONFIG[role] || MENU_CONFIG.user;
};

// 🔥 re-export biar cukup 1 import dari luar
export type { Role, MenuItem };