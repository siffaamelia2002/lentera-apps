// hooks/useAktivasi.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/libs/api-client";

export const useCheckIdentity = (onSuccessCallback: (data: any) => void) => {
  return useMutation({
    mutationFn: async (idNumber: string) => {
      // 🔥 FIX: Sesuaikan endpoint dengan api.php
      const res = await api.post("/activation/check", {
        identity_number: idNumber,
      });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(`Identitas ditemukan: ${res.data.name}`);
      onSuccessCallback(res.data);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Identitas tidak terdaftar.";
      toast.error(msg);
    },
  });
};

export const useSubmitActivation = (targetUserName: string) => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      // 🔥 FIX: Sesuaikan endpoint ke /send-email untuk kirim link verifikasi
      const res = await api.post("/activation/send-email", payload);
      return res.data;
    },
    onSuccess: (res) => {
      // NotifyHandler akan menangkap ini setelah redirect, 
      // tapi kita munculkan toast lokal dulu biar mantap.
      const successMsg = res.message || `Link verifikasi berhasil dikirim ke email.`;
      
      // Lempar ke login dengan params agar ditangkap NotifyHandler
      router.replace(`/login?status=success&title=Cek Email Kamu&msg=${encodeURIComponent(successMsg)}`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Gagal mengirim link aktivasi.";
      toast.error(msg);
    },
  });
};