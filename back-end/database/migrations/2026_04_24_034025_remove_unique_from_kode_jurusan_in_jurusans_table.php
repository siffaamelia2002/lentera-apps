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
    Schema::table('jurusans', function (Blueprint $table) {
        // Menghapus index unique
        $table->dropUnique(['kode_jurusan']); 
    });
}

public function down(): void
{
    Schema::table('jurusans', function (Blueprint $table) {
        // Jika ingin dikembalikan jadi unik lagi (rollback)
        $table->unique('kode_jurusan');
    });
}
};
