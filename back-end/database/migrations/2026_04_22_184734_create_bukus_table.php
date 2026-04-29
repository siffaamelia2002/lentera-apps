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
    Schema::create('bukus', function (Blueprint $table) {
        $table->id();
        // Relasi: Kalau kategori dihapus, buku di dalamnya ikut kehapus (opsional)
        $table->foreignId('kategori_id')->constrained('kategoris')->onDelete('cascade');
        
        $table->string('judul');
        $table->string('slug')->unique(); // Buat URL cantik di Next.js nanti
        $table->string('penulis');
        $table->string('penerbit')->nullable();
        $table->string('isbn')->unique()->nullable();
        $table->integer('stok')->default(0);
        $table->integer('tahun_terbit')->nullable();
        $table->string('lokasi_rak')->nullable(); // Contoh: R-01, B-05
        $table->text('deskripsi')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bukus');
    }
};
