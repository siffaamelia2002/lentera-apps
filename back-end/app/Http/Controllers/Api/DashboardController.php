<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Peminjaman;
use App\Models\Denda;
use App\Models\Buku;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // 1. STATISTIK UTAMA
        $bukuDipinjam = Peminjaman::where('user_id', $userId)
            ->whereIn('status', ['dipinjam', 'terlambat'])
            ->count();

        // Menghitung total nominal denda yang belum dibayar
        $totalDenda = Denda::whereHas('peminjaman', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->where('status_pembayaran', 'belum_bayar')
            ->sum('jumlah_denda');

        $bukuDikembalikan = Peminjaman::where('user_id', $userId)
            ->where('status', 'dikembalikan')
            ->count();

        $menungguPersetujuan = Peminjaman::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        // 2. DATA GRAFIK (Peminjaman 6 bulan terakhir)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = Peminjaman::where('user_id', $userId)
                ->whereMonth('tanggal_pengajuan', $month->month)
                ->whereYear('tanggal_pengajuan', $month->year)
                ->count();
                
            $chartData[] = [
                'name' => $month->translatedFormat('M'),
                'total' => $count
            ];
        }

        // 3. REKOMENDASI BUKU (Ambil 3 buku terbaru)
        $rekomendasiBuku = Buku::with('kategori')->latest()->take(3)->get()->map(function($buku) {
            return [
                'id' => $buku->id,
                'title' => $buku->judul,
                'author' => $buku->penulis_nama ?? 'Unknown', // Accessor dari model
                'category' => $buku->kategori->nama_kategori ?? 'Umum',
                'rating' => 5.0, // Dummy rating
                'cover' => $buku->cover
            ];
        });

        // 4. RIWAYAT AKTIVITAS (5 Pembaruan status terakhir)
        $recentPeminjaman = Peminjaman::with('details.buku')
            ->where('user_id', $userId)
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function($p) {
                $bookTitle = $p->details->first()->buku->judul ?? 'Koleksi Buku';
                
                $action = 'Melakukan Aktivitas';
                if ($p->status == 'pending') $action = 'Mengajukan Pinjaman';
                elseif ($p->status == 'disetujui') $action = 'Pinjaman Disetujui';
                elseif ($p->status == 'dipinjam') $action = 'Sedang Meminjam';
                elseif ($p->status == 'dikembalikan') $action = 'Telah Mengembalikan';
                elseif ($p->status == 'terlambat') $action = 'Terlambat Mengembalikan';
                elseif ($p->status == 'ditolak') $action = 'Pinjaman Ditolak';

                return [
                    'user' => 'Sistem',
                    'action' => $action,
                    'book' => $bookTitle,
                    'time' => $p->updated_at->diffForHumans() // Output: "2 jam lalu", dll
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    ['label' => 'Buku Dipinjam', 'value' => (string)$bukuDipinjam, 'type' => 'book'],
                    ['label' => 'Total Tunggakan', 'value' => 'Rp ' . number_format($totalDenda, 0, ',', '.'), 'type' => 'alert'],
                    ['label' => 'Selesai Dibaca', 'value' => (string)$bukuDikembalikan, 'type' => 'check'],
                    ['label' => 'Menunggu Konfirmasi', 'value' => (string)$menungguPersetujuan, 'type' => 'users'],
                ],
                'chart' => $chartData,
                'books' => $rekomendasiBuku,
                'activities' => $recentPeminjaman
            ]
        ]);
    }
}