<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Buku extends BaseModel
{
    protected $table = 'bukus';

    /**
     * Append ke JSON API
     */
    protected $appends = [
        'cover',
        'penulis_nama',
        'penerbit_nama',
    ];

    /**
     * Relasi ke kategori
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    /**
     * Relasi ke penulis
     */
    public function penulis(): BelongsTo
    {
        return $this->belongsTo(Penulis::class);
    }

    /**
     * Relasi ke penerbit
     */
    public function penerbit(): BelongsTo
    {
        return $this->belongsTo(Penerbit::class);
    }

    /**
     * Accessor cover dari Spatie Media
     */
    public function getCoverAttribute()
    {
        return $this->getFirstMediaUrl('cover') ?: null;
    }

    /**
     * Nama penulis (shortcut)
     */
    public function getPenulisNamaAttribute()
    {
        return $this->penulis?->nama;
    }

    /**
     * Nama penerbit (shortcut)
     */
    public function getPenerbitNamaAttribute()
    {
        return $this->penerbit?->nama;
    }
}