<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Mail\GlobalLibraMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AccountActivationController extends Controller
{
    /**
     * TAHAP 1: Cek NIP/NISN & Kelayakan Status
     */
    public function check(Request $request)
    {
        $request->validate(['identity_number' => 'required|string']);
        $number = $request->identity_number;

        $siswa = Siswa::where('nisn', $number)->first();
        $guru = Guru::where('nip', $number)->first();
        $owner = $siswa ?: $guru;

        if (!$owner) {
            return response()->json([
                'status' => 'error', 
                'message' => 'NIP atau NISN tidak terdaftar di sistem.'
            ], 404);
        }

        // Cek Status di tabel Siswa/Guru
        if ($siswa && $siswa->status !== 'aktif' && !empty($siswa->status)) {
            return response()->json([
                'status' => 'error', 
                'message' => "Aktivasi ditolak. Status Siswa: ".strtoupper($siswa->status)
            ], 403);
        }
        
        if ($guru && in_array($guru->status, ['resign', 'pensiun', 'mutasi'])) {
            return response()->json([
                'status' => 'error', 
                'message' => "Aktivasi ditolak. Status Guru: ".strtoupper($guru->status)
            ], 403);
        }

        $user = User::find($owner->user_id);
        
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Data user tidak ditemukan.'], 404);
        }

        if ($user->is_aktif) {
            return response()->json([
                'status' => 'already_active', 
                'message' => "Akun ".strtoupper($user->peran)." {$user->name} sudah aktif."
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Identitas ditemukan: {$user->name}",
            'data' => [
                'id' => $user->id, 
                'name' => $user->name, 
                'role' => $user->peran
            ]
        ]);
    }

    /**
     * TAHAP 2: Simpan Email & Kirim Link Verifikasi
     */
    public function sendActivationEmail(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'email' => 'required|email|unique:users,email,' . $request->user_id,
        ]);

        try {
            DB::beginTransaction();

            $user = User::findOrFail($request->user_id);
            $token = Str::random(64);

            // Simpan token verifikasi
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                ['token' => $token, 'created_at' => now()]
            );

            // Update email calon user
            $user->update(['email' => $request->email]);

            $url = "http://localhost:3000/activation/verify?token={$token}&email=" . urlencode($request->email);

            // Kirim Email (Dark Emerald Theme)
            Mail::to($request->email)->send(new GlobalLibraMail(
                'Verifikasi Aktivasi Akun LIBRA',
                'emails.activation',
                ['user' => $user, 'url' => $url]
            ));

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Link verifikasi telah dikirim ke email: {$request->email}"
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses aktivasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * TAHAP 3: Simpan Password & Langsung Aktifkan Akun
     */
    public function finalizeActivation(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        // 1. Validasi Token
        $reset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$reset) {
            return response()->json(['status' => 'error', 'message' => 'Link tidak valid.'], 400);
        }

        // 2. Ambil User berdasarkan email
        $user = User::where('email', $request->email)->first();
        
        DB::beginTransaction();
        try {
            // 3. SET PASSWORD + AKTIFKAN USER (is_aktif = true)
            $user->update([
                'password' => Hash::make($request->password),
                'is_aktif' => true,                 // 🔥 Langsung Aktif
                'email_verified_at' => now(),       // 🔥 Langsung Terverifikasi
            ]);

            // 4. Hapus token agar tidak bisa disalahgunakan
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            DB::commit();

            return response()->json([
                'status' => 'success', 
                'message' => 'Aktivasi berhasil! Akun Anda sudah aktif, silakan login.'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal mengaktifkan akun.'
            ], 500);
        }
    }
}