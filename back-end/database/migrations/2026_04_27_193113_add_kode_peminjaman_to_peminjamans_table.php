<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peminjamans', function (Blueprint $table) {
            // Kita taruh kodenya setelah ID, unik, dan tidak boleh kosong
            $table->string('kode_peminjaman', 25)->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('peminjamans', function (Blueprint $table) {
            $table->dropColumn('kode_peminjaman');
        });
    }
};