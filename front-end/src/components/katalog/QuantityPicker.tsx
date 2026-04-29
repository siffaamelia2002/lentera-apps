"use client";

import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface QuantityPickerProps {
  quantity: number;
  setQuantity: (val: number) => void;
  stok: number;
  isSubmitting: boolean;
}

export default function QuantityPicker({ quantity, setQuantity, stok, isSubmitting }: QuantityPickerProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") { setQuantity(0); return; }
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    if (numValue > stok) {
      setQuantity(stok);
      toast.error(`Kapasitas inventaris maksimal: ${stok}`);
    } else {
      setQuantity(numValue);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between px-1">
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
           Jumlah Reservasi
         </span>
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
           Tersedia: {stok}
         </span>
      </div>
      
      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-[1.5rem] border border-slate-800 shadow-inner group">
        {/* Tombol Kurangi - LENTERA Style */}
        <button 
          type="button" 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || isSubmitting}
          className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-900 rounded-xl transition-all disabled:opacity-20 active:scale-90"
        >
          <Minus size={20} />
        </button>

        <div className="relative flex-1">
          <input 
            type="number" 
            value={quantity === 0 ? "" : quantity} 
            onChange={handleInputChange}
            className="w-full text-center text-3xl font-black text-white bg-transparent border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {/* Decorative Indicator */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500/20 rounded-full group-focus-within:bg-indigo-500 transition-colors" />
        </div>

        {/* Tombol Tambah - Indigo Theme */}
        <button 
          type="button"
          onClick={() => setQuantity(Math.min(stok, quantity + 1))}
          disabled={quantity >= stok || isSubmitting}
          className="w-12 h-12 flex items-center justify-center bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all disabled:opacity-20 active:scale-90 shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}