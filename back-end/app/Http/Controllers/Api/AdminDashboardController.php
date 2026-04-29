<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Mengambil data relevan berdasarkan Model User, Siswa, dan Guru
        $totalSiswa = User::where('peran', 'siswa')->count();
        $totalGuru = User::where('peran', 'guru')->count();
        $totalAdmin = User::where('peran', 'admin')->count();
        $penggunaAktif = User::where('is_aktif', 1)->count();

        // Data dummy untuk chart, favorite books, dan activity agar komponen UI tidak error
        // Nantinya bisa diganti dengan query dari model Peminjaman / Buku (LIBRA)
        $chartData = [
            ['name' => 'Mon', 'total' => 40],
            ['name' => 'Tue', 'total' => 30],
            ['name' => 'Wed', 'total' => 65],
            ['name' => 'Thu', 'total' => 45],
            ['name' => 'Fri', 'total' => 90],
            ['name' => 'Sat', 'total' => 70],
            ['name' => 'Sun', 'total' => 85],
        ];

        $favoriteBooksData = [
            ['id' => 1, 'title' => 'Atomic Habits', 'author' => 'James Clear', 'category' => 'Self Dev', 'rating' => 4.9],
            ['id' => 2, 'title' => 'Clean Code', 'author' => 'Robert C. Martin', 'category' => 'Programming', 'rating' => 4.8],
            ['id' => 3, 'title' => 'Psychology of Money', 'author' => 'Morgan Housel', 'category' => 'Finance', 'rating' => 4.7],
        ];

        $activitiesData = [
            ['user' => 'Andi Saputra', 'action' => 'Meminjam Buku', 'book' => 'Clean Code', 'time' => '2 Menit Lalu'],
            ['user' => 'Siti Aminah', 'action' => 'Member Baru', 'book' => 'Daftar Akun', 'time' => '1 Jam Lalu'],
        ];

        return response()->json([
            'stats' => [
                ['label' => 'Total Siswa', 'value' => $totalSiswa, 'type' => 'users'],
                ['label' => 'Total Guru', 'value' => $totalGuru, 'type' => 'users'],
                ['label' => 'Total Admin', 'value' => $totalAdmin, 'type' => 'alert'],
                ['label' => 'Pengguna Aktif', 'value' => $penggunaAktif, 'type' => 'check'],
            ],
            'chart' => $chartData,
            'favoriteBooks' => $favoriteBooksData,
            'activities' => $activitiesData,
        ]);
    }
}