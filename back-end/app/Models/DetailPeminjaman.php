<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPeminjaman extends BaseModel
{
    protected $table = 'detail_peminjamans';

    /**
     * Relasi balik ke Header Peminjaman
     */
    public function peminjaman(): BelongsTo
    {
        return $this->belongsTo(Peminjaman::class, 'peminjaman_id');
    }

    /**
     * Relasi ke data Buku
     */
    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }
}