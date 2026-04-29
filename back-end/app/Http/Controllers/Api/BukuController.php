<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Http\Requests\BukuRequest;

class BukuController extends Controller
{
    public function index()
    {
        // FIX: Tambahkan 'penulis' dan 'penerbit' agar $appends di Model bisa terbaca!
        $buku = Buku::with(['kategori', 'media', 'penulis', 'penerbit'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $buku // Data dibungkus dalam key 'data'
        ]);
    }

    public function show($id)
    {
        // FIX: Tambahkan juga di sini agar saat detail dibuka, relasinya ikut terbawa
        $buku = Buku::with(['kategori', 'media', 'penulis', 'penerbit'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $buku
        ]);
    }

    public function store(BukuRequest $request)
    {
        $validated = $request->validated();
        $buku = Buku::create($validated);

        if ($request->hasFile('cover')) {
            $buku->addMediaFromRequest('cover')->toMediaCollection('cover');
        }

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil ditambahkan',
            'data' => $buku->load(['kategori', 'media', 'penulis', 'penerbit'])
        ], 201);
    }

    public function update(BukuRequest $request, $id)
    {
        $buku = Buku::findOrFail($id);
        $validated = $request->validated();

        $buku->update($validated);

        if ($request->hasFile('cover')) {
            $buku->clearMediaCollection('cover');
            $buku->addMediaFromRequest('cover')->toMediaCollection('cover');
        }

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diperbarui',
            'data' => $buku->load(['kategori', 'media', 'penulis', 'penerbit'])
        ]);
    }

    public function destroy($id)
    {
        $buku = Buku::findOrFail($id);
        
        $buku->clearMediaCollection('cover');
        $buku->delete();

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dihapus'
        ]);
    }
}