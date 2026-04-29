"use client";

import { useMemo, useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { QrCode, AlertTriangle, Check, X, ShieldCheck, History, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import UserTable from "@/components/admin/UserTable";
import api, { getCsrf } from "@/libs/api-client";
import QRScannerModal from "@/components/ui/QRScannerModal";

export default function PeminjamanClient({ initialData }: any) {
  const queryClient = useQueryClient();
  const endpoint = "peminjaman";

  // --- STATE ---
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [returnModalData, setReturnModalData] = useState<any>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  
  const [selectedDendaIds, setSelectedDendaIds] = useState<string[]>([]);
  const [kondisiBuku, setKondisiBuku] = useState<"baik" | "rusak" | "hilang">("baik");

  const [confirmApprove, setConfirmApprove] = useState<{ isOpen: boolean; id: string | number | null }>({ isOpen: false, id: null });
  const [confirmHandover, setConfirmHandover] = useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; id: string | number | null }>({ isOpen: false, id: null });
  const [catatanTolak, setCatatanTolak] = useState("");

  // --- FETCH KATEGORI DENDA ---
  const { data: kategoriDendaList = [] } = useQuery({
    queryKey: ["kategori-denda"],
    queryFn: async () => {
      // Pathing tanpa prefix 'api' sesuai standarisasi LENTERA
      const res = await api.get("kategori-denda");
      return res.data;
    },
  });

  // --- FETCH DATA SIRKULASI ---
  const { data = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data?.data ?? res.data ?? [];
    },
    initialData,
  });

  const renderNominal = (kat: any) => {
    const nilai = kat?.nominal_denda || kat?.nominal || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(nilai);
  };

  // Auto-select denda jika statusnya terlambat
  useEffect(() => {
    if (returnModalData?.status === 'terlambat' && showReturnForm) {
      const dendaTelat = kategoriDendaList.find((k: any) => 
        k?.nama_pelanggaran?.toLowerCase().includes('lambat') || k?.nama_pelanggaran?.toLowerCase().includes('telat')
      );
      if (dendaTelat && !selectedDendaIds.includes(dendaTelat.id.toString())) {
        setSelectedDendaIds(prev => [...prev, dendaTelat.id.toString()]);
      }
    }
  }, [returnModalData, showReturnForm, kategoriDendaList, selectedDendaIds]);

  const closeReturnModal = () => {
    setReturnModalData(null);
    setShowReturnForm(false);
    setSelectedDendaIds([]);
    setKondisiBuku("baik");
  };

  const handleUpdateStatus = async (id: number | string, newStatus: string, extraPayload?: any) => {
    const promise = async () => {
      await getCsrf();
      const payload = { status: newStatus, ...extraPayload };
      // Endpoint sirkulasi mengikuti struktur LENTERA (tanpa api prefix)
      const res = await api.put(`${endpoint}/${id}/status`, payload);
      
      if (!res.data?.success) throw new Error(res.data?.message || "Gagal update");
      
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      closeReturnModal();
      setRejectModal({ isOpen: false, id: null });
      setConfirmApprove({ isOpen: false, id: null });
      setConfirmHandover({ isOpen: false, data: null });
      return res.data;
    };

    toast.promise(promise(), {
      loading: 'Memproses sirkulasi LENTERA...',
      success: (res) => res.message || `Berhasil diperbarui`,
      error: (err) => err.message || "Terjadi kesalahan",
    });
  };

  const handleQRScanSuccess = (scannedCode: string) => {
    setIsScannerOpen(false);
    const tableData = Array.isArray(data) ? data : [];
    const item = tableData.find((t: any) => t?.kode_peminjaman === scannedCode);
    
    if (!item) {
      toast.error(`Kode ${scannedCode} tidak ditemukan!`);
      return;
    }

    if (item.status === 'pending') {
      setConfirmApprove({ isOpen: true, id: item.id });
    } else if (item.status === 'disetujui') {
      setConfirmHandover({ isOpen: true, data: item });
    } else if (item.status === 'dipinjam' || item.status === 'terlambat') {
      setReturnModalData(item);
      setShowReturnForm(false); 
    } else {
      toast.info(`Buku ${scannedCode} sudah dalam status ${item.status}.`);
    }
  };

  const renderCustomActions = (item: any) => {
    if (!item) return null;
    return (
      <div className="flex items-center gap-2">
        {item.status === 'pending' && (
          <>
            <button onClick={() => setConfirmApprove({ isOpen: true, id: item.id })} className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <Check size={16} strokeWidth={3} />
            </button>
            <button onClick={() => setRejectModal({ isOpen: true, id: item.id })} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
              <X size={16} strokeWidth={3} />
            </button>
          </>
        )}
        {item.status === 'disetujui' && (
          <button onClick={() => setConfirmHandover({ isOpen: true, data: item })} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
            <ShieldCheck size={16} />
          </button>
        )}
      </div>
    );
  };

  const columns = useMemo(() => [
    { header: "Kode", accessor: "kode_peminjaman" },
    { header: "Siswa", accessor: "user.name", render: (row: any) => row?.user?.name || "-" },
    { header: "Buku", accessor: "buku.judul", render: (row: any) => row?.details?.[0]?.buku?.judul || "Buku" },
    { 
      header: "Status", accessor: "status",
      render: (row: any) => {
        let style = "bg-slate-500/10 text-slate-500";
        if (row?.status === 'pending') style = "bg-amber-500/10 text-amber-500";
        if (row?.status === 'disetujui') style = "bg-blue-500/10 text-blue-500";
        if (row?.status === 'dipinjam') style = "bg-indigo-500/10 text-indigo-500";
        if (row?.status === 'dikembalikan') style = "bg-indigo-500/10 text-indigo-500";
        if (row?.status === 'ditolak') style = "bg-rose-500/10 text-rose-500";
        if (row?.status === 'terlambat') style = "bg-rose-500/10 text-rose-500 animate-pulse";
        return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${style}`}>{row?.status || "-"}</span>;
      }
    },
  ], [data]);

  return (
    <div className="p-6 lg:p-10">
      <UserTable
        title="Sirkulasi Peminjaman"
        description="Gunakan tombol Scan untuk memproses penyerahan dan pengembalian buku di LENTERA."
        columns={columns}
        data={Array.isArray(data) ? data : []}
        isLoading={isLoading}
        endpoint={endpoint}
        showAddButton={false}
        showEditButton={false}
        showDeleteButton={false}
        customActions={renderCustomActions}
        headerActions={
          <button onClick={() => setIsScannerOpen(true)} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-4 rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-indigo-900/20 uppercase tracking-[0.2em] active:scale-95">
            <QrCode size={18} /> SCAN SIRKULASI
          </button>
        }
      />

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleQRScanSuccess} />

      {/* --- MODAL PENGEMBALIAN --- */}
      <Transition show={!!returnModalData} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={closeReturnModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[40px] bg-slate-900 border border-white/5 p-8 text-left shadow-2xl transition-all">
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-500 mb-1">
                        <History size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Check-In LENTERA</span>
                      </div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">PENGEMBALIAN</h3>
                    </div>
                    <button onClick={closeReturnModal} className="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all hover:bg-white/10">
                      <X size={18} />
                    </button>
                  </div>

                  {!showReturnForm ? (
                    <div className="space-y-4">
                      <div className="bg-slate-800/30 p-5 rounded-[24px] border border-slate-800 mb-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Buku Identifikasi</p>
                        <p className="text-white font-bold text-sm uppercase tracking-tight leading-tight">{returnModalData?.details?.[0]?.buku?.judul || "Buku"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="h-[1px] w-3 bg-indigo-500 rounded-full"></span>
                          <p className="text-indigo-400 font-black text-[10px] uppercase">{returnModalData?.user?.name}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleUpdateStatus(returnModalData?.id, 'dikembalikan', { kondisi_buku: 'baik' })}
                        className="w-full group flex items-center gap-4 p-6 bg-indigo-600 hover:bg-indigo-500 rounded-[28px] transition-all shadow-xl shadow-indigo-900/40 active:scale-[0.98]"
                      >
                        <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="text-white" size={28} />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-black text-xs uppercase tracking-widest leading-none">KONDISI AMAN</p>
                          <p className="text-indigo-100 text-[10px] font-medium mt-1.5 opacity-80 uppercase tracking-tighter">Tanpa denda & kondisi baik</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setShowReturnForm(true)}
                        className="w-full group flex items-center gap-4 p-6 bg-slate-800 hover:bg-slate-750 rounded-[28px] transition-all border border-slate-700/50 active:scale-[0.98]"
                      >
                        <div className="p-3 bg-rose-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                          <AlertCircle className="text-rose-500" size={28} />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-black text-xs uppercase tracking-widest leading-none">BERMASALAH / TELAT</p>
                          <p className="text-slate-400 text-[10px] font-medium mt-1.5 uppercase tracking-tighter">Input kondisi & denda pelanggaran</p>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-[0.2em]">Pilih Kondisi Fisik</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['baik', 'rusak', 'hilang'] as const).map((k) => (
                            <button key={k} onClick={() => setKondisiBuku(k)} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${kondisiBuku === k ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:bg-slate-800'}`}>
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <AlertTriangle size={14} className="text-indigo-500" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Input Pelanggaran</p>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                          {kategoriDendaList.map((kat: any) => {
                            const isChecked = selectedDendaIds.includes(kat.id.toString());
                            return (
                              <div key={kat.id} onClick={() => setSelectedDendaIds(prev => isChecked ? prev.filter(i => i !== kat.id.toString()) : [...prev, kat.id.toString()])} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${isChecked ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                                <div className="flex flex-col"><span className="text-[11px] font-black uppercase tracking-tight">{kat.nama_pelanggaran}</span><span className="text-[10px] font-bold opacity-80">{renderNominal(kat)}</span></div>
                                <div className={`size-5 rounded-lg border flex items-center justify-center ${isChecked ? 'bg-white border-white text-indigo-600' : 'border-white/10'}`}>
                                  {isChecked && <Check size={12} strokeWidth={4} />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button onClick={() => setShowReturnForm(false)} className="flex-1 py-5 rounded-[24px] bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-all">Kembali</button>
                        <button 
                          onClick={() => handleUpdateStatus(returnModalData?.id, 'dikembalikan', { kategori_denda_ids: selectedDendaIds, kondisi_buku: kondisiBuku })}
                          className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                          <ShieldCheck size={20} /> SIMPAN DATA
                        </button>
                      </div>
                    </div>
                  )}

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL PENOLAKAN --- */}
      <Transition show={rejectModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => setRejectModal({ isOpen: false, id: null })}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[32px] bg-slate-900 border border-rose-500/20 p-8 text-left shadow-2xl transition-all">
                  <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-rose-500/10 text-rose-500 rounded-full"><XCircle size={24} /></div><div><h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Tolak Peminjaman</h3></div></div>
                  <textarea value={catatanTolak} onChange={(e) => setCatatanTolak(e.target.value)} placeholder="Berikan alasan penolakan..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-rose-500 outline-none min-h-[120px] shadow-inner transition-all" />
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setRejectModal({ isOpen: false, id: null })} className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Batal</button>
                    <button onClick={() => handleUpdateStatus(rejectModal.id!, 'ditolak', { catatan_petugas: catatanTolak })} disabled={!catatanTolak.trim()} className="flex-1 py-4 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/20 active:scale-95">Konfirmasi</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL APPROVE --- */}
      <Transition show={confirmApprove.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => setConfirmApprove({ isOpen: false, id: null })}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-[32px] bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl transition-all">
                  <div className="mx-auto w-max p-4 bg-indigo-500/10 text-indigo-500 rounded-full mb-5 shadow-inner">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Setujui</h3>
                  <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">Konfirmasi persetujuan pengajuan sirkulasi buku ini.</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setConfirmApprove({ isOpen: false, id: null })} className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Batal</button>
                    <button onClick={() => confirmApprove.id && handleUpdateStatus(confirmApprove.id, 'disetujui')} className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:scale-95">Setujui</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL HANDOVER --- */}
      <Transition show={confirmHandover.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => setConfirmHandover({ isOpen: false, data: null })}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-[32px] bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl transition-all">
                  <div className="mx-auto w-max p-4 bg-blue-500/10 text-blue-500 rounded-full mb-5 shadow-inner">
                    <ShieldCheck size={32} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Serahkan Buku</h3>
                  <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">
                    Berikan buku ke siswa untuk kode sirkulasi <span className="font-bold text-white tracking-widest">{confirmHandover.data?.kode_peminjaman}</span>?
                  </p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setConfirmHandover({ isOpen: false, data: null })} className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Batal</button>
                    <button onClick={() => confirmHandover.data && handleUpdateStatus(confirmHandover.data.id, 'dipinjam')} className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">Proses</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}