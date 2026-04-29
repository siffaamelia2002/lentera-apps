<?php

namespace App\Models;

class LogAktivitas extends BaseModel
{
    protected $table = 'log_aktivitas';

    // Relasi ke User (Pelaku aksi)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}