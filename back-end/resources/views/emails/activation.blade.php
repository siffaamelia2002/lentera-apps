@extends('emails.layout')

@section('content')
    <h1 class="title">Verifikasi Akun <span style="color: #6366f1;">Berhasil</span></h1>
    <p class="subtitle">Navigasi Transaksi & Reservasi Arsip</p>

    <div style="background-color: #0f172a; border-left: 4px solid #6366f1; padding: 20px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <p style="color: #475569; font-size: 10px; font-weight: 900; margin: 0 0 8px 0; text-transform: uppercase; tracking-spacing: 0.2em;">Data Identitas Node:</p>
        <h3 style="color: #ffffff; margin: 0; font-size: 20px; font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em;">{{ $user->name }}</h3>
        <div style="margin-top: 10px; display: flex; align-items: center;">
            <span style="color: #6366f1; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">Level Akses: {{ $user->peran }}</span>
        </div>
    </div>

    <p class="text" style="color: #94a3b8; line-height: 1.8;">
        Halo <b>{{ $user->name }}</b>, gerbang akses identitas kamu telah terverifikasi dalam sistem **LENTERA**. Silakan buat kata sandi baru untuk mengaktifkan sinkronisasi akun sepenuhnya.
    </p>

    <div class="btn-wrapper" style="margin-top: 40px;">
        <a href="{{ $url }}" class="btn" style="background-color: #6366f1; color: #ffffff; padding: 15px 30px; border-radius: 15px; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; display: inline-block; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);">
            Buat Password Baru
        </a>
    </div>

    <p style="margin-top: 40px; color: #475569; font-size: 10px; text-align: center; font-style: italic;">
        LENTERA System Notification • {{ date('Y') }}
    </p>
@endsection