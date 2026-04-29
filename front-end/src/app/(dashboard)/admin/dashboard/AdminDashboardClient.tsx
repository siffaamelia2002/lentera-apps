"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api-client";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardChart from "@/components/dashboard/DashboardChart";
import FavoriteBooks from "@/components/dashboard/FavoriteBooks";

// Tipe data berdasarkan response dari backend Laravel
interface DashboardData {
  stats: { label: string; value: string | number; type: string }[];
  chart: { name: string; total: number }[];
  favoriteBooks: { id: number; title: string; author: string; category: string; rating: number }[];
  activities: { user: string; action: string; book: string; time: string }[];
}

// Komponen Skeleton dengan tema Indigo untuk LENTERA
const DashboardSkeleton = () => {
  return (
    <div className="p-6 lg:p-10 space-y-12 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-indigo-500/20 rounded-md"></div>
          <div className="h-4 w-40 bg-indigo-500/10 rounded-md"></div>
        </div>
        <div className="h-12 w-12 bg-indigo-500/20 rounded-full"></div>
      </div>
      
      <div className="space-y-12">
        {/* Skeleton Stats (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-indigo-500/10 rounded-xl border border-indigo-500/5"></div>
          ))}
        </div>

        {/* Skeleton Chart & Favorite Books */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-indigo-500/10 rounded-xl border border-indigo-500/5"></div>
          <div className="h-96 bg-indigo-500/10 rounded-xl border border-indigo-500/5"></div>
        </div>

        {/* Skeleton Recent Activity */}
        <div className="h-72 bg-indigo-500/10 rounded-xl border border-indigo-500/5"></div>
      </div>
    </div>
  );
};

export default function AdminDashboardClient() {
  // Fetching menggunakan TanStack Query - Endpoint disesuaikan (tanpa prefix api)
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["adminDashboardData"],
    queryFn: async () => {
      // Mengikuti instruksi: hilangkan prefix 'api' untuk pathing yang lebih bersih
      const response = await api.get('/admindashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-6 lg:p-10">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold">Gagal memuat data panel kendali LENTERA.</p>
            <p className="text-sm mt-1 opacity-90">
              Pastikan sesi login masih aktif dan token tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-12 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header Dashboard LENTERA */}
      <DashboardHeader name="Admin Utama" role="Administrator" />
      
      <div className="space-y-12">
        <DashboardStats stats={data.stats} />
        <DashboardChart data={data.chart} />
        <FavoriteBooks books={data.favoriteBooks} />
        <RecentActivity activities={data.activities} />
      </div>
    </div>
  );
}