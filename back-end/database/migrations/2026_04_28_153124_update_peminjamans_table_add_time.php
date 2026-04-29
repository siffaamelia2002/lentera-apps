<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('peminjamans', function (Blueprint $row) {
            // Mengubah tipe data kolom dari DATE ke DATETIME
            $row->dateTime('tanggal_pengajuan')->change();
            $row->dateTime('tanggal_pinjam')->nullable()->change();
            $row->dateTime('tanggal_kembali_seharusnya')->nullable()->change();
            $row->dateTime('tanggal_dikembalikan')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peminjamans', function (Blueprint $row) {
            // Kembalikan ke DATE jika rollback
            $row->date('tanggal_pengajuan')->change();
            $row->date('tanggal_pinjam')->nullable()->change();
            $row->date('tanggal_kembali_seharusnya')->nullable()->change();
            $row->date('tanggal_dikembalikan')->nullable()->change();
        });
    }
};