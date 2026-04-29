<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Penulis extends BaseModel
{
    protected $table = 'penulis';

    /**
     * Relasi ke buku
     */
    public function bukus(): HasMany
    {
        return $this->hasMany(Buku::class);
    }
}