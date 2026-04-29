"use client";

import { Checkbox } from "@headlessui/react";
import { Check, ImageOff, Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, isSelected, onToggle, onUpdateQty, onRemove }: any) {
  return (
    <div className={`flex items-center gap-4 lg:gap-6 p-5 rounded-[2.5rem] border transition-all duration-300 ${isSelected ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-slate-900 bg-[#0B1120]'}`}>
      <Checkbox checked={isSelected} onChange={() => onToggle(item.id)} className="group size-7 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center cursor-pointer data-[checked]:bg-emerald-600 shrink-0">
        <Check className="hidden group-data-[checked]:block text-white" size={16} strokeWidth={4} />
      </Checkbox>
      
      <div className="w-16 h-24 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shrink-0 shadow-2xl relative">
        {item.buku?.cover ? (
            <img 
              src={item.buku.cover} 
              alt="cover" 
              className="w-full h-full object-cover" 
              onError={(e:any) => { e.target.onerror = null; e.target.src="https://placehold.co/400x600/0f172a/64748b?text=NO+COVER"; }}
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <ImageOff size={20} className="text-slate-700" />
            </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-black text-base lg:text-lg uppercase italic truncate leading-tight">{item.buku?.judul}</h4>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
          {item.buku?.penulis_nama} — {item.buku?.tahun_terbit}
        </p>
        
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button onClick={() => onUpdateQty(item.id, item.qty - 1, item.buku?.stok)} className="p-1.5 text-slate-500 hover:text-white transition-colors"><Minus size={14} /></button>
            <input 
              type="number"
              value={item.qty}
              onChange={(e) => onUpdateQty(item.id, parseInt(e.target.value), item.buku?.stok)}
              className="w-12 bg-transparent text-center text-xs font-black text-emerald-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button onClick={() => onUpdateQty(item.id, item.qty + 1, item.buku?.stok)} className="p-1.5 text-slate-500 hover:text-white transition-colors"><Plus size={14} /></button>
          </div>
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">Sisa: {item.buku?.stok || 0}</span>
        </div>
      </div>

      <button onClick={() => onRemove(item.id)} className="p-2 text-slate-800 hover:text-rose-500 transition-colors">
        <Trash2 size={22} />
      </button>
    </div>
  );
}