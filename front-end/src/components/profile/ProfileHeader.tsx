"use client";

import { useRef } from "react";
import { Camera, Mail, ShieldCheck, Calendar } from "lucide-react";

export default function ProfileHeader({ user, previewImage, onImageChange }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeUser = user ?? {};

  const joinedDate = safeUser?.created_at
    ? new Date(safeUser.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      })
    : "";

  const imageSrc =
    previewImage ||
    safeUser?.profile_picture ||
    "/default-avatar.png";

  return (
    <div className="relative overflow-hidden bg-slate-900/30 border border-slate-900 rounded-[3rem] p-8 lg:p-12 shadow-2xl backdrop-blur-sm">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        
        {/* Avatar Container */}
        <div className="relative group">
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-slate-950 rounded-[2.2rem] border border-slate-800 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-indigo-500/50">
            <img
              src={imageSrc}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Indigo Camera Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
          >
            <Camera size={18} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* User Info Section */}
        <div className="text-center md:text-left space-y-3 w-full">
          
          <div className="flex flex-col md:flex-row md:items-center gap-3 min-h-[48px]">
            <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter italic">
              {safeUser?.name || " "}
            </h2>

            {/* Indigo Role Badge */}
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest mx-auto md:mx-0 min-h-[24px] shadow-inner">
              <ShieldCheck size={12} />
              {safeUser?.peran || " "}
            </span>
          </div>

          <div className="flex flex-col gap-2 min-h-[48px]">
            {/* Email Info */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 min-h-[20px]">
              <Mail size={16} className="text-indigo-500/50" />
              <span className="text-sm font-medium">
                {safeUser?.email || " "}
              </span>
            </div>

            {/* Joining Date Info */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] min-h-[20px]">
              <Calendar size={12} />
              Bergabung:
              <span className="text-indigo-500">
                {joinedDate || " "}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}