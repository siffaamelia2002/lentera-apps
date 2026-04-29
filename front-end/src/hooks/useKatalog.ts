import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api-client";

export interface Buku {
  id: number;
  judul: string;
  cover: string | null;
  stok: number;
  harga: number | string | null;
  penulis_nama?: string;
  penulis?: { nama_penulis: string } | string;
  kategori?: { nama_kategori: string };
  penerbit?: { nama_penerbit: string } | string;
  penerbit_nama?: string;
  tahun_terbit: any;
  deskripsi: any;
}

export function useKatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`🛠️ [RENDER #${renderCount.current}] useKatalog`);

  const ITEMS_PER_PAGE = 12;

  // 🔥 FETCH BUKU (FIX: NO placeholderData)
  const {
    data: bukuData = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["katalog-buku"],
    queryFn: async () => {
      console.log("📡 [FETCH] buku...");
      try {
        const res = await api.get("buku");
        const raw = res.data?.data ?? res.data ?? [];
        console.log(`✅ Got ${raw.length} books`);
        return Array.isArray(raw) ? raw : [];
      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🔥 FETCH KATEGORI
  const { data: kategoriData = [] } = useQuery({
    queryKey: ["kategori-list"],
    queryFn: async () => {
      const res = await api.get("kategori");
      return res.data?.data ?? res.data ?? [];
    },
    staleTime: 1000 * 60 * 60,
  });

  // 🔥 RESET PAGE kalau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // 🔥 FILTER (FIX: STABIL + CEPAT)
  const filteredBooks = useMemo(() => {
    if (!bukuData.length) return [];

    console.log("🔍 FILTER:", selectedCategory);

    const searchLower = searchTerm.toLowerCase();

    return bukuData.filter((book: Buku) => {
      const judul = (book.judul || "").toLowerCase();

      const namaPenulis =
        typeof book.penulis === "object"
          ? book.penulis?.nama_penulis || ""
          : book.penulis || book.penulis_nama || "";

      const matchesSearch =
        judul.includes(searchLower) ||
        namaPenulis.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === "Semua" ||
        book.kategori?.nama_kategori === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [bukuData, searchTerm, selectedCategory]);

  // 🔥 PAGINATION
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  }, [filteredBooks]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  return {
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
  };
}