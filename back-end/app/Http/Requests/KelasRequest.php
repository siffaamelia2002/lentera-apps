<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => 'required|string|max:255',
            // Kita hapus 'exists:jurusans,id' di sini karena 
            // validasi id akan dilakukan setelah mapping di Controller.
            'jurusan_id' => 'required', 
        ];
    }

    public function messages(): array
    {
        return [
            'nama_kelas.required' => 'Nama kelas harus diisi.',
            'jurusan_id.required' => 'Pilih jurusannya dulu bro.',
        ];
    }
}