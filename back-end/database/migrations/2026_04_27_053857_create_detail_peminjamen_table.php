<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_peminjamans', function (Blueprint $table) {
            $table->id();
            // Hubungan ke transaksi utama
            $table->foreignId('peminjaman_id')->constrained('peminjamans')->onDelete('cascade');
            // Hubungan ke buku yang dipinjam
            $table->foreignId('buku_id')->constrained('bukus');
            // Jumlah buku (jika per judul bisa pinjam > 1)
            $table->integer('jumlah')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_peminjamans');
    }
};