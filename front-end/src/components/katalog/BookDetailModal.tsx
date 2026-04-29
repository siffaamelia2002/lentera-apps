// components/BookDetailModal/index.tsx
"use client";

import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { toast } from "sonner";
// 🔥 Gunakan helper getCsrf agar tidak 404
import api, { getCsrf } from "@/libs/api-client";
import { useUserStore } from "@/store/useUserStore";

// Import Components & Types
import { Book } from "@/types/katalog-modal";
import BookCover from "./BookCover";
import QuantityPicker from "./QuantityPicker";
import BookInfo from "./BookInfo";
import SubmitButton from "./SubmitButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export default function BookDetailModal({ isOpen, onClose, book }: ModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateCartCount } = useUserStore();

  // Reset quantity hanya saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  const confirmPinjam = async () => {
    if (isSubmitting || quantity <= 0) return;
    
    setIsSubmitting(true);
    // Simpan quantity ke variabel lokal untuk pesan toast
    const jumlahDipilih = quantity; 

    try {
      // 🔥 Panggil fungsi CSRF dari libs (Fix 404)
      await getCsrf();

      const res = await api.post("cart-items", {
        buku_id: book.id,
        jumlah: jumlahDipilih,
      });

      if (res.data.status === "success") {
        // 🔥 Pesan sukses lengkap dengan qty
        toast.success(`Berhasil menambahkan ${jumlahDipilih}x "${book.title}" ke keranjang`);
        
        // Update counter di navbar/store
        if (updateCartCount) await updateCartCount(jumlahDipilih);
        
        onClose();
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error(error.response?.data?.message || "Gagal masuk keranjang");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop dengan Blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-[2.5rem] bg-[#0B1120] border border-slate-800 p-8 md:p-10 shadow-2xl transition-all relative text-left">
                
                {/* Tombol Close */}
                <button 
                  onClick={onClose} 
                  className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 z-20 bg-slate-900/50 rounded-full border border-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                  
                  {/* KOLOM KIRI: Cover & Qty Desktop */}
                  <div className="md:col-span-5 flex flex-col gap-6">
                    <BookCover cover={book.cover} title={book.title} />
                    
                    <div className="hidden md:block">
                      <QuantityPicker 
                        quantity={quantity} 
                        setQuantity={setQuantity} 
                        stok={book.stok} 
                        isSubmitting={isSubmitting} 
                      />
                    </div>
                  </div>

                  {/* KOLOM KANAN: Info & Actions */}
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <BookInfo book={book} />
                    
                    <div className="mt-8 flex flex-col gap-6">
                      {/* Qty Mobile */}
                      <div className="block md:hidden">
                        <QuantityPicker 
                          quantity={quantity} 
                          setQuantity={setQuantity} 
                          stok={book.stok} 
                          isSubmitting={isSubmitting} 
                        />
                      </div>

                      <SubmitButton 
                        onConfirm={confirmPinjam} 
                        isSubmitting={isSubmitting} 
                        stok={book.stok} 
                        quantity={quantity} 
                      />
                    </div>
                  </div>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}