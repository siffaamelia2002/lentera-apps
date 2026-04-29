"use client";

import { useState, useEffect, useCallback } from "react";
import { format, differenceInDays, startOfDay } from "date-fns";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import api from "@/libs/api-client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

// Komponen Import
import ConfirmModal from "@/components/keranjang/ConfirmModal";
import CartItem from "@/components/keranjang/CartItem";
import CartSummary from "@/components/keranjang/CartSummary";

export default function KeranjangClient() {
  const router = useRouter();
  const { user, setCartCount } = useUserStore();
  
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showConfirmAjukan, setShowConfirmAjukan] = useState(false);
  
  const [tglPinjam, setTglPinjam] = useState<Date>(new Date());
  const [tglKembali, setTglKembali] = useState<Date | undefined>(undefined);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("cart-items");
      const data = res.data.data || res.data;
      setCartItems(data);
      setCartCount(data.length || 0);
    } catch (err) {
      toast.error("Gagal sinkronisasi reservasi LENTERA");
    } finally {
      setLoadingData(false);
    }
  }, [setCartCount]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const pinjamBase = startOfDay(tglPinjam);
  const kembaliBase = tglKembali ? startOfDay(tglKembali) : undefined;
  const durasi = kembaliBase ? differenceInDays(kembaliBase, pinjamBase) : 0;
  
  const isTooLong = durasi > 7;
  const canSubmit = selectedIds.length > 0 && tglKembali && durasi >= 0 && !isTooLong;

  const selectedBooks = cartItems.filter(item => selectedIds.includes(item.id));
  const totalQty = selectedBooks.reduce((acc, curr) => acc + curr.qty, 0);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const updateQty = async (id: number, val: number, stok: number) => {
    let newQty = val;
    if (newQty > stok) { toast.error(`Stok maksimal inventaris: ${stok}`); newQty = stok; }
    if (newQty < 1 || isNaN(newQty)) { newQty = 1; }

    try {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
      await api.put(`cart-items/${id}`, { qty: newQty });
    } catch (err) {
      fetchCart();
    }
  };

  const handleRemove = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`cart-items/${deleteTarget}`);
      toast.success("Item reservasi dihapus");
      setDeleteTarget(null);
      fetchCart();
    } catch (err) {
      toast.error("Gagal menghapus item");
    }
  };

  const handleAjukanFinal = async () => {
    if (!user?.id) return toast.error("Silahkan login kembali");
    
    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        tanggal_pinjam: format(tglPinjam, "yyyy-MM-dd"),
        tanggal_kembali_seharusnya: format(tglKembali!, "yyyy-MM-dd"),
        items: selectedBooks.map(item => ({
          buku_id: item.buku_id,
          qty: item.qty
        }))
      };

      const response = await api.post("peminjaman", payload);
      const kodePmj = response.data.data?.kode_peminjaman || "";

      toast.success(`Reservasi ${kodePmj} LENTERA berhasil dikirim!`);
      
      setSelectedIds([]);
      setCartCount(cartItems.length - selectedIds.length);
      setShowConfirmAjukan(false);
      router.push("/peminjaman");
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengirim reservasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10 animate-pulse">
        <header className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-32 bg-slate-800 rounded-full"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <div className="xl:col-span-7 space-y-4">
            <div className="h-3 w-32 bg-slate-800 rounded-full mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-5 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <div className="w-6 h-6 bg-slate-800 rounded-md mt-4"></div>
                <div className="w-24 h-32 bg-slate-800 rounded-xl"></div>
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-5 w-3/4 bg-slate-800 rounded-md"></div>
                  <div className="h-4 w-1/2 bg-slate-800 rounded-md"></div>
                  <div className="pt-4 flex justify-between items-center">
                    <div className="h-10 w-28 bg-slate-800 rounded-xl"></div>
                    <div className="h-6 w-8 bg-slate-800 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="xl:col-span-5">
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6 lg:p-8 space-y-6">
              <div className="h-6 w-40 bg-slate-800 rounded-md"></div>
              <div className="h-72 w-full bg-slate-800 rounded-3xl"></div>
              <div className="space-y-4 mt-8">
                <div className="h-4 w-full bg-slate-800 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-800 rounded-md"></div>
              </div>
              <div className="h-16 w-full bg-slate-800 rounded-2xl mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
      <ConfirmModal 
        isOpen={deleteTarget !== null} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleRemove} 
        variant="danger" 
        title="Hapus Reservasi?" 
        description="Buku akan dihapus dari rencana reservasi arsip." 
        confirmText="Ya, Hapus" 
      />
      
      <ConfirmModal 
        isOpen={showConfirmAjukan} 
        onClose={() => setShowConfirmAjukan(false)} 
        onConfirm={handleAjukanFinal} 
        isLoading={isSubmitting} 
        title="Proses Reservasi?" 
        description={`Ajukan reservasi ${totalQty} buku untuk ${durasi} hari?`} 
        confirmText="Proses Sekarang" 
      />

      <header className="flex items-center gap-5">
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-500 shadow-xl shadow-indigo-500/10">
          <ShoppingBag size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
            Checkout <span className="text-indigo-500">LENTERA</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Navigasi Transaksi & Reservasi Arsip</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-7 space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Buku terpilih ({selectedIds.length})</h3>
          
          {cartItems.length > 0 ? cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              isSelected={selectedIds.includes(item.id)} 
              onToggle={toggleSelect} 
              onUpdateQty={updateQty} 
              onRemove={setDeleteTarget} 
            />
          )) : (
            <div className="text-center py-24 border-2 border-dashed border-slate-900 rounded-[3.5rem]">
              <p className="text-slate-700 font-black uppercase text-xs tracking-[0.3em] italic">Belum ada reservasi</p>
            </div>
          )}
        </div>

        <div className="xl:col-span-5">
          <CartSummary 
            selectedBooks={selectedBooks}
            tglPinjam={tglPinjam}
            tglKembali={tglKembali}
            setTglKembali={setTglKembali}
            durasi={durasi}
            isTooLong={isTooLong}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            onShowConfirm={() => setShowConfirmAjukan(true)}
          />
        </div>
      </div>

      <style jsx global>{`
        .rdp { --rdp-accent-color: #6366f1; --rdp-background-color: #1e1b4b; margin: 0; }
        .rdp-day_selected { background-color: var(--rdp-accent-color) !important; font-weight: bold; border-radius: 12px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #312e81; border-radius: 10px; }
      `}</style>
    </div>
  );
}