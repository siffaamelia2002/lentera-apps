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
    Schema::table('users', function (Blueprint $table) {
        // Hapus kolom email_verified_at kalau lu merasa gak butuh
        // $table->dropColumn('email_verified_at'); 

        // Tambah kolom baru setelah email
        $table->enum('peran', ['admin', 'siswa', 'guru'])->default('siswa')->after('email');
        $table->boolean('is_aktif')->default(false)->after('peran');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Balikin lagi kalau suatu saat di-rollback
        $table->dropColumn(['peran', 'is_aktif']);
    });
}
};
