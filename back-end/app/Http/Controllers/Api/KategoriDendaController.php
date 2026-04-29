<?php

namespace App\Http\Controllers\Api;

use App\Models\KategoriDenda;
use App\Http\Requests\KategoriDendaRequest;
use Illuminate\Http\Request;

class KategoriDendaController extends BaseController
{
    public function __construct(KategoriDenda $model)
    {
        parent::__construct($model);
    }

    public function store(Request $request)
    {
        app(KategoriDendaRequest::class);

        return parent::store($request);
    }

    public function update(Request $request, $id)
    {
        app(KategoriDendaRequest::class);

        return parent::update($request, $id);
    }
}