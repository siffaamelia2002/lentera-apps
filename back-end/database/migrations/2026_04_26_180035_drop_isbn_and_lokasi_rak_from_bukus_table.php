<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bukus', function (Blueprint $table) {
            // drop index/unique dulu kalau ada
            if (Schema::hasColumn('bukus', 'isbn')) {
                $table->dropUnique(['isbn']); // aman kalau memang unique
            }

            // drop kolom
            if (Schema::hasColumn('bukus', 'isbn')) {
                $table->dropColumn('isbn');
            }

            if (Schema::hasColumn('bukus', 'lokasi_rak')) {
                $table->dropColumn('lokasi_rak');
            }
        });
    }

    public function down(): void
    {
        Schema::table('bukus', function (Blueprint $table) {
            $table->string('isbn')->nullable()->unique()->after('slug');
            $table->string('lokasi_rak')->nullable()->after('tahun_terbit');
        });
    }
};