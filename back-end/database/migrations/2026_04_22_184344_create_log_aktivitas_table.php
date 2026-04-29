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
    Schema::create('log_aktivitas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Siapa pelakunya
        $table->string('aksi'); // Misal: "Menambah Buku", "Mengembalikan Pinjaman"
        $table->text('detail')->nullable(); // Detail tambahan (JSON atau string)
        $table->string('ip_address')->nullable();
        $table->timestamps(); // Kapan kejadiannya
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};
