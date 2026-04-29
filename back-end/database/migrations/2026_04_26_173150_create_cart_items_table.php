<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('buku_id')
                  ->constrained('bukus')
                  ->cascadeOnDelete();

            $table->integer('qty')->default(1);

            $table->timestamps();

            // 🔥 biar 1 user gak bisa add buku yg sama 2x
            $table->unique(['user_id', 'buku_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};