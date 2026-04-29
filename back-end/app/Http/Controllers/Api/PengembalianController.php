<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengembalian;
use Illuminate\Http\Request;
use Exception;

class PengembalianController extends Controller
{
    /**
     * Menampilkan semua data riwayat pengembalian buku
     */
    public function index()
    {
        try {
            // Tarik data pengembalian beserta relasi yang dibutuhkan frontend
            $data = Pengembalian::with([
                'peminjaman.user',         // Data siswa yang meminjam
                'peminjaman.details.buku', // Data buku beserta cover-nya
                'petugas'                  // Data admin/petugas yang menerima buku
            ])
            ->latest()
            ->get();
            
            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pengembalian: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail spesifik dari satu pengembalian
     */
    public function show($id)
    {
        try {
            $data = Pengembalian::with([
                'peminjaman.user',
                'peminjaman.details.buku',
                'peminjaman.dendas.kategori_denda', // Tarik juga data denda jika ada
                'petugas'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data pengembalian tidak ditemukan.'
            ], 404);
        }
    }

    /**
     * Update catatan atau kondisi buku secara manual jika ada revisi dari petugas
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'kondisi_buku' => 'sometimes|in:baik,rusak,hilang',
                'catatan' => 'nullable|string'
            ]);

            $pengembalian = Pengembalian::findOrFail($id);
            
            // Update data yang diizinkan saja
            $pengembalian->update($request->only(['kondisi_buku', 'catatan']));

            return response()->json([
                'success' => true,
                'message' => 'Catatan pengembalian berhasil diperbarui.',
                'data' => $pengembalian->load(['peminjaman.user', 'peminjaman.details.buku', 'petugas'])
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage()
            ], 500);
        }
    }
}