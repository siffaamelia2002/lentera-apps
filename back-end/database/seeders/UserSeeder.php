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
        // ==========================================
        // 1. MASTER DATA 12 JURUSAN
        // ==========================================
        $dataJurusan = [
            ['kode' => 'RPL', 'nama' => 'Rekayasa Perangkat Lunak'],
            ['kode' => 'TKJ', 'nama' => 'Teknik Komputer Jaringan'],
            ['kode' => 'MM',  'nama' => 'Multimedia / DKV'],
            ['kode' => 'OTKP', 'nama' => 'Otomatisasi & Tata Kelola Perkantoran'],
            ['kode' => 'AKL', 'nama' => 'Akuntansi & Keuangan Lembaga'],
            ['kode' => 'BDP', 'nama' => 'Bisnis Daring & Pemasaran'],
            ['kode' => 'TKRO', 'nama' => 'Teknik Kendaraan Ringan Otomotif'],
            ['kode' => 'TBSM', 'nama' => 'Teknik Bisnis Sepeda Motor'],
            ['kode' => 'TITL', 'nama' => 'Teknik Instalasi Tenaga Listrik'],
            ['kode' => 'TPm',  'nama' => 'Teknik Pemesinan'],
            ['kode' => 'PH',   'nama' => 'Perhotelan'],
            ['kode' => 'TBG',  'nama' => 'Tata Boga'],
        ];

        $jurusanIds = [];
        $kelasIds = [];

        foreach ($dataJurusan as $j) {
            $jurusan = Jurusan::firstOrCreate(
                ['kode_jurusan' => $j['kode']],
                ['nama_jurusan' => $j['nama']]
            );
            $jurusanIds[] = $jurusan->id;

            // Buat 1 Kelas contoh untuk setiap jurusan (Misal kelas X)
            $kelas = Kelas::firstOrCreate(
                ['nama_kelas' => "X " . $j['kode'] . " 1", 'jurusan_id' => $jurusan->id]
            );
            $kelasIds[] = $kelas->id;
        }

        // List Alamat Dummy
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

            Guru::updateOrCreate(
                ['user_id' => $userGuru->id],
                [
                    'nip' => '19850101' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'status' => 'aktif',
                ]
            );
        }

        // ==========================================
        // 4. GENERATE 20 SISWA (Disebar ke Jurusan Berbeda)
        // ==========================================
        for ($i = 1; $i <= 20; $i++) {
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

            // Ambil Index Jurusan/Kelas secara acak dari 12 yang tersedia
            $randomIndex = rand(0, count($jurusanIds) - 1);

            Siswa::updateOrCreate(
                ['user_id' => $userSiswa->id],
                [
                    'nisn' => '00223344' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'jurusan_id' => $jurusanIds[$randomIndex],
                    'kelas_id' => $kelasIds[$randomIndex],
                    'status' => 'aktif',
                ]
            );
        }

        $this->command->info('🔥 SEEDER SUCCESS: 12 Jurusan, 12 Kelas, dan 40 User (Admin, Guru, Siswa) berhasil di-inject!');
    }
}