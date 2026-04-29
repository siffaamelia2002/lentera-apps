<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use DateTimeInterface;

abstract class BaseModel extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table;
    protected $guarded = ['id'];

    /**
     * Tambahkan 'cover' ke JSON secara otomatis untuk semua model
     */
    protected $appends = ['cover'];

    /**
     * Accessor Global: Mengambil URL gambar dari Spatie Media Library
     * Jika field 'cover' dipanggil di Frontend, dia akan menjalankan fungsi ini.
     */
    public function getCoverAttribute()
    {
        // Mengambil URL dari koleksi 'cover' yang didefinisikan di bawah
        $media = $this->getFirstMediaUrl('cover');
        
        // Jika media ditemukan, kembalikan URL-nya. 
        // Jika tidak, kembalikan placeholder agar UI tidak kosong.
        return $media ?: 'https://placehold.co/400x600/0f172a/64748b?text=NO+IMAGE';
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')
             ->singleFile(); 
    }
}