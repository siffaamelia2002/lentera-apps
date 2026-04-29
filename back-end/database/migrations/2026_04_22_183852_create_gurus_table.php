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
    Schema::create('gurus', function (Blueprint $table) {
        $table->id();
        // Hubungin ke tabel User buat login
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        
        $table->string('nip')->unique()->nullable(); // Gak semua guru punya NIP (honorrer)
        $table->string('nama_lengkap');
        $table->string('no_hp')->nullable();
        
        // Status buat yang lu tanya tadi (Resign/Pensiun)
        $table->enum('status', ['aktif', 'resign', 'pensiun', 'cuti'])->default('aktif');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gurus');
    }
};
