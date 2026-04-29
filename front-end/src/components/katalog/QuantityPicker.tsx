// components/BookDetailModal/QuantityPicker.tsx
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
      toast.error(`Stok maksimal: ${stok}`);
    } else {
      setQuantity(numValue);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between px-1">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Jumlah Pinjam</span>
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Tersedia: {stok}</span>
      </div>
      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
        <button 
          type="button" 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || isSubmitting}
          className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-all disabled:opacity-20"
        >
          <Minus size={20} />
        </button>
        <input 
          type="number" 
          value={quantity === 0 ? "" : quantity} 
          onChange={handleInputChange}
          className="w-full text-center text-2xl font-black text-white bg-transparent border-none focus:ring-0"
        />
        <button 
          type="button"
          onClick={() => setQuantity(Math.min(stok, quantity + 1))}
          disabled={quantity >= stok || isSubmitting}
          className="w-12 h-12 flex items-center justify-center bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all disabled:opacity-20"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}