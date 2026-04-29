<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable|exists:users,id',

            'nisn' => 'required|string|unique:siswas,nisn,' . $this->route('siswa'),

            // 🔥 FIX: pakai ID bukan string
            'kelas_id'   => 'required|exists:kelas,id',
            'jurusan_id' => 'required|exists:jurusan,id',

            // 🔥 FIX: HAPUS "aktif"
            'status' => 'nullable|in:lulus,pindah,keluar',

            // 🔥 FIX: hanya wajib kalau status ada
            'tanggal_lulus_atau_keluar' => [
                'required_with:status',
                'nullable',
                'date'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal_lulus_atau_keluar.required_with' =>
                'Tanggal wajib diisi jika status siswa diisi.',
        ];
    }
}