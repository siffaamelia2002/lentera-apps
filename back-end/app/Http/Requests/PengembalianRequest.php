<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PengembalianRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'peminjaman_id'        => 'required|exists:peminjamans,id|unique:pengembalians,peminjaman_id',
            'petugas_id'           => 'required|exists:users,id',
            'tanggal_dikembalikan' => 'required|date',
            'kondisi_buku'         => 'required|in:baik,rusak,hilang',
            'catatan'              => 'nullable|string',
        ];
    }
}