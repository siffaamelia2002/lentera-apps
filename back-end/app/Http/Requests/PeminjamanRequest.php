<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PeminjamanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Jika request berasal dari proses STORE (pengajuan baru dari keranjang)
        if ($this->isMethod('post')) {
            return [
                'user_id' => 'required|exists:users,id',
                'tanggal_pinjam' => 'required|date',
                'tanggal_kembali_seharusnya' => 'required|date',
                
                // Validasi Array Items
                'items' => 'required|array|min:1',
                'items.*.buku_id' => 'required|exists:bukus,id',
                
                // Field pendukung lainnya (optional saat store)
                'status' => 'nullable|in:pending,disetujui,ditolak,dipinjam,dikembalikan,terlambat',
                'tanggal_pengajuan' => 'nullable|date',
            ];
        }

        // Jika request berasal dari UPDATE (misal admin ganti status)
        return [
            'user_id' => 'sometimes|exists:users,id',
            'buku_id' => 'sometimes|exists:bukus,id',
            'status' => 'sometimes|in:pending,disetujui,ditolak,dipinjam,dikembalikan,terlambat',
            'tanggal_pinjam' => 'nullable|date',
            'tanggal_kembali_seharusnya' => 'nullable|date',
            'tanggal_dikembalikan' => 'nullable|date',
            'catatan_petugas' => 'nullable|string',
        ];
    }

    /**
     * Custom message agar pesan error lebih enak dibaca (Optional)
     */
    public function messages(): array
    {
        return [
            'items.required' => 'Pilih minimal satu buku untuk diajukan.',
            'items.*.buku_id.exists' => 'Salah satu buku yang dipilih tidak valid.',
        ];
    }
}