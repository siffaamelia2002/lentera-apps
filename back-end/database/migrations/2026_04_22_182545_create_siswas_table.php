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
    Schema::create('siswas', function (Blueprint $table) {
        $table->id();
        // Relasi ke tabel users
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        
        $table->string('nisn')->unique();
        $table->string('nama_lengkap');
        $table->string('kelas');
        $table->string('jurusan');
        $table->string('no_hp')->nullable();
        
        // Status Siswa (Lulus/Resign/Aktif)
        $table->enum('status', ['aktif', 'lulus', 'pindah', 'keluar'])->default('aktif');
        $table->date('tanggal_lulus_atau_keluar')->nullable();
        
        $table->timestamps();
    });
}
};
