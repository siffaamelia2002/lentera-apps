"use client";

import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
        </Transition.Child>

        {/* Wrapper */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} max-h-[85vh] transform rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl transition-all flex flex-col`}
              >
                
                {/* Accent */}
                <div className="w-full h-1.5 bg-emerald-500 rounded-t-[2rem]" />

                {/* HEADER (fixed) */}
                <div className="flex justify-between items-start p-6 border-b border-slate-800">
                  <div>
                    <Dialog.Title className="text-lg font-black text-white uppercase tracking-tight">
                      {title}
                    </Dialog.Title>
                    {description && (
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                        {description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-950 text-slate-500 hover:text-white border border-slate-800 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* CONTENT (scrollable 🔥) */}
                <div className="p-6 overflow-y-auto flex-1">
                  {children}
                </div>

              </Dialog.Panel>
            </Transition.Child>

          </div>
        </div>
      </Dialog>
    </Transition>
  );
}