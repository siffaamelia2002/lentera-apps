<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // Tambahkan 'api/activation/*' atau 'activation/*' tergantung struktur route lu
    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie', 
        'login', 
        'logout',
        'activation/*', // Izinkan akses ke grup route aktivasi
    ],

    'allowed_methods' => ['*'],

    // Pastikan port ini sesuai dengan Next.js lu (biasanya 3000)
    'allowed_origins' => ['http://localhost:3000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];