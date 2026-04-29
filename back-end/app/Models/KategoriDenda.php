<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class KategoriDenda extends BaseModel
{
    protected $table = 'kategori_dendas';

    // Munculkan info perhitungan otomatis saat ditarik ke API
    protected $appends = ['format_perhitungan'];

    /**
     * Fungsi Sakti: Hitung Nominal Denda
     * Panggil ini di Controller: $kategori->hitungNominalDenda($hargaBuku, $hariTelat)
     */
    public function hitungNominalDenda($hargaBuku, $hariTelat = 0): float
    {
        $nama = Str::lower($this->nama_pelanggaran);

        // 1. Hilang = 100% Harga Buku
        if (Str::contains($nama, 'hilang')) {
            return (float) $hargaBuku;
        }

        // 2. Rusak Berat = 50% Harga Buku
        if (Str::contains($nama, 'rusak') && Str::contains($nama, 'berat')) {
            return (float) ($hargaBuku * 0.5);
        }

        // 3. Telat = Harian (denda_per_hari * hari)
        if (Str::contains($nama, 'telat') || Str::contains($nama, 'lambat')) {
            return (float) ($this->denda_per_hari * $hariTelat);
        }

        // 4. Rusak Ringan / Lainnya = Flat
        return (float) $this->denda_flat;
    }

    /**
     * Accessor untuk label di Frontend
     */
    public function getFormatPerhitunganAttribute(): string
    {
        $nama = Str::lower($this->nama_pelanggaran);

        if (Str::contains($nama, 'hilang')) return '100% Harga Buku';
        if (Str::contains($nama, 'rusak') && Str::contains($nama, 'berat')) return '50% Harga Buku';
        if (Str::contains($nama, 'telat') || Str::contains($nama, 'lambat')) return 'Denda Harian';
        
        return 'Denda Flat';
    }

    /**
     * Relasi ke Denda
     */
    public function dendas(): HasMany
    {
        return $this->hasMany(Denda::class);
    }
}