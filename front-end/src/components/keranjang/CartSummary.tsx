"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, BookOpen, ArrowRight } from "lucide-react";
import "react-day-picker/dist/style.css";

export default function CartSummary({
  selectedBooks, tglPinjam, tglKembali, setTglKembali, durasi, 
  isTooLong, canSubmit, isSubmitting, onShowConfirm
}: any) {
  const today = startOfDay(new Date());

  return (
    <div className="bg-[#0B1120] border border-slate-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8 sticky top-28 backdrop-blur-sm">
      {/* Header Penjadwalan LENTERA */}
      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
        <CalendarIcon size={18} className="text-indigo-500" /> Penjadwalan Reservasi
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {/* Tanggal Mulai (Read-only) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 shadow-inner">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-70">Awal Pinjam</span>
            <p className="text-sm font-bold text-white mt-1 tracking-tight">{format(tglPinjam!, "PPP")}</p>
        </div>

        {/* Picker Tanggal Kembali */}
        <Popover className="relative">
          {({ close }) => (
            <>
              <PopoverButton className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-left flex justify-between items-center hover:border-indigo-500/30 transition-all outline-none group">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-70 group-hover:text-indigo-400">Target Kembali</span>
                  <span className="text-sm font-bold text-white mt-1 tracking-tight">
                    {tglKembali ? format(tglKembali, "PPP") : "Pilih Tanggal"}
                  </span>
                </div>
                <ChevronDown size={18} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </PopoverButton>
              
              <PopoverPanel className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 w-max max-w-[95vw] bg-slate-900 border border-slate-800 p-4 rounded-[2rem] shadow-2xl origin-top animate-in fade-in zoom-in-95 duration-200">
                <DayPicker 
                  mode="single" 
                  selected={tglKembali} 
                  onSelect={(date) => {
                    setTglKembali(date);
                    if (date) close(); 
                  }} 
                  disabled={[{ before: today }]} 
                  className="text-white bg-slate-900 rounded-2xl m-0" 
                />
              </PopoverPanel>
            </>
          )}
        </Popover>
      </div>

      {/* Ringkasan Item Terpilih */}
      <div className="pt-6 border-t border-slate-800/50 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <BookOpen size={14} className="text-indigo-500" /> Rincian Arsip
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {selectedBooks.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 group hover:border-indigo-500/20 transition-all">
              <span className="text-[10px] text-slate-300 font-bold uppercase italic truncate max-w-[180px] group-hover:text-white transition-colors">
                {item.buku?.judul}
              </span>
              <span className="text-indigo-500 font-black text-[11px] tracking-tighter">x{item.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & CTA Action */}
      <div className="pt-6 border-t border-slate-800 space-y-5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <span>Durasi Peminjaman</span>
          <span className={isTooLong ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}>
            {tglKembali ? `${durasi} HARI ${isTooLong ? '(MAX 7)' : ''}` : 'BELUM DITENTUKAN'}
          </span>
        </div>
        
        <button
          onClick={onShowConfirm}
          disabled={!canSubmit || isSubmitting}
          className={`w-full py-5 rounded-[1.8rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 ${
            canSubmit && !isSubmitting 
            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 active:scale-95 hover:bg-indigo-500 border-t border-white/10" 
            : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/30"
          }`}
        >
          {isSubmitting ? "Memproses Data..." : "Ajukan Reservasi"}
          <ArrowRight size={18} className={canSubmit && !isSubmitting ? "animate-pulse" : ""} />
        </button>
      </div>

      <style jsx global>{`
        .rdp { --rdp-accent-color: #6366f1; --rdp-background-color: #1e1b4b; margin: 0; }
        .rdp-day_selected { background-color: var(--rdp-accent-color) !important; font-weight: bold; border-radius: 12px; }
      `}</style>
    </div>
  );
}