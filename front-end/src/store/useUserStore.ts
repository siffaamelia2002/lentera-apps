import { create } from "zustand";
import { persist, subscribeWithSelector, createJSONStorage } from "zustand/middleware";

interface User {
  id?: number | string;
  name: string;
  email?: string;
  peran: string;
  profile_picture?: string;
}

interface UserState {
  user: User | null;
  cartCount: number;
  hasHydrated: boolean;
  
  // 🔥 DATA GLOBAL
  data: {
    dashboard: any | null;
    peminjaman: any[] | null;
    pengembalian: any[] | null;
  };

  setUser: (newUser: Partial<User> | null) => void;
  setHasHydrated: (state: boolean) => void;
  setCartCount: (count: number) => void; 
  
  // 🔥 TAMBAHKAN INI: Biar nyambung sama BookDetailModal
  updateCartCount: (qty: number) => void; 
  
  // 🔥 ACTION GLOBAL
  setGlobalData: (key: keyof UserState['data'], value: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        user: null,
        cartCount: 0,
        hasHydrated: false,
        data: {
          dashboard: null,
          peminjaman: null,
          pengembalian: null,
        },

        setUser: (newUser) => {
          const current = get().user;
          if (!newUser) {
            set({ user: null });
            return;
          }
          set({ user: { ...(current || {}), ...newUser } as User });
        },

        // Ini buat nge-set angka pasti (misal pas baru login fetch cart dari backend)
        setCartCount: (count) => set({ cartCount: count }),

        // 🔥 INI FUNGSI BARU YANG DIPANGGIL MODAL TADI
        // Logic-nya: Angka cart sekarang + jumlah yang baru dipinjam
        updateCartCount: (qty) => set((state) => ({ 
          cartCount: (state.cartCount || 0) + qty 
        })),

        setGlobalData: (key, value) => {
          set((state) => ({
            data: { ...state.data, [key]: value }
          }));
        },

        clearUser: () => {
          set({ 
            user: null, 
            cartCount: 0, 
            data: { 
              dashboard: null, 
              peminjaman: null, 
              pengembalian: null 
            } 
          });
          localStorage.removeItem("user-storage");
        },

        setHasHydrated: (state) => set({ hasHydrated: state }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          cartCount: state.cartCount,
          data: state.data, 
        }),
      }
    )
  )
);