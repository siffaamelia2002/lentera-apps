<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KategoriDendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_pelanggaran' => 'required|string|max:255',
            'denda_per_hari'   => 'nullable|numeric|min:0',
            'denda_flat'       => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_pelanggaran.required' => 'Nama pelanggaran wajib diisi bro.',
            'denda_per_hari.numeric'    => 'Denda per hari harus angka.',
            'denda_flat.numeric'        => 'Denda flat harus angka.',
        ];
    }
}