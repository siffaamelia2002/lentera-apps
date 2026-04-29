<?php

namespace App\Http\Controllers\Api;

use App\Models\Penulis;
use App\Http\Requests\PenulisRequest;
use Illuminate\Http\Request;

class PenulisController extends BaseController
{
    public function __construct(Penulis $model)
    {
        parent::__construct($model);
    }

    public function store(Request $request)
    {
        app(PenulisRequest::class);

        return parent::store($request);
    }

    public function update(Request $request, $id)
    {
        app(PenulisRequest::class);

        return parent::update($request, $id);
    }
}