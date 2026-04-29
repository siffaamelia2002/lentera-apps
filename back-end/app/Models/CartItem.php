<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends BaseModel
{
    protected $table = 'cart_items';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class);
    }
}