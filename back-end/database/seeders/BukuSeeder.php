<?php

namespace Database\Seeders;

use App\Models\Buku;
use App\Models\Kategori;
use App\Models\Penulis;
use App\Models\Penerbit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class BukuSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // 1. DAFTAR 12 KATEGORI NYATA
        $daftarKategori = [
            ['kode' => 'PROG', 'nama' => 'Programming'],
            ['kode' => 'SELF', 'nama' => 'Self Development'],
            ['kode' => 'NOVL', 'nama' => 'Novel'],
            ['kode' => 'FINC', 'nama' => 'Finance'],
            ['kode' => 'FIKS', 'nama' => 'Fiksi'],
            ['kode' => 'HIST', 'nama' => 'History'],
            ['kode' => 'RELI', 'nama' => 'Religi'],
            ['kode' => 'SAIN', 'nama' => 'Sains'],
            ['kode' => 'BIOG', 'nama' => 'Biografi'],
            ['kode' => 'BISN', 'nama' => 'Bisnis'],
            ['kode' => 'FILO', 'nama' => 'Filosofi'],
            ['kode' => 'PSIK', 'nama' => 'Psikologi'],
        ];

        foreach ($daftarKategori as $kat) {
            Kategori::updateOrCreate(
                ['kode_kategori' => $kat['kode']],
                ['nama_kategori' => $kat['nama']]
            );
        }

        // 2. DATA BUKU NYATA + PENULIS + PENERBIT
        $booksData = [
            ['judul' => 'Clean Code', 'kat' => 'Programming', 'penulis' => 'Robert C. Martin', 'penerbit' => 'Prentice Hall'],
            ['judul' => 'Atomic Habits', 'kat' => 'Self Development', 'penulis' => 'James Clear', 'penerbit' => 'Penguin Books'],
            ['judul' => 'The Psychology of Money', 'kat' => 'Finance', 'penulis' => 'Morgan Housel', 'penerbit' => 'Harriman House'],
            ['judul' => 'Bumi Manusia', 'kat' => 'Novel', 'penulis' => 'Pramoedya Ananta Toer', 'penerbit' => 'Lentera Dipantara'],
            ['judul' => 'Sapiens', 'kat' => 'History', 'penulis' => 'Yuval Noah Harari', 'penerbit' => 'HarperCollins'],
            ['judul' => 'Filosofi Teras', 'kat' => 'Filosofi', 'penulis' => 'Henry Manampiring', 'penerbit' => 'Buku Kompas'],
            ['judul' => 'Rich Dad Poor Dad', 'kat' => 'Finance', 'penulis' => 'Robert Kiyosaki', 'penerbit' => 'Warner Books'],
            ['judul' => 'Laskar Pelangi', 'kat' => 'Novel', 'penulis' => 'Andrea Hirata', 'penerbit' => 'Bentang Pustaka'],
            ['judul' => 'The Intelligent Investor', 'kat' => 'Finance', 'penulis' => 'Benjamin Graham', 'penerbit' => 'Harper Business'],
            ['judul' => 'Dunia Sophie', 'kat' => 'Filosofi', 'penulis' => 'Jostein Gaarder', 'penerbit' => 'Mizan'],
            ['judul' => 'Thinking, Fast and Slow', 'kat' => 'Psikologi', 'penulis' => 'Daniel Kahneman', 'penerbit' => 'Farrar, Straus and Giroux'],
            ['judul' => 'Start with Why', 'kat' => 'Bisnis', 'penulis' => 'Simon Sinek', 'penerbit' => 'Portfolio'],
            ['judul' => 'Elon Musk', 'kat' => 'Biografi', 'penulis' => 'Walter Isaacson', 'penerbit' => 'Simon & Schuster'],
            ['judul' => 'A Brief History of Time', 'kat' => 'Sains', 'penulis' => 'Stephen Hawking', 'penerbit' => 'Bantam Books'],
            ['judul' => 'Laut Bercerita', 'kat' => 'Novel', 'penulis' => 'Leila S. Chudori', 'penerbit' => 'KPG'],
        ];

        // Ambil ID Kategori untuk mapping cepat
        $kategoriIds = Kategori::pluck('id', 'nama_kategori');

        foreach ($booksData as $b) {
            // A. Create/Update Penulis
            $penulis = Penulis::updateOrCreate(
                ['nama' => $b['penulis']]
            );

            // B. Create/Update Penerbit
            $penerbit = Penerbit::updateOrCreate(
                ['nama' => $b['penerbit']]
            );

            // C. Create Buku dengan Relasi yang Benar
            Buku::updateOrCreate(
                ['judul' => $b['judul']],
                [
                    'kategori_id'  => $kategoriIds[$b['kat']] ?? $kategoriIds->first(),
                    'penulis_id'   => $penulis->id,
                    'penerbit_id'  => $penerbit->id,
                    'slug'         => Str::slug($b['judul']),
                    'cover'        => null, 
                    'stok'         => $faker->numberBetween(5, 50),
                    'harga'        => $faker->numberBetween(75, 280) * 1000,
                    'tahun_terbit' => $faker->numberBetween(2010, 2025),
                    'deskripsi'    => "Buku masterpiece berjudul '" . $b['judul'] . "' karya " . $b['penulis'] . 
                                     ". Diterbitkan oleh " . $b['penerbit'] . ". " . $faker->realText(300),
                ]
            );
        }

        $this->command->info('Mantap! Kategori, Penulis, Penerbit & 15 Buku Nyata berhasil disinkronkan tanpa data random.');
    }
}