<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie; 

class AuthController extends Controller
{
    /**
     * LOGIN (With Double Security Check)
     */
    public function login(Request $request)
    {
        // 1️⃣ Validasi Input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2️⃣ Cek Kredensial (Email & Password)
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah'
            ], 401);
        }

        $user = Auth::user();

        // 3️⃣ CEK DOUBLE VALIDATION (Users + Profile Status)
        
        // A. Cek Status Aktif Utama (Table Users)
        if (!$user->is_aktif) {
            Auth::logout();
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda belum diaktivasi. Hubungi admin.'
            ], 403);
        }

        // B. Cek Status Spesifik (Table Siswas / Gurus)
        if ($user->peran === 'siswa') {
            $siswa = $user->siswa; // Pastikan relasi 'siswa' sudah ada di model User
            if ($siswa && $siswa->status !== 'aktif' && !empty($siswa->status)) {
                $statusSiswa = strtoupper($siswa->status);
                Auth::logout();
                return response()->json([
                    'status' => 'error',
                    'message' => "Akses ditolak. Status akademik Anda: {$statusSiswa}."
                ], 403);
            }
        } 
        
        if ($user->peran === 'guru') {
            $guru = $user->guru; // Pastikan relasi 'guru' sudah ada di model User
            // Jika guru punya status resign/pensiun, blokir login
            if ($guru && in_array($guru->status, ['resign', 'pensiun', 'mutasi'])) {
                $statusGuru = strtoupper($guru->status);
                Auth::logout();
                return response()->json([
                    'status' => 'error',
                    'message' => "Akses ditolak. Status kepegawaian: {$statusGuru}."
                ], 403);
            }
        }

        // 4️⃣ Regenerate Session (Keamanan Stateful)
        $request->session()->regenerate();

        // 5️⃣ Create Cookies untuk Middleware Next.js
        $cookieLoggedIn = cookie(
            'is_logged_in',
            'true',
            60 * 24, // 1 hari
            '/',
            null,
            false,   // Secure: false untuk localhost 
            false    // httpOnly: false agar JS bisa baca
        );

        $cookiePeran = cookie(
            'peran',
            $user->peran,
            60 * 24,
            '/',
            null,
            false,
            false
        );

        return response()->json([
            'status' => 'success',
            'message' => "Selamat datang kembali, {$user->name}!",
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'peran' => $user->peran,
            ]
        ])
        ->withCookie($cookieLoggedIn)
        ->withCookie($cookiePeran);
    }

    /**
     * REGISTER (Siswa)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'nisn'     => 'required|string|unique:siswas', // Pakai nisn sesuai DB lo
            'jurusan_id' => 'required|exists:jurusans,id', // Sesuai kolom di DB
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'peran'    => 'siswa',
                'is_aktif' => false, // Harus diaktifkan via proses aktivasi/admin
            ]);

            // Buat data di table siswa
            $user->siswa()->create([
                'nisn'       => $request->nisn,
                'jurusan_id' => $request->jurusan_id,
                'status'     => null, // Default null karena nanti diatur lewat aktivasi
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar berhasil! Silakan lakukan aktivasi akun menggunakan NISN Anda.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mendaftar: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $forgetLoggedIn = Cookie::forget('is_logged_in');
        $forgetPeran = Cookie::forget('peran');

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ])
        ->withCookie($forgetLoggedIn)
        ->withCookie($forgetPeran);
    }

    /**
     * AKTIVASI USER (Admin Only)
     */
    public function aktivasiUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_aktif' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Akun ' . $user->name . ' sukses diaktifkan!'
        ]);
    }
}