"use client";

import { useState } from "react";
import { ShoppingBasket, ImageOff } from "lucide-react";
import BookDetailModal from "./BookDetailModal";

interface DetailBook {
  id: number;
  title: string;
  author: string;
  penerbit: string;
  stok: number;
  harga: number | string | null;
  cover: string | null;
  category: string;
  deskripsi: string | null;
  tahun_terbit: number | string;
}

export default function BookCard({ book }: { book: DetailBook }) {
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!book) return null;

  return (
    <>
      <div className="group relative bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
        <div className="aspect-[3/4] overflow-hidden relative">
          {book.cover && !imageError ? (
            <img
              src={book.cover}
              alt={book.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center gap-3">
              <ImageOff size={40} className="text-slate-800" />
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">No Cover</span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
              {book.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-slate-100 font-black text-lg leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter">
            {book.title}
          </h3>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide mt-1">{book.author}</p>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-0.5">Inventaris</span>
              <span className={`text-xs font-black uppercase tracking-tighter ${book.stok > 0 ? 'text-indigo-500' : 'text-rose-500'}`}>
                {book.stok > 0 ? `${book.stok} Tersedia` : 'Stok Habis'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all active:scale-90 shadow-lg shadow-indigo-900/40"
            >
              <ShoppingBasket size={18} />
            </button>
          </div>
        </div>
      </div>

      <BookDetailModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        book={book} 
      />
    </>
  );
}