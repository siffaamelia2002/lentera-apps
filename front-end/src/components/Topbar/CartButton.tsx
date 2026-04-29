"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface CartButtonProps {
  peran: string;
}

export default function CartButton({ peran }: CartButtonProps) {
  // 🔥 Hydration Fix: Pastikan render di client agar reaktif dengan Zustand
  const [isMounted, setIsMounted] = useState(false);
  
  // Ambil count dari store
  const cartCount = useUserStore((s) => s.cartCount);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sembunyikan jika Admin atau belum mounted
  if (peran.toLowerCase() === "admin" || !isMounted) return null;

  const safeCart = cartCount ?? 0;

  return (
    <Link
      href="/keranjang"
      className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all group shadow-lg shadow-indigo-500/5"
    >
      <ShoppingCart size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
      
      {safeCart > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white border-2 border-slate-950 animate-in zoom-in duration-300 shadow-lg shadow-indigo-500/40">
          {safeCart}
        </span>
      )}
    </Link>
  );
}