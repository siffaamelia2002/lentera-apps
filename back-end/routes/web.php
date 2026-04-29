<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Auth\SocialiteController;

// Route untuk redirect ke Sosmed
// Jangan arahkan ke /login! Gunakan /auth/...
// routes/web.php

// Tambahkan {provider} di dalam URL
Route::get('auth/{provider}', [SocialiteController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback']);


// CSRF Cookie (Wajib buat SPA/Next.js)
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['status' => 'ok']);
});

// AUTH (Tanpa prefix /api)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Halaman utama (Opsional, buat ngecek API idup)
Route::get('/', function () {
    return response()->json(['message' => 'Laravel API is running']);
});