<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bukus', function (Blueprint $table) {
            $table->decimal('harga', 12, 2)
                  ->nullable()
                  ->after('stok'); // 🔥 biar rapi posisinya
        });
    }

    public function down(): void
    {
        Schema::table('bukus', function (Blueprint $table) {
            $table->dropColumn('harga');
        });
    }
};