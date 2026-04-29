"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

// Update Interface agar mendukung Object
interface OptionObject {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: (string | OptionObject)[]; 
  selected: string | number;
  onChange: (value: string) => void;
}

export default function SelectModern({ label, name, options, selected, onChange }: SelectProps) {
  // Helper untuk mendapatkan label yang tampil di tombol
  const getSelectedLabel = () => {
    const found = options.find(opt => 
      typeof opt === 'string' ? opt === selected : String(opt.value) === String(selected)
    );
    if (!found) return `-- PILIH ${label} --`;
    return typeof found === 'string' ? found : found.label;
  };

  return (
    <div className="space-y-2 w-full">
      <label className="text-slate-500 text-[10px] font-black uppercase ml-1 tracking-widest">{label}</label>
      
      {/* Hidden input agar ID terkirim saat form submit */}
      <input type="hidden" name={name} value={selected} />

      <Listbox value={selected} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-6 pr-10 text-left text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner uppercase">
            <span className="block truncate">{getSelectedLabel()}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
              <ChevronDown size={18} aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-[110] mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-slate-900 border border-slate-800 py-2 shadow-2xl focus:outline-none scrollbar-hide">
              {options.map((opt, idx) => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const displayLabel = typeof opt === 'string' ? opt : opt.label;
                const isSelected = String(selected) === String(value);

                return (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-400'}`}
                    value={value}
                  >
                    <div className="flex items-center">
                      <span className={`block truncate text-xs font-bold uppercase ${isSelected ? 'text-emerald-500' : ''}`}>
                        {displayLabel}
                      </span>
                      {isSelected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-500">
                          <Check size={16} />
                        </span>
                      )}
                    </div>
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}