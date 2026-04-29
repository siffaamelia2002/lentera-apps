"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { AlertTriangle, ShoppingBag, Loader2 } from "lucide-react";

export default function ConfirmModal({ 
  isOpen, onClose, onConfirm, title, description, confirmText = "Lanjutkan", variant = "success", isLoading 
}: any) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop dengan Blur Indigo-tinted */}
        <TransitionChild 
          as={Fragment} 
          enter="ease-out duration-300" 
          enterFrom="opacity-0" 
          enterTo="opacity-100" 
          leave="ease-in duration-200" 
          leaveFrom="opacity-100" 
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild 
            as={Fragment} 
            enter="ease-out duration-300" 
            enterFrom="opacity-0 scale-95" 
            enterTo="opacity-100 scale-100" 
            leave="ease-in duration-200" 
            leaveFrom="opacity-100 scale-100" 
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-[#0B1120] border border-slate-900 p-8 shadow-2xl transition-all relative">
              
              {/* Top Accent Line - LENTERA Style */}
              <div className={`absolute top-0 left-0 w-full h-1 ${variant === 'danger' ? 'bg-rose-600' : 'bg-indigo-600'}`} />

              <div className="flex flex-col items-center text-center space-y-5">
                {/* Icon Wrapper dengan Aksen Indigo khas LENTERA */}
                <div className={`p-4 rounded-2xl border ${variant === 'danger' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                  {variant === 'danger' ? (
                    <AlertTriangle className="text-rose-500" size={24} />
                  ) : (
                    <ShoppingBag className="text-indigo-500" size={24} />
                  )}
                </div>

                <div className="space-y-2">
                  <DialogTitle as="h3" className="text-xl font-black text-white uppercase italic tracking-tighter">
                    {title}
                  </DialogTitle>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`h-[1px] w-3 rounded-full ${variant === 'danger' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed">
                      LENTERA Security System
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed px-4">
                    {description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <button 
                    disabled={isLoading} 
                    onClick={onClose} 
                    className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-950 border border-slate-800 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                  >
                    Batal
                  </button>
                  <button 
                    disabled={isLoading} 
                    onClick={onConfirm} 
                    className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      variant === 'danger' 
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' 
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}