"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { AlertTriangle, X, CheckCircle2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "success" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batalkan",
  variant = "info",
  isLoading = false,
}: ConfirmModalProps) {
  
  const themes = {
    danger: {
      icon: <AlertTriangle className="text-rose-500" size={24} />,
      bgIcon: "bg-rose-500/10 border-rose-500/20",
      btn: "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20",
    },
    success: {
      icon: <CheckCircle2 className="text-emerald-500" size={24} />,
      bgIcon: "bg-emerald-500/10 border-emerald-500/20",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20",
    },
    info: {
      icon: <AlertTriangle className="text-emerald-500" size={24} />, // Pakai icon peringatan tapi warna emerald khas LIBRA
      bgIcon: "bg-emerald-500/10 border-emerald-500/20",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20",
    },
  };

  const activeTheme = themes[variant];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop Backdrop */}
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-[#0B1120] border border-slate-900 p-8 text-left align-middle shadow-2xl transition-all">
                
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-5">
                  {/* Icon Wrapper */}
                  <div className={`p-4 rounded-2xl border ${activeTheme.bgIcon}`}>
                    {activeTheme.icon}
                  </div>

                  <div className="space-y-2">
                    <DialogTitle as="h3" className="text-xl font-black text-white uppercase italic tracking-tighter">
                      {title}
                    </DialogTitle>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed uppercase tracking-tight text-pretty">
                      {description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    <button
                      type="button"
                      className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-950 border border-slate-800 hover:bg-slate-900 transition-all active:scale-95"
                      onClick={onClose}
                    >
                      {cancelText}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${activeTheme.btn}`}
                      onClick={onConfirm}
                    >
                      {isLoading ? "PROSES..." : confirmText}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}