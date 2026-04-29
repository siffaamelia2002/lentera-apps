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
    <div className="bg-[#0B1120] border border-slate-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8 sticky top-28">
      <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
        <CalendarIcon size={18} className="text-emerald-500" /> Penjadwalan
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Tanggal Mulai</span>
            <p className="text-sm font-bold text-white mt-1">{format(tglPinjam!, "PPP")}</p>
        </div>

        <Popover className="relative">
          {/* Menggunakan render props ({ close }) untuk fitur auto-close */}
          {({ close }) => (
            <>
              <PopoverButton className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-left flex justify-between items-center hover:border-slate-700 transition-all outline-none">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Tanggal Kembali</span>
                  <span className="text-sm font-bold text-white mt-1">{tglKembali ? format(tglKembali, "PPP") : "Pilih Tanggal"}</span>
                </div>
                <ChevronDown size={18} className="text-slate-600" />
              </PopoverButton>
              
              {/* Posisi PopoverPanel di-adjust untuk responsive (tengah di mobile, kanan di desktop) */}
              <PopoverPanel className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 w-max max-w-[95vw] bg-slate-900 border border-slate-800 p-4 rounded-[2rem] shadow-2xl origin-top">
                <DayPicker 
                  mode="single" 
                  selected={tglKembali} 
                  onSelect={(date) => {
                    setTglKembali(date);
                    if (date) close(); // Menutup otomatis setelah klik tanggal
                  }} 
                  disabled={[{ before: today }]} 
                  className="text-white bg-slate-900 rounded-2xl m-0" 
                />
              </PopoverPanel>
            </>
          )}
        </Popover>
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={14} className="text-emerald-500" /> Ringkasan Item
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {selectedBooks.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-white font-bold uppercase italic truncate max-w-[180px]">{item.buku?.judul}</span>
              <span className="text-emerald-500 font-black text-[10px]">x{item.qty}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Total Durasi</span>
          <span className={isTooLong ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}>
            {tglKembali ? `${durasi} HARI ${isTooLong ? '(MAX 7)' : ''}` : '-'}
          </span>
        </div>
        
        <button
          onClick={onShowConfirm}
          disabled={!canSubmit || isSubmitting}
          className={`w-full py-5 rounded-[1.8rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${canSubmit && !isSubmitting ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 active:scale-95 hover:bg-emerald-500" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
        >
          {isSubmitting ? "Memproses..." : "Ajukan Pinjaman"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}