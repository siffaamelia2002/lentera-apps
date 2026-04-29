<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BukuController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DendaController;
use App\Http\Controllers\Api\JurusanController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\KategoriDendaController;
use App\Http\Controllers\Api\KelasController;
use App\Http\Controllers\Api\PeminjamanController;
use App\Http\Controllers\Api\PenerbitController;
use App\Http\Controllers\Api\PenulisController;
use App\Http\Controllers\Api\SiswaController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccountActivationController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\PengembalianController;
// Route spesifik untuk alur aktivasi



// URL tanpa awalan 'api/'

Route::post('/activation/check', [AccountActivationController::class, 'check']);
Route::post('/activation/send-email', [AccountActivationController::class, 'sendActivationEmail']);
Route::post('/activation/finalize', [AccountActivationController::class, 'finalizeActivation']);
/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

// Buku & Kategori dibuat public supaya Katalog bisa muncul di awal
Route::get('/buku', [BukuController::class, 'index']);
Route::get('/buku/{buku}', [BukuController::class, 'show']);
Route::get('/kategori', [KategoriController::class, 'index']);
Route::get('/kategori/{kategori}', [KategoriController::class, 'show']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Wajib Login / Auth Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // --- AUTH & USER ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()->load(['siswa', 'guru']), 
        ]);
    });
    Route::match(['put', 'patch'], '/users/{id}', [UserController::class, 'update']);


    Route::apiResource('users', UserController::class);
    // --- CART (KERANJANG) ---
    Route::get('/cart/count', [CartItemController::class, 'getCount']);
    Route::get('/cart-items', [CartItemController::class, 'index']);
    Route::post('/cart-items', [CartItemController::class, 'store']);
    Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);

Route::get('/admindashboard', [AdminDashboardController::class, 'index']);
    // Route untuk dashboard user
    Route::get('/dashboard/user', [DashboardController::class, 'index']);
    Route::get('/denda', [DendaController::class, 'index']);
    // --- PEMINJAMAN ---
    Route::get('/peminjaman', [PeminjamanController::class, 'index']);
    Route::post('/peminjaman', [PeminjamanController::class, 'store']);
    Route::put('/peminjaman/{id}', [PeminjamanController::class, 'update']);
    Route::delete('/peminjaman/{id}', [PeminjamanController::class, 'destroy']);
    Route::put('/peminjaman/{id}/status', [PeminjamanController::class, 'updateStatus']);

Route::put('user/change-password', [UserController::class, 'changePassword']);

Route::get('/pengembalian', [PengembalianController::class, 'index']);
Route::get('/pengembalian/{id}', [PengembalianController::class, 'show']);
Route::put('/pengembalian/{id}', [PengembalianController::class, 'update']);
    // --- MANAJEMEN DENDA ---
Route::get('/denda', [DendaController::class, 'index']);
Route::put('/denda/{id}', [DendaController::class, 'update']);
    // --- MASTER DATA (KHUSUS ADMIN/GURU) ---
    // Buku (Write Access)
    Route::post('buku', [BukuController::class, 'store']);
    Route::post('buku/bulk-delete', [BukuController::class, 'bulkDelete']);
    Route::post('buku/update-with-image/{id}', [BukuController::class, 'update']); 
    Route::put('buku/{buku}', [BukuController::class, 'update']);
    Route::delete('buku/{buku}', [BukuController::class, 'destroy']);

    // Kategori (Write Access)
    Route::post('kategori', [KategoriController::class, 'store']);
    Route::post('kategori/bulk-delete', [KategoriController::class, 'bulkDelete']);
    Route::put('kategori/{kategori}', [KategoriController::class, 'update']);
    Route::delete('kategori/{kategori}', [KategoriController::class, 'destroy']);

    // Jurusan & Kelas
    Route::post('jurusan/bulk-delete', [JurusanController::class, 'bulkDelete']);
    Route::apiResource('jurusan', JurusanController::class);
    Route::post('kelas/bulk-delete', [KelasController::class, 'bulkDelete']);
    Route::apiResource('kelas', KelasController::class);

    // Siswa
    Route::post('siswa/bulk-delete', [SiswaController::class, 'bulkDelete']);
    Route::apiResource('siswa', SiswaController::class);

    // Lainnya
    Route::apiResource('penulis', PenulisController::class);
    Route::apiResource('penerbit', PenerbitController::class);
    Route::apiResource('kategori-denda', KategoriDendaController::class);
});