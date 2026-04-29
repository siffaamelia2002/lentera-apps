<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CartItemController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Debug: Cek apakah user terdeteksi oleh Sanctum
            if (!$user) {
                Log::warning('Cart Access Attempt: User not authenticated');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. Silakan login ulang.'
                ], 401);
            }

            $items = CartItem::with(['buku.media'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $items
            ]);
        } catch (\Exception $e) {
            Log::error('Cart Index Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCount()
    {
        if (!Auth::check()) {
            return response()->json(['status' => 'success', 'count' => 0]);
        }
        
        $count = CartItem::where('user_id', Auth::id())->count();
        return response()->json(['status' => 'success', 'count' => $count]);
    }

    public function store(Request $request)
    {
        // DEBUG: Catat request yang masuk untuk tracking di storage/logs/laravel.log
        Log::info('Cart Store Request:', $request->all());

        // Validasi disesuaikan dengan Frontend (menerima 'jumlah' sebagai alias 'qty')
        $validator = Validator::make($request->all(), [
            'buku_id' => 'required|exists:bukus,id',
            'qty'     => 'nullable|integer|min:1',
            'jumlah'  => 'nullable|integer|min:1', // Tambahan agar cocok dengan BookCard.tsx
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
            }

            // Ambil nilai qty dari 'qty' atau 'jumlah' (mana yang isi)
            $quantityToAdd = $request->input('qty') ?? $request->input('jumlah') ?? 1;

            $cartItem = CartItem::where('user_id', $userId)
                                ->where('buku_id', $request->buku_id)
                                ->first();

            if ($cartItem) {
                $cartItem->increment('qty', $quantityToAdd);
            } else {
                CartItem::create([
                    'user_id' => $userId,
                    'buku_id' => $request->buku_id,
                    'qty'     => $quantityToAdd,
                ]);
            }

            return response()->json([
                'status' => 'success', 
                'message' => 'Buku berhasil ditambahkan ke keranjang', 
                'cart_count' => CartItem::where('user_id', $userId)->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Cart Store Exception: ' . $e->getMessage());
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal menyimpan ke keranjang: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
            $cartItem->update(['qty' => $request->qty]);
            return response()->json(['status' => 'success', 'message' => 'Jumlah berhasil diupdate']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal update: Data tidak ditemukan'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
            $cartItem->delete();
            return response()->json(['status' => 'success', 'message' => 'Item dihapus dari keranjang']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus: Data tidak ditemukan'], 404);
        }
    }
}