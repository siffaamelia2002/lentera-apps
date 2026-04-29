"use client";

import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalCustomProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: string;
}

export default function ModalCustom({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "max-w-xl",
}: ModalCustomProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        
        {/* Overlay dengan Backdrop Blur Indigo-tinted */}
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

        {/* Wrapper Utama */}
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
                className={`w-full ${size} max-h-[85vh] transform rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl transition-all flex flex-col overflow-hidden`}
              >
                
                {/* Indigo Top Accent Line (LENTERA Branding) */}
                <div className="w-full h-1.5 bg-indigo-500" />

                {/* HEADER SECTION */}
                <div className="flex justify-between items-start p-6 border-b border-slate-800 text-white bg-slate-900/50">
                  <div>
                    <Dialog.Title className="text-xl font-black uppercase tracking-tight italic">
                      {title}
                    </Dialog.Title>
                    {description && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="h-[1.5px] w-3 bg-indigo-500 rounded-full"></span>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                          {description}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2.5 bg-slate-950 text-slate-500 hover:text-indigo-400 rounded-xl border border-slate-800 transition-all hover:border-indigo-500/50 active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* CONTENT AREA (SCROLL MODERN) */}
                <div className="
                  overflow-y-auto 
                  flex-1 
                  p-8
                  custom-scrollbar
                  bg-slate-900
                  scrollbar-thin 
                  scrollbar-thumb-indigo-900 
                  scrollbar-track-slate-950
                  hover:scrollbar-thumb-indigo-700
                ">
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