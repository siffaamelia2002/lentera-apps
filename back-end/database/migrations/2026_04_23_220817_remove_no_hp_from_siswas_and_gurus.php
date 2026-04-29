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
        // Menghapus kolom no_hp di tabel siswas
        Schema::table('siswas', function (Blueprint $table) {
            if (Schema::hasColumn('siswas', 'no_hp')) {
                $table->dropColumn('no_hp');
            }
        });

        // Menghapus kolom no_hp di tabel gurus
        Schema::table('gurus', function (Blueprint $table) {
            if (Schema::hasColumn('gurus', 'no_hp')) {
                $table->dropColumn('no_hp');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tambahkan kembali kolom jika rollback (opsional)
        Schema::table('siswas', function (Blueprint $table) {
            $table->string('no_hp', 20)->nullable();
        });

        Schema::table('gurus', function (Blueprint $table) {
            $table->string('no_hp', 20)->nullable();
        });
    }
};