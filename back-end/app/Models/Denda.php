<?php

namespace App\Models;

class Denda extends BaseModel
{
    protected $table = 'dendas';

    public function kategori_denda()
    {
        return $this->belongsTo(KategoriDenda::class);
    }

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class);
    }
}