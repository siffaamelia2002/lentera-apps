// components/aktivasi/AktivasiClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

// Import Hooks & Components
import { useCheckIdentity, useSubmitActivation } from "@/hooks/useAktivasi";
import StepOneForm from "@/components/aktivasi/StepOneForm";
import StepTwoForm from "@/components/aktivasi/StepTwoForm";

export default function AktivasiClient() {
  const [step, setStep] = useState(1);
  const [targetUser, setTargetUser] = useState({ id: "", name: "", role: "" });
  const [formData, setFormData] = useState({
    identity_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // Init Hooks
  const checkIdentity = useCheckIdentity((data) => {
    setTargetUser(data);
    setStep(2);
  });

  const submitActivation = useSubmitActivation(targetUser.name);

  // Handler Submit Step 2
  const handleFinalSubmit = () => {
    submitActivation.mutate({
      user_id: targetUser.id,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-6">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[450px] z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <ShieldCheck className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Aktivasi Akun</h2>
            <p className="text-slate-400 text-sm mt-1">
              {step === 1
                ? "Verifikasi NIP/NISN Anda"
                : `Lengkapi data untuk ${targetUser.name}`}
            </p>
          </div>

          {step === 1 ? (
            <StepOneForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={(id: string) => checkIdentity.mutate(id)}
              isPending={checkIdentity.isPending}
            />
          ) : (
            <StepTwoForm
              targetUser={targetUser}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFinalSubmit}
              isPending={submitActivation.isPending}
              onBack={() => setStep(1)}
            />
          )}

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link
              href="/login"
              className="text-sm text-slate-500 hover:text-emerald-400 flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} /> Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}