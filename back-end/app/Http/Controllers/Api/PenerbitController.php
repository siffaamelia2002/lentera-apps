<?php

namespace App\Http\Controllers\Api;

use App\Models\Penerbit;
use App\Http\Requests\PenerbitRequest;
use Illuminate\Http\Request;

class PenerbitController extends BaseController
{
    public function __construct(Penerbit $model)
    {
        parent::__construct($model);
    }

    public function store(Request $request)
    {
        app(PenerbitRequest::class);

        return parent::store($request);
    }

    public function update(Request $request, $id)
    {
        app(PenerbitRequest::class);

        return parent::update($request, $id);
    }
}