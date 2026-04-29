"use client";
import { Star, ArrowUpRight } from "lucide-react";

export default function FavoriteBooks({ books }: { books: any[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white tracking-tight uppercase">
          Koleksi <span className="text-indigo-500">Favorit</span>
        </h3>
        <button className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">
          Lihat Katalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="group relative p-6 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-sm border border-slate-900 hover:border-indigo-500/40 transition-all duration-500 shadow-xl hover:shadow-indigo-500/5 overflow-hidden"
          >
            {/* Dekorasi Aksen Cahaya */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-indigo-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Star size={18} fill="currentColor" />
                </div>
                <div className="p-2 rounded-lg bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight 
                    size={20} 
                    className="text-indigo-400 cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1.5px] w-3 bg-indigo-500 rounded-full"></span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                  {book.category}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors leading-snug">
                {book.title}
              </h4>
              
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">
                {book.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}