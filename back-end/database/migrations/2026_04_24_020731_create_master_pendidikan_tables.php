<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Tabel Jurusan (Master Utama)
        Schema::create('jurusans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jurusan'); // Contoh: Rekayasa Perangkat Lunak
            $table->string('kode_jurusan')->unique(); // Contoh: RPL
            $table->timestamps();
        });

        // 2. Tabel Kelas (Relasi ke Jurusan)
        Schema::create('kelases', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelas'); // Contoh: XII RPL 1
            $table->foreignId('jurusan_id')
                  ->constrained('jurusans')
                  ->onDelete('cascade'); // Jika jurusan dihapus, kelas ikut terhapus
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('kelases');
        Schema::dropIfExists('jurusans');
    }
};