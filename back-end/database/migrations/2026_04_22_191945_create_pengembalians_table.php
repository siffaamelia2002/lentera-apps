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
    Schema::create('pengembalians', function (Blueprint $table) {
        $table->id();
        // Relasi ke transaksi peminjamannya
        $table->foreignId('peminjaman_id')->unique()->constrained('peminjamans')->onDelete('cascade');
        
        // Petugas yang memproses pengembalian
        $table->foreignId('petugas_id')->constrained('users');
        
        $table->date('tanggal_dikembalikan')->useCurrent();
        
        // Kondisi buku pas balik
        $table->enum('kondisi_buku', ['baik', 'rusak', 'hilang'])->default('baik');
        
        $table->text('catatan')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengembalians');
    }
};
