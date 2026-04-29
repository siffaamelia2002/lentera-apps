const BASE_URL = "http://localhost:8000";

// 🔥 helper ambil cookie
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
};

// 🔥 ambil CSRF cookie
export const getCsrf = async () => {
  const res = await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });

  console.log("CSRF STATUS:", res.status);
};

// 🔥 LOGIN (🔥 SUDAH FIX TOTAL)
export const login = async (data: {
  email: string;
  password: string;
  remember?: boolean;
}) => {
  // 1️⃣ ambil CSRF cookie
  await getCsrf();

  // 2️⃣ ambil token dari cookie
  const xsrfToken = getCookie("XSRF-TOKEN");

  console.log("XSRF TOKEN:", xsrfToken);

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": xsrfToken || "", // 🔥 INI KUNCI FIX 419
    },
    body: JSON.stringify(data),
  });

  console.log("LOGIN STATUS:", res.status);

  const result = await res.json();
  console.log("LOGIN RESPONSE:", result);

  if (!res.ok) throw result;

  return result;
};

// 🔥 GET USER
export const getUser = async () => {
  const res = await fetch(`${BASE_URL}/api/user`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  console.log("USER STATUS:", res.status);

  if (!res.ok) throw new Error("Gagal ambil user");

  return res.json();
};

// 🔥 LOGOUT (tambahin CSRF juga biar aman)
export const logout = async () => {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": xsrfToken || "",
    },
  });

  console.log("LOGOUT STATUS:", res.status);
};