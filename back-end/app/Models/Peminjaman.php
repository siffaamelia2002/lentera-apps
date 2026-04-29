<?php

namespace App\Models;

// Import yang wajib ada supaya type-hinting relasi jalan
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class Peminjaman extends BaseModel
{
    protected $table = 'peminjamans';

    // Pastikan field ini bisa diisi
    protected $fillable = [
        'user_id',
        'petugas_id',
        'buku_id',
        'kode_peminjaman',
        'status',
        'tanggal_pengajuan',
        'tanggal_pinjam',
        'tanggal_kembali_seharusnya',
        'tanggal_dikembalikan',
        'catatan_petugas'
    ];

    /**
     * Booted function untuk menangani auto-generate kode
     */
    protected static function booted()
    {
        parent::booted();

        static::creating(function ($peminjaman) {
            if (empty($peminjaman->kode_peminjaman)) {
                $peminjaman->kode_peminjaman = self::generateKodePinjam();
            }
        });
    }

    /**
     * Logic Generate Kode: PMJ-20260428-0001
     */
    public static function generateKodePinjam()
    {
        $today = now()->format('Ymd');
        
        $lastRecord = self::whereDate('created_at', now())
                          ->orderBy('id', 'desc')
                          ->first();

        if (!$lastRecord) {
            $nextNumber = '0001';
        } else {
            $lastNumber = substr($lastRecord->kode_peminjaman, -4);
            $nextNumber = str_pad((int)$lastNumber + 1, 4, '0', STR_PAD_LEFT);
        }

        return 'PMJ-' . $today . '-' . $nextNumber;
    }

    /**
     * RELASI UTAMA
     */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function petugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(DetailPeminjaman::class, 'peminjaman_id');
    }

    /**
     * FIX: Relasi ke Pengembalian (Tabel pengembalians)
     * Ditambahkan agar Controller bisa melakukan with(['pengembalian'])
     */
    public function pengembalian(): HasOne
    {
        return $this->hasOne(Pengembalian::class, 'peminjaman_id');
    }

    /**
     * FIX: Relasi ke Denda (Tabel dendas)
     * Diubah ke HasMany karena satu sirkulasi bisa kena banyak jenis denda
     */
    public function dendas(): HasMany
    {
        return $this->hasMany(Denda::class, 'peminjaman_id');
    }

    /**
     * Helper untuk cek status keterlambatan secara realtime
     */
    public function getIsTerlambatAttribute()
    {
        if ($this->status === 'dikembalikan' || !$this->tanggal_kembali_seharusnya) {
            return false;
        }

        return now()->gt(Carbon::parse($this->tanggal_kembali_seharusnya));
    }
}