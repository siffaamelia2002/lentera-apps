<?php

namespace App\Models;

/**
 * Model Siswa
 * Sekarang extends BaseModel untuk otomatis dapet fitur:
 * - HasFactory
 * - InteractsWithMedia (Spatie)
 * - $guarded = ['id'] (Gak perlu ketik fillable satu-satu)
 */
class Siswa extends BaseModel
{
    // Nama tabel di database
    protected $table = 'siswas';

    /**
     * Relasi Balik: Siswa ini miliknya siapa di tabel User?
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 🔥 FIX: Relasi ke tabel Kelas
     * Menghubungkan siswa dengan data kelasnya
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    /**
     * 🔥 FIX: Relasi ke tabel Jurusan
     * Menghubungkan siswa dengan data jurusannya
     */
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id');
    }

    /**
     * Helper untuk cek status
     */
    public function isLulus()
    {
        return $this->status === 'lulus';
    }
}