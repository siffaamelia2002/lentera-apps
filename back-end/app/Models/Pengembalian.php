<?php

namespace App\Models;

class Pengembalian extends BaseModel
{
    protected $table = 'pengembalians';

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class);
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }
}