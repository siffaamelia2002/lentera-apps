@extends('emails.layout')

@section('content')
    <h1 class="title">Aktivasi Akun <span style="color: #10b981;">Berhasil</span></h1>
    <p class="subtitle">Digital Library & Inventory</p>

    <div style="background-color: #0f172a; border-left: 4px solid #10b981; padding: 20px; border-radius: 15px; margin-bottom: 30px;">
        <p style="color: #64748b; font-size: 10px; font-weight: 900; margin: 0 0 5px 0; text-transform: uppercase;">Profil Penerima:</p>
        <h3 style="color: #ffffff; margin: 0; font-size: 18px;">{{ $user->name }}</h3>
        <p style="color: #10b981; font-size: 10px; font-weight: 900; margin: 5px 0 0 0; text-transform: uppercase;">Role: {{ $user->peran }}</p>
    </div>

    <p class="text">
        Halo <b>{{ $user->name }}</b>, identitas kamu telah terverifikasi. Silakan buat password baru untuk mengaktifkan akun kamu sepenuhnya di LIBRA.
    </p>

    <div class="btn-wrapper">
        <a href="{{ $url }}" class="btn">Buat Password Baru</a>
    </div>
@endsection