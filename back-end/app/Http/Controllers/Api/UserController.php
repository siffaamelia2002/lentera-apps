<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $peran = $request->query('peran');

        $query = User::with(['siswa.kelas', 'siswa.jurusan', 'guru'])->latest();

        if ($peran) {
            $query->where('peran', $peran);
        }

        return response()->json($query->get());
    }

    // ===============================
    // 🔥 STORE (FIX TOTAL)
    // ===============================
    public function store(Request $request)
    {
        // 🔥 VALIDASI GLOBAL
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'nullable|email|unique:users,email',
            'password' => 'nullable|min:6',
            'peran'    => ['nullable', Rule::in(['admin', 'siswa', 'guru'])],
        ]);

        $peran = $request->peran ?? 'siswa';

        // 🔥 VALIDASI KHUSUS SISWA
        if ($peran === 'siswa') {
            $request->validate([
                'nisn'       => 'required|string|unique:siswas,nisn',
                // Perbaikan nama tabel menjadi kelases dan jurusans
                'kelas_id'   => 'required|exists:kelases,id',
                'jurusan_id' => 'required|exists:jurusans,id',
                'status'     => 'nullable|in:aktif,nonaktif,lulus,pindah,keluar',
                'tanggal_lulus_atau_keluar' => 'nullable|date',
            ]);
        }

        try {
            $user = DB::transaction(function () use ($request, $peran) {

                $password = $request->filled('password')
                    ? Hash::make($request->password)
                    : null;
                
                // Set is_aktif 0 jika status bukan aktif
                $status = $request->status ?? 'aktif';
                $isAktif = in_array($status, ['lulus', 'pindah', 'keluar', 'nonaktif']) ? 0 : 1;

                $user = User::create([
                    'name'     => $request->name,
                    'email'    => $request->email ?? null,
                    'password' => $password,
                    'peran'    => $peran,
                    'is_aktif' => $isAktif,
                ]);

                // 🔥 SISWA WAJIB ADA DATA
                if ($peran === 'siswa') {
                    Siswa::create([
                        'user_id'    => $user->id,
                        'nisn'       => $request->nisn, 
                        'kelas_id'   => $request->kelas_id,
                        'jurusan_id' => $request->jurusan_id,
                        'status'     => in_array($status, ['lulus', 'pindah', 'keluar']) ? $status : null,
                        'tanggal_lulus_atau_keluar' => in_array($status, ['lulus', 'pindah', 'keluar']) ? $request->tanggal_lulus_atau_keluar : null,
                    ]);
                }

                return $user;
            });

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dibuat!',
                'data'    => $user->load(['siswa.kelas', 'siswa.jurusan']),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ===============================
    // 🔥 UPDATE (FIX TOTAL)
    // ===============================
    public function update(Request $request, $id)
    {
        $user = User::with('siswa')->findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|min:6',
            'peran'    => ['nullable', Rule::in(['admin', 'siswa', 'guru'])],
        ]);

        $peran = $request->peran ?? $user->peran;

        // 🔥 VALIDASI SISWA
        if ($peran === 'siswa') {
            $request->validate([
                'nisn'       => [
                    'required',
                    'string',
                    Rule::unique('siswas')->ignore(optional($user->siswa)->id),
                ],
                // Perbaikan nama tabel menjadi kelases dan jurusans
                'kelas_id'   => 'required|exists:kelases,id',
                'jurusan_id' => 'required|exists:jurusans,id',
                'status'     => 'nullable|in:aktif,nonaktif,lulus,pindah,keluar',
                'tanggal_lulus_atau_keluar' => 'nullable|date',
            ]);
        }

        try {
            DB::transaction(function () use ($request, $user, $peran) {
                
                $status = $request->status ?? 'aktif';
                $isAktif = in_array($status, ['lulus', 'pindah', 'keluar', 'nonaktif']) ? 0 : 1;

                $user->fill([
                    'name'     => $request->name,
                    'email'    => $request->email ?? $user->email,
                    'peran'    => $peran,
                    'is_aktif' => $isAktif,
                ]);

                if ($request->filled('password')) {
                    $user->password = Hash::make($request->password);
                }

                $user->save();

                if ($peran === 'siswa') {
                    Siswa::updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'nisn'       => $request->nisn,
                            'kelas_id'   => $request->kelas_id,
                            'jurusan_id' => $request->jurusan_id,
                            'status'     => in_array($status, ['lulus', 'pindah', 'keluar']) ? $status : null,
                            'tanggal_lulus_atau_keluar' => in_array($status, ['lulus', 'pindah', 'keluar']) ? $request->tanggal_lulus_atau_keluar : null,
                        ]
                    );
                }

            });

            return response()->json([
                'success' => true,
                'message' => 'Data diperbarui!',
                'data'    => $user->fresh(['siswa.kelas', 'siswa.jurusan']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:8|confirmed',
    ]);

    $user = $request->user();

    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'message' => 'Password lama tidak sesuai'
        ], 422);
    }

    $user->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json(['message' => 'Password updated']);
}
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'User dihapus!'
        ]);
    }
}