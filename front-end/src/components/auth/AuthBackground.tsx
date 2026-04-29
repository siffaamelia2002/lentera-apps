// components/auth/AuthBackground.tsx
export default function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Mengubah warna grid dot menjadi indigo-900 (slate/indigo mix) */}
      <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      
      {/* Floating Abstract Glows - Diperbarui ke skema warna Indigo/Blue */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] rounded-full bg-indigo-900 blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600 blur-[120px] opacity-15 pointer-events-none" />
      
      {/* Aesthetic Framing Lines - Menggunakan gradient indigo yang lebih halus */}
      <div className="hidden md:block absolute top-1/2 left-10 w-[1px] h-40 bg-gradient-to-b from-transparent via-indigo-700/30 to-transparent" />
      <div className="hidden md:block absolute bottom-1/2 right-10 w-[1px] h-40 bg-gradient-to-t from-transparent via-indigo-700/30 to-transparent" />
    </div>
  );
}