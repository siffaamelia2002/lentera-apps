<?php

namespace Database\Seeders;

use App\Models\KategoriDenda;
use Illuminate\Database\Seeder;

class KategoriDendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategori = [
            [
                'nama_pelanggaran' => 'Keterlambatan',
                'denda_per_hari'   => 2000.00, 
                'denda_flat'       => 0.00,
            ],
            [
                'nama_pelanggaran' => 'Rusak Ringan',
                'denda_per_hari'   => 0.00,
                'denda_flat'       => 20000.00, // Tetap pakai Flat karena kerusakan ringan biasanya murah
            ],
            [
                'nama_pelanggaran' => 'Rusak Berat',
                'denda_per_hari'   => 0.00,
                'denda_flat'       => 0.00, // Otomatis hitung 50% Harga Buku di Model
            ],
            [
                'nama_pelanggaran' => 'Hilang',
                'denda_per_hari'   => 0.00,
                'denda_flat'       => 0.00, // Otomatis hitung 100% Harga Buku di Model
            ],
        ];

        foreach ($kategori as $data) {
            // Gunakan updateOrCreate supaya kalau di-seed ulang tidak duplikat
            KategoriDenda::updateOrCreate(
                ['nama_pelanggaran' => $data['nama_pelanggaran']],
                $data
            );
        }
    }
}