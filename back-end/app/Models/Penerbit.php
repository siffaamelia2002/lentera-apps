<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Penerbit extends BaseModel
{
    protected $table = 'penerbit';

    /**
     * Relasi ke buku
     */
    public function bukus(): HasMany
    {
        return $this->hasMany(Buku::class);
    }
}