<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bukus', function (Blueprint $table) {

            // tambah FK dulu (AMAN)
            $table->foreignId('penulis_id')
                ->nullable()
                ->constrained('penulis')
                ->nullOnDelete();

            $table->foreignId('penerbit_id')
                ->nullable()
                ->constrained('penerbit')
                ->nullOnDelete();
        });

        // 🔥 drop kolom lama di luar closure biar aman
        Schema::table('bukus', function (Blueprint $table) {
            if (Schema::hasColumn('bukus', 'penulis')) {
                $table->dropColumn('penulis');
            }

            if (Schema::hasColumn('bukus', 'penerbit')) {
                $table->dropColumn('penerbit');
            }
        });
    }

    public function down(): void
    {
        Schema::table('bukus', function (Blueprint $table) {

            $table->string('penulis')->nullable();
            $table->string('penerbit')->nullable();

            $table->dropForeign(['penulis_id']);
            $table->dropForeign(['penerbit_id']);

            $table->dropColumn(['penulis_id', 'penerbit_id']);
        });
    }
};