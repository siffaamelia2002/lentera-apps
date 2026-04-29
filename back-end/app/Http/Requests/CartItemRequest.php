<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CartItemRequest extends FormRequest
{
    /**
     * Izinkan request ini (pastikan user sudah login lewat middleware di route)
     */
    public function authorize(): bool
    {
        return true; 
    }

    /**
     * Aturan Validasi
     */
    public function rules(): array
    {
        return [
            'buku_id' => [
                'required',
                'integer',
                'exists:bukus,id' // Pastikan ID buku ada di tabel bukus
            ],
            'qty' => [
                'required',
                'integer',
                'min:1',
                // Opsional: Tambahkan logika custom jika ingin cek stok langsung di sini
            ],
        ];
    }

    /**
     * Pesan Error Custom (Bahasa Indonesia)
     */
    public function messages(): array
    {
        return [
            'buku_id.required' => 'Buku harus dipilih.',
            'buku_id.exists'   => 'Buku tidak ditemukan di sistem.',
            'qty.required'     => 'Jumlah item tidak boleh kosong.',
            'qty.integer'      => 'Jumlah harus berupa angka.',
            'qty.min'          => 'Minimal peminjaman adalah 1 buku.',
        ];
    }

    /**
     * Format respons jika validasi gagal (agar sinkron dengan Toast di Next.js)
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status'  => 'error',
            'message' => 'Validasi gagal',
            'errors'  => $validator->errors()
        ], 422));
    }
}