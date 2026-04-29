<?php

namespace App\Http\Controllers\Api;

use App\Models\Kategori;
use App\Http\Requests\KategoriRequest;
use Illuminate\Http\Request;

class KategoriController extends BaseController
{
    public function __construct(Kategori $model)
    {
        parent::__construct($model);
    }

    public function store(Request $request)
    {
        app(KategoriRequest::class); 
        return parent::store($request);
    }

    public function update(Request $request, $id)
    {
        app(KategoriRequest::class);
        return parent::update($request, $id);
    }
}