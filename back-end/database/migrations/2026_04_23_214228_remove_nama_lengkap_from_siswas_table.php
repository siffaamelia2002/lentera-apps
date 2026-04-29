<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Kita hapus kolom nama_lengkap
            $table->dropColumn('nama_lengkap');
        });
    }

    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Jika mau di-rollback, kolomnya balik lagi
            $table->string('nama_lengkap')->after('nisn');
        });
    }
};