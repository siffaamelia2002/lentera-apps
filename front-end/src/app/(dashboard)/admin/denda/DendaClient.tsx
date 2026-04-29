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
      // Hit endpoint untuk update status pembayaran menjadi lunas
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
      loading: 'Memproses pembayaran...',
      success: (res) => res.message || `Pembayaran denda berhasil dikonfirmasi`,
      error: (err) => err.message || "Terjadi kesalahan",
    });
  };

  // --- LOGIC: SCAN QR KODE PEMINJAMAN ---
  const handleQRScanSuccess = (scannedCode: string) => {
    setIsScannerOpen(false);
    const tableData = Array.isArray(data) ? data : [];
    
    // Cari denda berdasarkan kode peminjaman yang di-scan
    const item = tableData.find((t: any) => t?.peminjaman?.kode_peminjaman === scannedCode);
    
    if (!item) {
      toast.error(`Denda untuk kode peminjaman ${scannedCode} tidak ditemukan!`);
      return;
    }

    if (item.status_pembayaran === 'lunas') {
      toast.info(`Denda untuk kode ${scannedCode} sudah LUNAS.`);
    } else {
      setPaymentModalData(item);
    }
  };

  // --- CUSTOM ACTIONS UNTUK TABEL ---
  const renderCustomActions = (item: any) => {
    if (!item) return null;
    return (
      <div className="flex items-center gap-2">
        {/* Tampilkan tombol bayar manual jika status belum bayar (alternatif scan) */}
        {item.status_pembayaran === 'belum_bayar' && (
          <button 
            onClick={() => setPaymentModalData(item)} 
            className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
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
      header: "Total Denda", 
      accessor: "jumlah_denda",
      render: (row: any) => (
        <span className="font-bold text-rose-500">
          {formatRupiah(row?.jumlah_denda)}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status_pembayaran",
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max ${
          row?.status_pembayaran === 'belum_bayar' 
            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
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
        title="Manajemen Denda"
        description="Kelola denda siswa & scan QR kode peminjaman untuk proses pembayaran."
        columns={columns}
        data={Array.isArray(data) ? data : []}
        isLoading={isLoading}
        endpoint={endpoint}
        showAddButton={false}     // Sembunyikan tombol tambah
        showEditButton={false}    // Sembunyikan tombol edit
        showDeleteButton={false}  // Sembunyikan tombol hapus
        showDetailButton={true}   // Tetap tampilkan tombol show/detail (bawaan UserTable)
        customActions={renderCustomActions}
        headerActions={
          <button onClick={() => setIsScannerOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest">
            <QrCode size={20} /> Scan Denda
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[40px] bg-slate-900 border border-white/5 p-8 text-left shadow-2xl transition-all">
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-rose-500 mb-1">
                        <Banknote size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pembayaran Denda</span>
                      </div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">LUNASI DENDA</h3>
                    </div>
                    <button onClick={closePaymentModal} className="p-2 bg-white/5 text-slate-400 rounded-full hover:text-white transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {paymentModalData && (
                    <div className="space-y-6">
                      {/* RINCIAN DATA */}
                      <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode Peminjaman</span>
                          <span className="text-sm font-bold text-white">{paymentModalData.peminjaman?.kode_peminjaman}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Peminjam</span>
                          <span className="text-sm font-bold text-white">{paymentModalData.peminjaman?.user?.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pelanggaran</span>
                          <span className="text-xs font-bold text-rose-400 text-right max-w-[60%]">{paymentModalData.kategori_denda?.nama_pelanggaran}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Total Tagihan</span>
                          <span className="text-2xl font-black text-rose-500 tracking-tight">
                            {formatRupiah(paymentModalData.jumlah_denda)}
                          </span>
                        </div>
                      </div>

                      {/* SUBMIT */}
                      <div className="pt-4 flex gap-3">
                        <button 
                          onClick={closePaymentModal}
                          className="flex-1 py-5 rounded-[24px] bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                        >
                          Batal
                        </button>
                        <button 
                          onClick={() => handlePayment(paymentModalData.id)}
                          className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-[24px] font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
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