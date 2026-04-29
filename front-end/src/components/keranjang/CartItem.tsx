"use client";

import { Checkbox } from "@headlessui/react";
import { Check, ImageOff, Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, isSelected, onToggle, onUpdateQty, onRemove }: any) {
  return (
    <div className={`flex items-center gap-4 lg:gap-6 p-5 rounded-[2.5rem] border transition-all duration-300 ${isSelected ? 'border-indigo-500/40 bg-indigo-500/[0.03]' : 'border-slate-900 bg-[#0B1120]'}`}>
      {/* Checkbox dengan aksen Indigo khas LENTERA */}
      <Checkbox 
        checked={isSelected} 
        onChange={() => onToggle(item.id)} 
        className="group size-7 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center cursor-pointer data-[checked]:bg-indigo-600 shrink-0 transition-colors"
      >
        <Check className="hidden group-data-[checked]:block text-white" size={16} strokeWidth={4} />
      </Checkbox>
      
      {/* Image Container dengan border Indigo saat terpilih */}
      <div className={`w-16 h-24 bg-slate-950 rounded-xl overflow-hidden border shrink-0 shadow-2xl relative transition-colors ${isSelected ? 'border-indigo-500/50' : 'border-slate-800'}`}>
        {item.buku?.cover ? (
            <img 
              src={item.buku.cover} 
              alt="cover" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              onError={(e:any) => { e.target.onerror = null; e.target.src="https://placehold.co/400x600/0f172a/6366f1?text=NO+COVER"; }}
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <ImageOff size={20} className="text-slate-700" />
            </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-black text-base lg:text-lg uppercase italic truncate leading-tight tracking-tight">
          {item.buku?.judul}
        </h4>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">
          {item.buku?.penulis_nama} — {item.buku?.tahun_terbit}
        </p>
        
        <div className="flex items-center gap-3 mt-4">
          {/* Input Quantity dengan aksen Indigo */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button 
              onClick={() => onUpdateQty(item.id, item.qty - 1, item.buku?.stok)} 
              className="p-1.5 text-slate-600 hover:text-indigo-400 transition-colors"
            >
              <Minus size={14} />
            </button>
            <input 
              type="number"
              value={item.qty}
              onChange={(e) => onUpdateQty(item.id, parseInt(e.target.value), item.buku?.stok)}
              className="w-12 bg-transparent text-center text-xs font-black text-indigo-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              onClick={() => onUpdateQty(item.id, item.qty + 1, item.buku?.stok)} 
              className="p-1.5 text-slate-600 hover:text-indigo-400 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Inventaris</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter leading-none">
              Sisa: {item.buku?.stok || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Button Hapus */}
      <button 
        onClick={() => onRemove(item.id)} 
        className="p-2 text-slate-800 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all active:scale-90"
      >
        <Trash2 size={22} />
      </button>
    </div>
  );
}