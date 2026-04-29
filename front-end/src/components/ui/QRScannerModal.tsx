"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { X, Upload, ScanLine, Camera } from "lucide-react";

export default function QRScannerModal({ 
  isOpen, 
  onClose, 
  onScanSuccess 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onScanSuccess: (code: string) => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    const codeReader = new BrowserMultiFormatReader();
    setLoading(true);

    codeReader.decodeFromVideoDevice(null, videoRef.current!, (result) => {
      if (result) {
        onScanSuccess(result.getText());
        codeReader.reset();
        onClose();
      }
    });

    setLoading(false);
    return () => {
      codeReader.reset();
    };
  }, [isOpen, onScanSuccess, onClose]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const codeReader = new BrowserMultiFormatReader();
      const url = URL.createObjectURL(file);
      try {
        const result = await codeReader.decodeFromImageUrl(url);
        onScanSuccess(result.getText());
        onClose();
      } catch (err) {
        alert("QR Code tidak terbaca.");
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-between py-12 px-6">
      
      {/* TOMBOL CLOSE FIX - Pojok Kanan Atas Layar */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[100000] p-3 bg-white/10 hover:bg-red-500 text-white rounded-full backdrop-blur-md border border-white/20 transition-all active:scale-90"
      >
        <X size={30} />
      </button>

      {/* Header */}
      <div className="text-center space-y-3 z-10">
        <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40">
          <ScanLine size={32} className="text-emerald-500 animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Scan QR Code</h2>
        <p className="text-slate-400 text-xs font-medium">Arahkan kamera tepat ke kode QR</p>
      </div>

      {/* Area Scan Full (Tanpa Card) */}
      <div className="relative w-full max-w-[320px] aspect-square overflow-hidden rounded-[3rem] border-4 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-500 bg-slate-900 z-10">
            <Camera className="animate-bounce mb-3" size={32} />
            <span className="text-[10px] font-bold tracking-widest">INITIALIZING...</span>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover scale-110" 
        />
        
        {/* Laser Line Animation */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="w-full h-[4px] bg-emerald-400 shadow-[0_0_20px_#34d399] animate-[scan_2s_linear_infinite]" />
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-5 left-5 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-lg" />
        <div className="absolute top-5 right-5 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-lg" />
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-lg" />
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-lg" />
      </div>

      {/* Footer Actions */}
      <div className="w-full max-w-xs space-y-4 z-10">
        <label className="flex items-center justify-center gap-4 w-full bg-white text-black py-4 rounded-2xl cursor-pointer transition-all active:scale-95 font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white shadow-xl">
          <Upload size={20} />
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
        
        <button 
          onClick={onClose}
          className="w-full py-2 text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.3em] transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}