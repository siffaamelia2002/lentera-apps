// components/aktivasi/StepOneForm.tsx
"use client";

import { Fingerprint, ArrowRight } from "lucide-react";

export default function StepOneForm({ formData, setFormData, onSubmit, isPending }: any) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData.identity_number);
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 ml-1 uppercase">
          Nomor Identitas (NIP/NISN)
        </label>
        <div className="relative">
          <Fingerprint
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
            placeholder="Masukkan NIP atau NISN"
            value={formData.identity_number}
            onChange={(e) =>
              setFormData({ ...formData, identity_number: e.target.value })
            }
          />
        </div>
      </div>
      <button
        disabled={isPending}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isPending ? "Mengecek..." : "Cek Data"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}