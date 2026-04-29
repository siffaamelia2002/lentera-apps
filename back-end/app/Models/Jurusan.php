<?php

namespace App\Models;

class Jurusan extends BaseModel
{
    protected $table = 'jurusans';

    protected $fillable = ['nama_jurusan', 'kode_jurusan'];

    /**
     * Relasi: Satu Jurusan punya banyak Kelas
     */
    public function kelas()
    {
        return $this->hasMany(Kelas::class);
    }

    /**
     * Relasi: Satu Jurusan punya banyak Siswa
     */
    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'jurusan_id');
    }
}