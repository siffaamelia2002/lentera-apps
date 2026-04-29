<?php

namespace App\Http\Controllers\Api;

use App\Models\Siswa;
use App\Http\Requests\SiswaRequest;
use Illuminate\Http\Request;

class SiswaController extends BaseController
{
    public function __construct(Siswa $model)
    {
        parent::__construct($model);
    }

    public function store(Request $request)
    {
        // Validasi manual dari SiswaRequest
        app(SiswaRequest::class); 

        return parent::store($request);
    }

    public function update(Request $request, $id)
    {
        // Validasi manual dari SiswaRequest
        app(SiswaRequest::class);

        return parent::update($request, $id);
    }
}