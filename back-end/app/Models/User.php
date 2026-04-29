<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, InteractsWithMedia;

    /**
     * 🔥 MASS ASSIGNABLE (FIX DISINI)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'peran',
        'is_aktif',
        'profile_picture',
        'no_hp',   // 🔥 TAMBAH INI
        'alamat',  // 🔥 TAMBAH INI
    ];

    /**
     * 🔒 HIDDEN
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * 🔥 CASTING
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_aktif' => 'boolean',
        ];
    }

    /**
     * 🖼️ MEDIA (SPATIE)
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
             ->singleFile();
    }

    /**
     * 🔗 RELASI
     */
    public function siswa()
    {
        return $this->hasOne(\App\Models\Siswa::class);
    }

    public function guru()
    {
        return $this->hasOne(\App\Models\Guru::class);
    }
}