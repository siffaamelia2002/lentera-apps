"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  // Kita pake useState supaya QueryClient cuma dibuat sekali (singleton)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Data dianggap segar selama 1 menit
        retry: 1, // Gagal sekali, coba lagi sekali
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}