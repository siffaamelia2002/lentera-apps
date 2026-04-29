"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";

// Perbaikan 1: Jadikan title dan message opsional (?) agar tidak error jika lupa dipassing
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  // Perbaikan 2: Beri nilai default
  title = "KONFIRMASI HAPUS", 
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.", 
  isLoading 
}: ConfirmModalProps) {
  return (
    // Perbaikan 3: Tambahkan properti "appear" agar modal muncul mulus saat dipanggil
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[150]" onClose={onClose}>
        <Transition.Child 
          as={Fragment} 
          enter="ease-out duration-300" 
          enterFrom="opacity-0" 
          enterTo="opacity-100" 
          leave="ease-in duration-200" 
          leaveFrom="opacity-100" 
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child 
              as={Fragment} 
              enter="ease-out duration-300" 
              enterFrom="opacity-0 scale-95" 
              enterTo="opacity-100 scale-100" 
              leave="ease-in duration-200" 
              leaveFrom="opacity-100 scale-100" 
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl transition-all">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-6">
                  <AlertTriangle size={32} />
                </div>
                <Dialog.Title as="h3" className="text-xl font-black text-white uppercase tracking-tight">
                  {title}
                </Dialog.Title>
                <p className="mt-4 text-sm text-slate-400 font-medium leading-relaxed">
                  {message}
                </p>

                <div className="mt-8 flex gap-3">
                  {/* Perbaikan 4: Tambahkan type="button" agar tidak memicu event submit jika modal ada di dalam form */}
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="flex-1 bg-slate-950 text-slate-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    BATAL
                  </button>
                  <button 
                    type="button"
                    onClick={onConfirm} 
                    disabled={isLoading} 
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "MENGHAPUS..." : "YA, HAPUS DATA"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}