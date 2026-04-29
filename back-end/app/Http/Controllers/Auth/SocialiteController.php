<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\Siswa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SocialiteController extends Controller
{
    /**
     * 1. Arahkan user ke halaman Google
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * 2. Terima data dari Google setelah user login
     */
    public function handleProviderCallback($provider)
    {
        try {
            $userSocial = Socialite::driver($provider)->user();
            
            // Gunakan Transaction agar jika salah satu insert gagal, database tetap bersih
            $user = DB::transaction(function () use ($userSocial, $provider) {
                $existingUser = User::where('email', $userSocial->getEmail())->first();

                if ($existingUser) {
                    // UPDATE: Jika user sudah ada
                    $existingUser->update([
                        'social_id'       => $userSocial->getId(),
                        'social_type'     => $provider,
                        'profile_picture' => $existingUser->profile_picture ?? $userSocial->getAvatar(),
                    ]);
                    return $existingUser;
                } else {
                    // CREATE: Jika user baru
                    $newUser = User::create([
                        'name'              => $userSocial->getName(),
                        'email'             => $userSocial->getEmail(),
                        'social_id'         => $userSocial->getId(),
                        'social_type'       => $provider,
                        'peran'             => 'siswa', // Default role
                        'is_aktif'          => true,
                        'profile_picture'   => $userSocial->getAvatar(),
                        'password'          => bcrypt(Str::random(16)),
                        'email_verified_at' => now(),
                    ]);

                    // Jika perannya siswa, buatkan entry di tabel siswas
                    if ($newUser->peran === 'siswa') {
                        Siswa::create([
                            'user_id' => $newUser->id,
                            'nisn'    => 'G-' . Str::random(8), // Placeholder NISN dari Google login
                        ]);
                    }

                    return $newUser;
                }
            });

            // Login-kan user
            Auth::login($user, true);

            // Logika Redirection Berdasarkan Peran
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            
            if ($user->peran === 'admin') {
                $targetPath = '/admin/dashboard';
            } else {
                // Guru dan Siswa diarahkan ke dashboard biasa
                $targetPath = '/dashboard';
            }

            return redirect($frontendUrl . $targetPath);

        } catch (\Exception $e) {
            Log::error('Socialite Login Error: ' . $e->getMessage());

            // Jika error disebabkan oleh Client Secret, pesan ini akan muncul di URL frontend
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/login?error=social_failed&msg=' . urlencode($e->getMessage()));
        }
    }
}