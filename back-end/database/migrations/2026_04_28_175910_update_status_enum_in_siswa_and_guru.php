<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Paksa kolom status jadi NULLABLE dulu agar bisa dikosongin
        DB::statement("ALTER TABLE siswas MODIFY COLUMN status ENUM('aktif', 'lulus', 'pindah', 'keluar') NULL");
        DB::statement("ALTER TABLE gurus MODIFY COLUMN status ENUM('aktif', 'resign', 'pensiun', 'cuti') NULL");

        // 2. Sekarang baru aman buat update datanya jadi NULL
        DB::table('siswas')->where('status', 'aktif')->update(['status' => null]);
        DB::table('gurus')->whereIn('status', ['aktif', 'cuti'])->update(['status' => null]);

        // 3. Terakhir, update ENUM-nya ke versi baru yang lebih bersih
        DB::statement("ALTER TABLE siswas MODIFY COLUMN status ENUM('lulus', 'pindah', 'keluar') NULL");
        DB::statement("ALTER TABLE gurus MODIFY COLUMN status ENUM('resign', 'pensiun') NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Balikin ke asal jika perlu (default 'aktif')
        DB::statement("ALTER TABLE siswas MODIFY COLUMN status ENUM('aktif', 'lulus', 'pindah', 'keluar') DEFAULT 'aktif'");
        DB::statement("ALTER TABLE gurus MODIFY COLUMN status ENUM('aktif', 'resign', 'pensiun', 'cuti') DEFAULT 'aktif'");
    }
};