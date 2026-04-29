<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class BukuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // ================= PREPARE =================
    protected function prepareForValidation()
    {
        if ($this->judul) {
            $this->merge([
                'slug' => Str::slug($this->judul)
            ]);
        }
    }

    // ================= RULES =================
    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'kategori_id' => ($isUpdate ? 'sometimes' : 'required') . '|exists:kategoris,id',

            'judul' => ($isUpdate ? 'sometimes' : 'required') . '|string|max:255',

            'slug' => ($isUpdate ? 'sometimes' : 'required') . '|string|max:255|unique:bukus,slug,' . $this->route('buku'),

            // 🔥 RELASI
            'penulis_id' => ($isUpdate ? 'sometimes' : 'required') . '|exists:penulis,id',
            'penerbit_id' => 'nullable|exists:penerbit,id',

            // 🔥 CORE FIELD
            'stok' => ($isUpdate ? 'sometimes' : 'required') . '|integer|min:0',
            'harga' => ($isUpdate ? 'sometimes' : 'required') . '|numeric|min:0',

            // 🔥 OPTIONAL
            'tahun_terbit' => 'nullable|integer',
            'deskripsi' => 'nullable|string',

            // 🔥 MEDIA
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    // ================= FAILED =================
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'error_type' => 'VALIDATION_ERROR',
            'errors' => $validator->errors(),
        ], 422));
    }
}