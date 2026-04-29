<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JurusanRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Tetap true supaya request diizinkan
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_jurusan' => 'required|string|max:255',
            'kode_jurusan' => 'required|string|max:10', 
            // Aturan unique sudah dihapus, jadi kode yang sama tidak akan error
        ];
    }

    public function messages(): array
    {
        return [
            'nama_jurusan.required' => 'Nama jurusan wajib diisi bro.',
            'kode_jurusan.required' => 'Kode jurusan jangan kosong.',
            // Pesan error unique dihapus karena sudah tidak dipakai
        ];
    }
}