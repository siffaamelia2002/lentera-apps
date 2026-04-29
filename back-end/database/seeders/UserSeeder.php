<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Siswa;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. MASTER DATA JURUSAN & KELAS
        $jurusanRPL = Jurusan::firstOrCreate(['kode_jurusan' => 'RPL'], ['nama_jurusan' => 'Rekayasa Perangkat Lunak']);
        $jurusanTKJ = Jurusan::firstOrCreate(['kode_jurusan' => 'TKJ'], ['nama_jurusan' => 'Teknik Komputer Jaringan']);

        $kelas10RPL = Kelas::firstOrCreate(['nama_kelas' => 'X RPL 1', 'jurusan_id' => $jurusanRPL->id]);
        $kelas10TKJ = Kelas::firstOrCreate(['nama_kelas' => 'X TKJ 1', 'jurusan_id' => $jurusanTKJ->id]);

        // List Alamat Dummy agar bervariasi
        $daftarAlamat = [
            'Jl. Merdeka No. ', 'Jl. Sudirman No. ', 'Jl. Gatot Subroto No. ', 
            'Perumahan Indah Blok A', 'Gg. Kelinci No. ', 'Jl. Ahmad Yani No. '
        ];

        // ==========================================
        // 2. GENERATE 10 ADMIN
        // ==========================================
        for ($i = 1; $i <= 10; $i++) {
            User::updateOrCreate(
                ['email' => "admin$i@libra.com"],
                [
                    'name' => "Admin Libra $i",
                    'password' => Hash::make('password'),
                    'peran' => 'admin',
                    'no_hp' => '0812' . rand(10000000, 99999999),
                    'alamat' => $daftarAlamat[array_rand($daftarAlamat)] . rand(1, 100),
                    'is_aktif' => true,
                    'email_verified_at' => now(),
                ]
            );
        }

        // ==========================================
        // 3. GENERATE 10 GURU
        // ==========================================
        for ($i = 1; $i <= 10; $i++) {
            $userGuru = User::updateOrCreate(
                ['email' => "guru$i@libra.com"],
                [
                    'name' => "Guru $i, S.Pd",
                    'password' => Hash::make('password'),
                    'peran' => 'guru',
                    'no_hp' => '0857' . rand(10000000, 99999999),
                    'alamat' => $daftarAlamat[array_rand($daftarAlamat)] . rand(1, 100),
                    'is_aktif' => true,
                    'email_verified_at' => now(),
                ]
            );

            // Record Detail di tabel gurus
            Guru::updateOrCreate(
                ['user_id' => $userGuru->id],
                [
                    'nip' => '19850101' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'status' => 'aktif',
                ]
            );
        }

        // ==========================================
        // 4. GENERATE 10 SISWA
        // ==========================================
        for ($i = 1; $i <= 10; $i++) {
            $userSiswa = User::updateOrCreate(
                ['email' => "siswa$i@libra.com"],
                [
                    'name' => "Siswa ke-$i",
                    'password' => Hash::make('password'),
                    'peran' => 'siswa',
                    'no_hp' => '0899' . rand(10000000, 99999999),
                    'alamat' => $daftarAlamat[array_rand($daftarAlamat)] . rand(1, 100),
                    'is_aktif' => true,
                    'email_verified_at' => now(),
                ]
            );

            // Tentukan jurusan & kelas selang-seling
            $jurusanId = ($i % 2 == 0) ? $jurusanTKJ->id : $jurusanRPL->id;
            $kelasId = ($i % 2 == 0) ? $kelas10TKJ->id : $kelas10RPL->id;

            // Record Detail di tabel siswas
            Siswa::updateOrCreate(
                ['user_id' => $userSiswa->id],
                [
                    'nisn' => '00223344' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'jurusan_id' => $jurusanId,
                    'kelas_id' => $kelasId,
                    'status' => 'aktif',
                ]
            );
        }

        $this->command->info('🔥 SEEDER FIX: 30 User + Alamat & No HP Berhasil di-Inject!');
    }
}