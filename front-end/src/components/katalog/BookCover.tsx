// components/BookDetailModal/BookCover.tsx
import { useState } from "react";
import { ImageOff } from "lucide-react";

interface BookCoverProps {
  cover: string | null;
  title: string;
}

export default function BookCover({ cover, title }: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      {cover && !imageError ? (
        <img 
          src={cover} 
          alt={title} 
          onError={() => setImageError(true)} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-800">
          <ImageOff size={64} />
        </div>
      )}
    </div>
  );
}