<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tambah kolom dulu
        Schema::table('siswas', function (Blueprint $table) {

            if (!Schema::hasColumn('siswas', 'kelas_id')) {
                $table->foreignId('kelas_id')
                      ->nullable()
                      ->after('user_id');
            }

            if (!Schema::hasColumn('siswas', 'jurusan_id')) {
                $table->foreignId('jurusan_id')
                      ->nullable()
                      ->after('kelas_id');
            }
        });

        // 2. Tambahkan foreign key (FIX DI SINI)
        Schema::table('siswas', function (Blueprint $table) {

            // FK ke kelases (bukan kelas)
            $table->foreign('kelas_id')
                  ->references('id')
                  ->on('kelases')
                  ->cascadeOnDelete();

            // FK ke jurusans (sudah benar)
            $table->foreign('jurusan_id')
                  ->references('id')
                  ->on('jurusans')
                  ->cascadeOnDelete();
        });

        // 3. Hapus kolom lama
        Schema::table('siswas', function (Blueprint $table) {

            if (Schema::hasColumn('siswas', 'kelas')) {
                $table->dropColumn('kelas');
            }

            if (Schema::hasColumn('siswas', 'jurusan')) {
                $table->dropColumn('jurusan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {

            // balikin kolom lama
            if (!Schema::hasColumn('siswas', 'kelas')) {
                $table->string('kelas')->nullable();
            }

            if (!Schema::hasColumn('siswas', 'jurusan')) {
                $table->string('jurusan')->nullable();
            }

            // drop FK (pakai nama constraint default Laravel)
            $table->dropForeign(['kelas_id']);
            $table->dropForeign(['jurusan_id']);

            // drop kolom relasi
            if (Schema::hasColumn('siswas', 'kelas_id')) {
                $table->dropColumn('kelas_id');
            }

            if (Schema::hasColumn('siswas', 'jurusan_id')) {
                $table->dropColumn('jurusan_id');
            }
        });
    }
};