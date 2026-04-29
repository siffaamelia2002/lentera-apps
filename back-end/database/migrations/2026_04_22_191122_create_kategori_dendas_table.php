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
    Schema::create('kategori_dendas', function (Blueprint $table) {
        $table->id();
        $table->string('nama_pelanggaran'); // Contoh: Terlambat, Rusak, Hilang
        $table->decimal('denda_per_hari', 10, 2)->default(0); // Buat yang telat
        $table->decimal('denda_flat', 10, 2)->default(0); // Buat yang rusak/hilang
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kategori_dendas');
    }
};
