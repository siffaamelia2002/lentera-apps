<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class KategoriRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation()
    {
        // Jika kode_kategori kosong tapi nama_kategori ada, kita generate otomatis
        if (!$this->kode_kategori && $this->nama_kategori) {
            $this->merge([
                'kode_kategori' => $this->generateKodeKategori($this->nama_kategori)
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'nama_kategori' => 'required|string|max:255|unique:kategoris,nama_kategori,' . $this->route('kategori'),
            'kode_kategori' => 'required|string|max:10|unique:kategoris,kode_kategori,' . $this->route('kategori'),
        ];
    }

    /**
     * Logika generate kode: Ambil konsonan atau 3 huruf pertama
     * Contoh: "Informatika" -> "INF"
     */
    private function generateKodeKategori($nama)
    {
        // Hilangkan spasi dan ambil 3 huruf pertama, ubah ke uppercase
        $clean = str_replace(' ', '', $nama);
        return strtoupper(substr($clean, 0, 3));
    }
}