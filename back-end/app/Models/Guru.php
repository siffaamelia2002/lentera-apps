<?php

namespace App\Models;

class Guru extends BaseModel
{
    protected $table = 'gurus';

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}