<?php

namespace App\Http\Controllers\Api;

use App\Models\Kelas;
use App\Models\Jurusan;
use App\Http\Requests\KelasRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KelasController extends BaseController
{
    public function __construct(Kelas $model)
    {
        parent::__construct($model);
    }

    public function index()
    {
        return response()->json($this->model->with('jurusan')->latest()->get());
    }

    public function store(Request $request)
    {
        $this->handleJurusanMapping($request);

        $validator = Validator::make($request->all(), (new KelasRequest())->rules());
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        // Simpan data
        $kelas = $this->model->create($request->all());

        // LOAD relasi jurusan supaya yang dikirim ke React bukan ID saja
        return response()->json([
            'message' => 'Data Berhasil Ditambahkan',
            'data' => $kelas->load('jurusan') 
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->handleJurusanMapping($request);

        $validator = Validator::make($request->all(), (new KelasRequest())->rules());
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $kelas = $this->model->findOrFail($id);
        $kelas->update($request->all());

        // LOAD relasi supaya di tabel langsung berubah jadi nama
        return response()->json([
            'message' => 'Data Berhasil Diperbarui',
            'data' => $kelas->load('jurusan')
        ], 200);
    }

    private function handleJurusanMapping(Request $request)
    {
        $input = $request->jurusan_id;
        if ($input && !is_numeric($input)) {
            $jurusan = Jurusan::where('nama_jurusan', $input)->first();
            if ($jurusan) {
                $request->merge(['jurusan_id' => $jurusan->id]);
            }
        }
    }
}