import { cookies } from "next/headers";

let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function fetchServer(endpoint: string, options?: RequestInit) {
  const cleanBaseUrl = API_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;

  try {
    let cookieString = "";
    try {
      const cookieStore = await cookies();
      cookieString = cookieStore.toString();
    } catch (e) {
      // Mode Build-time atau ISR (Incremental Static Regeneration)
      cookieString = "";
    }

    console.log(`📡 [SERVER FETCH] Calling: ${fullUrl}`);

    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest", // Mencegah Laravel Redirect 302
        "Cookie": cookieString,
        "Referer": FRONTEND_URL,
        "Origin": FRONTEND_URL,
        ...options?.headers,
      },
      // Cache dikontrol oleh Next.js, default 'no-store' untuk data dinamis
      cache: options?.cache || "no-store",
    });

    // Handle session expired / Unauthorized
    if (res.status === 401) {
      console.warn(`[AUTH] 401 Unauthorized at ${fullUrl}`);
      return null;
    }

    // Handle Forbidden (CSRF 419 juga masuk sini di level server jika cookie mismatch)
    if (res.status === 419 || res.status === 403) {
      console.error(`[AUTH] ${res.status} Forbidden/Expired at ${fullUrl}`);
      return null;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`[API ERROR] ${res.status}:`, errorData);
      return null;
    }

    const json = await res.json();
    
    // Return data property jika ada (standard Laravel resource), jika tidak return root json
    return json?.data ?? json ?? null;

  } catch (error: any) {
    console.error(`[FETCH SYSTEM ERROR]: ${error.message}`);
    return null;
  }
}