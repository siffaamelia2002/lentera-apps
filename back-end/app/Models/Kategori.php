<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends BaseModel
{
    protected $table = 'kategoris';

    public function bukus(): HasMany
    {
        return $this->hasMany(Buku::class);
    }
}