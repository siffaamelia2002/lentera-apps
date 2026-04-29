"use client";

import React, { useMemo } from "react";
import BookCard from "@/components/katalog/BookCard";
import BookFilters from "@/components/katalog/BookFilters";
import KatalogHeader from "@/components/katalog/KatalogHeader";
import KatalogSkeleton from "@/components/katalog/KatalogSkeleton";
import KatalogEmpty from "@/components/katalog/KatalogEmpty";
import KatalogPagination from "@/components/katalog/KatalogPagination";
import { useKatalog, Buku } from "@/hooks/useKatalog";

export default function KatalogClient() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    isLoading,
    isFetching,
    kategoriData,
    filteredBooks,
    paginatedBooks,
    totalPages,
  } = useKatalog();

  /**
   * 🔥 FIX UTAMA: Memoize Book List
   * Ini mencegah 8x render ulang kartu buku saat Zustand melakukan hidrasi.
   * Kartu buku hanya akan di-render ulang jika data 'paginatedBooks' benar-benar berubah.
   */
  const memoizedBookGrid = useMemo(() => {
    if (paginatedBooks.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedBooks.map((item: Buku) => (
          <BookCard
            key={item.id}
            book={{
              id: item.id,
              title: item.judul,
              author: item.penulis_nama || (typeof item.penulis === "object" ? item.penulis?.nama_penulis : item.penulis) || "Anonim",
              penerbit: item.penerbit_nama || (typeof item.penerbit === "object" ? item.penerbit?.nama_penerbit : item.penerbit) || "N/A",
              stok: item.stok,
              harga: item.harga,
              cover: item.cover,
              category: item.kategori?.nama_kategori || "Umum",
              deskripsi: item.deskripsi,
              tahun_terbit: item.tahun_terbit || "N/A",
            }}
          />
        ))}
      </div>
    );
  }, [paginatedBooks]);

  return (
    <div className="p-6 lg:p-10 space-y-10 min-h-screen text-white selection:bg-emerald-500/30">
      
      <KatalogHeader
        isLoading={isLoading}
        isFetching={isFetching}
        totalBooks={filteredBooks.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <BookFilters
        categories={kategoriData}
        activeCategory={selectedCategory}
        onFilterChange={(cat) => setSelectedCategory(cat)}
        isLoading={isLoading && kategoriData.length === 0} 
      />

      {/* Gunakan pengecekan data mentah agar tidak kembali ke Skeleton saat filtering */}
      {isLoading && filteredBooks.length === 0 ? (
        <KatalogSkeleton />
      ) : (
        <div className={`space-y-10 transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}>
          {filteredBooks.length > 0 ? (
            <>
              {memoizedBookGrid}
              
              <KatalogPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          ) : (
            <KatalogEmpty />
          )}
        </div>
      )}
    </div>
  );
}