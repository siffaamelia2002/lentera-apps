<?php

namespace App\Http\Controllers\Api;

use App\Models\Peminjaman;
use App\Models\Buku;
use App\Models\Denda;
use App\Models\KategoriDenda;
use App\Models\Pengembalian;
use App\Models\CartItem;
use App\Models\DetailPeminjaman;
use App\Http\Requests\PeminjamanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Exception;

class PeminjamanController extends BaseController
{
    public function __construct(Peminjaman $model)
    {
        parent::__construct($model);
    }

    public function index()
    {
        try {
            $data = Peminjaman::with(['user', 'details.buku', 'pengembalian', 'dendas.kategori_denda', 'petugas'])
                ->latest()
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), (new PeminjamanRequest())->rules());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi Gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = DB::transaction(function () use ($request) {
                $userId = Auth::id() ?? $request->user_id;
                $items = $request->items; 
                $firstBukuId = isset($items[0]['buku_id']) ? $items[0]['buku_id'] : null;

                $peminjaman = Peminjaman::create([
                    'user_id' => $userId,
                    'buku_id' => $firstBukuId,
                    'status' => $request->status ?? 'pending',
                    'tanggal_pengajuan' => now(), 
                    'tanggal_pinjam' => $request->tanggal_pinjam,
                    'tanggal_kembali_seharusnya' => $request->tanggal_kembali_seharusnya,
                    'catatan_petugas' => $request->catatan_petugas,
                ]);

                foreach ($items as $item) {
                    $cart = CartItem::where('user_id', $userId)->where('buku_id', $item['buku_id'])->first();
                    $jumlahPinjam = $cart ? $cart->qty : 1;

                    DetailPeminjaman::create([
                        'peminjaman_id' => $peminjaman->id,
                        'buku_id' => $item['buku_id'],
                        'jumlah' => $jumlahPinjam,
                    ]);

                    if ($cart) { $cart->delete(); }
                }

                return $peminjaman->load('details.buku');
            });

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan berhasil dibuat.',
                'data' => $result
            ], 201);

        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update Status (Approve, Tolak, Handover, dan Return dengan Kondisi & Denda)
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $result = DB::transaction(function () use ($request, $id) {
                $peminjaman = Peminjaman::with(['details.buku', 'user', 'dendas'])
                    ->where('id', $id)
                    ->orWhere('kode_peminjaman', $id)
                    ->firstOrFail();
                
                $oldStatus = $peminjaman->status;
                $newStatus = $request->status;
                $kondisi = $request->kondisi_buku ?? 'baik'; 
                $adminId = Auth::id() ?? $request->petugas_id;

                // 1. LOGIC PENYERAHAN BUKU (APPROVE -> DIPINJAM)
                if ($newStatus === 'dipinjam' && $oldStatus !== 'dipinjam') {
                    foreach ($peminjaman->details as $detail) {
                        $buku = Buku::findOrFail($detail->buku_id);
                        if ($buku->stok < $detail->jumlah) {
                            throw new Exception("Stok buku '{$buku->judul}' tidak mencukupi.");
                        }
                        $buku->decrement('stok', $detail->jumlah);
                    }
                    $peminjaman->tanggal_pinjam = now();
                }

                // 2. LOGIC PENGEMBALIAN BUKU (Meskipun terlambat status final tetap -> DIKEMBALIKAN)
                if ($newStatus === 'dikembalikan') {
                    if ($kondisi !== 'hilang') {
                        foreach ($peminjaman->details as $detail) {
                            Buku::where('id', $detail->buku_id)->increment('stok', $detail->jumlah);
                        }
                    }

                    Pengembalian::updateOrCreate(
                        ['peminjaman_id' => $peminjaman->id],
                        [
                            'petugas_id' => $adminId,
                            'tanggal_dikembalikan' => now(), 
                            'kondisi_buku' => $kondisi,
                            'catatan' => $request->catatan ?? "Dikembalikan kondisi $kondisi via scan"
                        ]
                    );

                    // Proses Penanda Denda Terlambat/Kondisi
                    if ($request->has('kategori_denda_ids')) {
                        $peminjaman->dendas()->delete();

                        $deadline = Carbon::parse($peminjaman->tanggal_kembali_seharusnya);
                        $hariTelat = now()->gt($deadline) ? now()->diffInDays($deadline) : 0;
                        $hargaBuku = $peminjaman->details->first()->buku->harga ?? 0;

                        foreach ($request->kategori_denda_ids as $katId) {
                            $kategori = KategoriDenda::findOrFail($katId);
                            $nominalDenda = $kategori->hitungNominalDenda($hargaBuku, $hariTelat);

                            if ($nominalDenda > 0) {
                                Denda::create([
                                    'peminjaman_id' => $peminjaman->id,
                                    'kategori_denda_id' => $kategori->id,
                                    'jumlah_denda' => $nominalDenda,
                                    'status_pembayaran' => 'belum_bayar',
                                ]);
                            }
                        }
                    }
                    
                    $peminjaman->tanggal_dikembalikan = now();
                }

                // 3. LOGIC PENOLAKAN PENGAJUAN
                if ($newStatus === 'ditolak') {
                    // Simpan catatan penolakan dari frontend
                    $peminjaman->catatan_petugas = $request->catatan_petugas;
                }

                $peminjaman->status = $newStatus;
                $peminjaman->petugas_id = $adminId;
                $peminjaman->save();

                return $peminjaman->load(['details.buku', 'user', 'pengembalian', 'dendas.kategori_denda', 'petugas']);
            });

            return response()->json([
                'success' => true, 
                'message' => "Sirkulasi berhasil diperbarui.",
                'data' => $result
            ]);

        } catch (Exception $e) {
            Log::error('Error Sirkulasi: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $data = Peminjaman::with(['user', 'details.buku', 'petugas', 'pengembalian', 'dendas.kategori_denda'])
                ->where('id', $id)
                ->orWhere('kode_peminjaman', $id)
                ->firstOrFail();

            return response()->json(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }
    }
}