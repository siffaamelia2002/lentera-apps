<?php

namespace App\Models;

class Kelas extends BaseModel
{
    protected $table = 'kelases';

    protected $fillable = ['nama_kelas', 'jurusan_id'];

    /**
     * Relasi: Kelas ini milik Jurusan apa
     */
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Relasi: Satu Kelas punya banyak Siswa
     */
    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'kelas_id');
    }
}