<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gurus', function (Blueprint $table) {
            // Hapus kolom nama_lengkap yang mubazir
            $table->dropColumn('nama_lengkap');
        });
    }

    public function down(): void
    {
        Schema::table('gurus', function (Blueprint $table) {
            // Balikin lagi kalo rollback (opsional)
            $table->string('nama_lengkap')->after('nip');
        });
    }
};