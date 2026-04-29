"use client";

import { useMemo, useState, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { QrCode, X, Banknote, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import UserTable from "@/components/admin/UserTable";
import api, { getCsrf } from "@/libs/api-client";
import QRScannerModal from "@/components/ui/QRScannerModal";

export default function DendaClient({ initialData }: any) {
  const queryClient = useQueryClient();
  const endpoint = "denda";

  // --- STATE ---
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<any>(null);

  // --- FETCH DATA DENDA ---
  const { data = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      // Pathing mengikuti standar LENTERA tanpa prefix 'api'
      const res = await api.get(endpoint);
      return res.data?.data ?? res.data ?? [];
    },
    initialData,
  });

  // --- HELPER: FORMAT RUPIAH ---
  const formatRupiah = (nominal: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(nominal) || 0);
  };

  const closePaymentModal = () => {
    setPaymentModalData(null);
  };

  // --- LOGIC: BAYAR DENDA ---
  const handlePayment = async (id: number | string) => {
    const promise = async () => {
      await getCsrf();
      const res = await api.put(`${endpoint}/${id}`, { 
        status_pembayaran: 'lunas',
        tanggal_pembayaran: new Date().toISOString().split('T')[0]
      });
      
      if (!res.data?.success) throw new Error(res.data?.message || "Gagal memproses pembayaran");
      
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      closePaymentModal();
      return res.data;
    };

    toast.promise(promise(), {
      loading: 'Memproses pembayaran LENTERA...',
      success: (res) => res.message || `Pembayaran denda berhasil dikonfirmasi`,
      error: (err) => err.message || "Terjadi kesalahan",
    });
  };

  // --- LOGIC: SCAN QR KODE PEMINJAMAN ---
  const handleQRScanSuccess = (scannedCode: string) => {
    setIsScannerOpen(false);
    const tableData = Array.isArray(data) ? data : [];
    const item = tableData.find((t: any) => t?.peminjaman?.kode_peminjaman === scannedCode);
    
    if (!item) {
      toast.error(`Denda untuk kode peminjaman ${scannedCode} tidak ditemukan!`);
      return;
    }

    if (item.status_pembayaran === 'lunas') {
      toast.info(`Tagihan untuk kode ${scannedCode} sudah LUNAS.`);
    } else {
      setPaymentModalData(item);
    }
  };

  // --- CUSTOM ACTIONS UNTUK TABEL ---
  const renderCustomActions = (item: any) => {
    if (!item) return null;
    return (
      <div className="flex items-center gap-2">
        {item.status_pembayaran === 'belum_bayar' && (
          <button 
            onClick={() => setPaymentModalData(item)} 
            className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            title="Proses Pembayaran"
          >
            <Banknote size={16} strokeWidth={3} />
          </button>
        )}
      </div>
    );
  };

  // --- COLUMNS ---
  const columns = useMemo(() => [
    { header: "Kode Pinjam", accessor: "peminjaman.kode_peminjaman", render: (row: any) => row?.peminjaman?.kode_peminjaman || "-" },
    { header: "Siswa", accessor: "peminjaman.user.name", render: (row: any) => row?.peminjaman?.user?.name || "-" },
    { header: "Pelanggaran", accessor: "kategori_denda.nama_pelanggaran", render: (row: any) => row?.kategori_denda?.nama_pelanggaran || "-" },
    { 
      header: "Total Tagihan", 
      accessor: "jumlah_denda",
      render: (row: any) => (
        <span className="font-bold text-rose-500 tracking-tight">
          {formatRupiah(row?.jumlah_denda)}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status_pembayaran",
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-max tracking-tighter ${
          row?.status_pembayaran === 'belum_bayar' 
            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
        }`}>
          {row?.status_pembayaran === 'belum_bayar' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
          {row?.status_pembayaran?.replace('_', ' ') || "-"}
        </span>
      )
    },
  ], [data]);

  return (
    <div className="p-6 lg:p-10">
      <UserTable
        title="Manajemen Tagihan"
        description="Kelola denda sirkulasi & scan QR kode untuk proses pelunasan di LENTERA."
        columns={columns}
        data={Array.isArray(data) ? data : []}
        isLoading={isLoading}
        endpoint={endpoint}
        showAddButton={false}
        showEditButton={false}
        showDeleteButton={false}
        showDetailButton={true}
        customActions={renderCustomActions}
        headerActions={
          <button onClick={() => setIsScannerOpen(true)} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-4 rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-indigo-900/20 uppercase tracking-[0.2em] active:scale-95">
            <QrCode size={18} /> SCAN DENDA
          </button>
        }
      />

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleQRScanSuccess} />

      {/* --- MODAL PEMBAYARAN DENDA --- */}
      <Transition show={!!paymentModalData} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={closePaymentModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[40px] bg-slate-900 border border-white/5 p-8 text-left shadow-2xl transition-all">
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-500 mb-1">
                        <Banknote size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Finansial LENTERA</span>
                      </div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">PELUNASAN</h3>
                    </div>
                    <button onClick={closePaymentModal} className="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all hover:bg-white/10">
                      <X size={18} />
                    </button>
                  </div>

                  {paymentModalData && (
                    <div className="space-y-6">
                      <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-[28px] space-y-4 shadow-inner">
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode Sirkulasi</span>
                          <span className="text-sm font-bold text-white tracking-widest">{paymentModalData.peminjaman?.kode_peminjaman}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Siswa</span>
                          <span className="text-sm font-bold text-white truncate max-w-[150px]">{paymentModalData.peminjaman?.user?.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jenis Pelanggaran</span>
                          <span className="text-[11px] font-black text-indigo-400 text-right max-w-[60%] uppercase tracking-tighter leading-tight">{paymentModalData.kategori_denda?.nama_pelanggaran}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                          <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Tagihan</span>
                          <span className="text-3xl font-black text-rose-500 tracking-tighter shadow-rose-500/10 drop-shadow-sm">
                            {formatRupiah(paymentModalData.jumlah_denda)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button 
                          onClick={closePaymentModal}
                          className="flex-1 py-5 rounded-[24px] bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95"
                        >
                          Batal
                        </button>
                        <button 
                          onClick={() => handlePayment(paymentModalData.id)}
                          className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[24px] font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-3 active:scale-95"
                        >
                          <ShieldCheck size={20} /> KONFIRMASI LUNAS
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
    </div>
  );
}