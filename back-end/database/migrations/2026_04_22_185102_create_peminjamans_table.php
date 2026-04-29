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
    Schema::create('peminjamans', function (Blueprint $table) {
        $table->id();
        // Siapa yang mau pinjam
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
        // Buku apa yang mau dipinjam
        $table->foreignId('buku_id')->constrained()->onDelete('cascade'); 
        
        // --- LOGIKA PERSETUJUAN ---
        // Status: diawali dengan 'pending' (menunggu persetujuan admin/petugas)
        $table->enum('status', ['pending', 'disetujui', 'ditolak', 'dipinjam', 'dikembalikan', 'terlambat'])
              ->default('pending');
        
        // Siapa admin/petugas yang menyetujui (relasi ke users juga)
        $table->foreignId('petugas_id')->nullable()->constrained('users')->onDelete('set null');
        
        $table->date('tanggal_pengajuan')->useCurrent(); // Kapan siswa klik "Pinjam"
        $table->date('tanggal_pinjam')->nullable(); // Diisi pas admin klik "Setuju"
        $table->date('tanggal_kembali_seharusnya')->nullable(); // Deadline
        $table->date('tanggal_dikembalikan')->nullable(); 
        
        $table->text('catatan_petugas')->nullable(); // Alasan kalau ditolak atau catatan tambahan
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamen');
    }
};
