<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Denda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DendaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Load relasi lengkap agar tersinkronisasi dengan kebutuhan tabel di Frontend
        $query = Denda::with([
            'kategori_denda', 
            'peminjaman.user', // Wajib dipanggil untuk menampilkan nama siswa di tabel manajemen
            'peminjaman.details.buku'
        ]);

        // Jika user adalah peminjam, batasi query hanya untuk denda miliknya sendiri.
        // Jika user adalah admin/petugas, lewati filter ini agar semua data denda tampil.
        if ($user && $user->role === 'peminjam') {
            $query->whereHas('peminjaman', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $denda = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $denda
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validasi payload yang dikirim dari Frontend saat proses pelunasan
        $request->validate([
            'status_pembayaran' => 'required|in:belum_bayar,lunas',
            'tanggal_pembayaran' => 'nullable|date',
        ]);

        $denda = Denda::findOrFail($id);

        // Eksekusi pembaruan data
        $denda->update([
            'status_pembayaran' => $request->status_pembayaran,
            'tanggal_pembayaran' => $request->tanggal_pembayaran,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran denda berhasil dikonfirmasi.',
            'data' => $denda
        ]);
    }
}