<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

class BaseController extends Controller
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function index()
    {
        return response()->json($this->model->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $this->model->create($request->all());
        return response()->json(['message' => 'Data berhasil dibuat', 'data' => $data], 201);
    }

    public function show($id)
    {
        return response()->json($this->model->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = $this->model->findOrFail($id);
        $item->update($request->all());
        return response()->json(['message' => 'Data berhasil diupdate', 'data' => $item]);
    }

    public function destroy($id)
    {
        $item = $this->model->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    /**
     * FUNGSI BULK DELETE GLOBAL
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->ids; // Ekspektasi input: { "ids": [1, 2, 3] }
        
        if (!is_array($ids) || empty($ids)) {
            return response()->json(['message' => 'Tidak ada ID yang dipilih'], 400);
        }

        $this->model->whereIn('id', $ids)->delete();

        return response()->json([
            'message' => count($ids) . ' data berhasil dihapus sekaligus'
        ]);
    }
}