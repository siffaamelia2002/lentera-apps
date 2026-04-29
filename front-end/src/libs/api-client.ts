import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  // 🔥 PERBAIKAN: Tambahkan /api di akhir URL jika menggunakan Laravel api.php
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api",
  withCredentials: true, 
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ================================
// 🔥 HELPER AMBIL COOKIE
// ================================
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );

  return match ? decodeURIComponent(match[2]) : null;
};

// ================================
// 🔥 AUTO CSRF INTERCEPTOR
// ================================
api.interceptors.request.use((config) => {
  const token = getCookie("XSRF-TOKEN");

  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }

  return config;
});

// ================================
// 🔥 GET CSRF COOKIE
// ================================
export const getCsrf = async () => {
  console.log("🔐 FETCH CSRF COOKIE...");
  // Karena baseURL sudah ada /api, kita harus keluar sebentar ke root untuk sanctum
  // Sanctum biasanya ada di http://localhost:8000/sanctum/csrf-cookie (tanpa /api)
  return await axios.get(
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/sanctum/csrf-cookie",
    { withCredentials: true }
  );
};

export default api;