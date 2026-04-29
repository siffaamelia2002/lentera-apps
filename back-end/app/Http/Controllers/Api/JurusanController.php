<?php

namespace App\Http\Controllers\Api;

use App\Models\Jurusan;
use App\Http\Requests\JurusanRequest;
use Illuminate\Http\Request; // Tetap pakai ini di parameter

class JurusanController extends BaseController
{
    public function __construct(Jurusan $model)
    {
        parent::__construct($model);
    }

    public function store(Request $request) // Gunakan Request standar agar kompatibel
    {
        // Panggil validasi secara manual dari class JurusanRequest
        app(JurusanRequest::class); 

        return parent::store($request);
    }

    public function update(Request $request, $id)
    {
        // Validasi otomatis jalan lewat baris ini
        app(JurusanRequest::class);

        return parent::update($request, $id);
    }
}