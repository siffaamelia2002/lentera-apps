import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api-client";
import { useUserStore } from "@/store/useUserStore";

export const useAuthUser = () => {
  const { setUser } = useUserStore();

  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      console.log("🔥 FETCH USER JALAN");

      const res = await api.get("/api/user");

      console.log("✅ RESPONSE USER:", res.data);

      const data = res.data.data || res.data;

      console.log("🔥 DATA FINAL:", data);

      // 🔥 FIX UTAMA (WAJIB ADA ID)
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        peran: data.peran,
      });

      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};