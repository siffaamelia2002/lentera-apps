import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import api, { getCsrf } from "@/libs/api-client"; 
import { useNotify } from "@/hooks/use-notify";

interface ProfileData {
  name: string;
  no_hp?: string;
  alamat?: string;
}

export const useUserProfile = () => {
  const { user, setUser } = useUserStore();
  const notify = useNotify(); 
  
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify.error("File Terlalu Besar", "Maksimal ukuran foto adalah 2MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (formDataState: ProfileData) => {
    if (!user?.id) {
      notify.error("Error", "User tidak valid. Silakan login ulang.");
      return;
    }

    setLoading(true);

    try {
      await getCsrf();

      const formData = new FormData();
      formData.append("name", formDataState.name);
      formData.append("no_hp", formDataState.no_hp || "");
      formData.append("alamat", formDataState.alamat || "");
      formData.append("_method", "PUT"); 

      if (selectedFile) {
        formData.append("foto", selectedFile);
      }

      const response = await api.post(`/api/users/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Ambil data terbaru dari response backend
      const updatedUser = response.data.data || response.data;

      // 🔥 FIX: Gabungkan data lama dengan data baru agar field lain tidak hilang
      // Ini alasan kenapa data kamu kereset sebelumnya (karena no_hp & alamat tidak di-set)
      setUser({
        ...user,         // Data lama (email, peran, dll)
        ...updatedUser,  // Data baru (name, no_hp, alamat, foto)
      });

      notify.success("Profil Diperbarui", "Perubahan kamu berhasil disimpan.");
      setSelectedFile(null);
      return updatedUser;

    } catch (error: any) {
      console.error("❌ ERROR UPDATE:", error);
      const msg = error.response?.data?.message || "Gagal update profil.";
      notify.error("Update Gagal", msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, previewImage, handleImageChange, updateProfile };
};