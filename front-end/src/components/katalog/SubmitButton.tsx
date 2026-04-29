// components/BookDetailModal/SubmitButton.tsx
import { ShoppingBasket } from "lucide-react";

interface SubmitButtonProps {
  onConfirm: () => void;
  isSubmitting: boolean;
  stok: number;
  quantity: number;
}

export default function SubmitButton({ onConfirm, isSubmitting, stok, quantity }: SubmitButtonProps) {
  const isDisabled = stok <= 0 || quantity <= 0 || isSubmitting;

  return (
    <div className="mt-8">
      <button 
        onClick={onConfirm}
        disabled={isDisabled}
        className="group relative w-full h-20 overflow-hidden rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed shadow-2xl"
      >
        <div className={`absolute inset-0 transition-all duration-300 ${
          isDisabled
          ? "bg-slate-900/50 border-t border-slate-800" 
          : "bg-[#0f172a]/80 backdrop-blur-xl border-t-2 border-emerald-500/50 group-hover:border-emerald-400 group-hover:bg-emerald-950/50 shadow-inner"
        }`} />

        {!isSubmitting && stok > 0 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
        )}

        <div className="relative flex items-center justify-center gap-4 text-white z-10">
          <span className={`${isDisabled ? 'text-slate-500' : 'text-emerald-50'}`}>
            {isSubmitting ? "Memproses..." : stok <= 0 ? "Stok Habis" : "Masukkan Keranjang"}
          </span>
          
          {!isSubmitting && stok > 0 && (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl transition-all duration-300 group-hover:bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <ShoppingBasket size={20} className="text-emerald-400 group-hover:text-white" />
            </div>
          )}
        </div>

        {stok > 0 && !isSubmitting && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent group-hover:animate-shine" />
          </div>
        )}
      </button>
    </div>
  );
}