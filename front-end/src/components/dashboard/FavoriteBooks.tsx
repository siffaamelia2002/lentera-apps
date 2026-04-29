"use client";
import { Star, ArrowUpRight } from "lucide-react";

export default function FavoriteBooks({ books }: { books: any[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white tracking-tight uppercase">
          Koleksi <span className="text-emerald-500">Favorit</span>
        </h3>
        <button className="text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">
          Lihat Katalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="group relative p-6 rounded-[2rem] bg-slate-900/40 border border-slate-900 hover:border-emerald-500/50 transition-all duration-500"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-500">
                  <Star size={18} fill="currentColor" />
                </div>
                <ArrowUpRight 
                  size={20} 
                  className="text-slate-600 group-hover:text-white transition-colors cursor-pointer" 
                />
              </div>
              
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                {book.category}
              </span>
              
              <h4 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                {book.title}
              </h4>
              
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                {book.author}
              </p>
              
              {/* Bagian Rating sudah dihapus sepenuhnya */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}