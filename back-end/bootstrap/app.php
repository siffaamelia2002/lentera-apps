<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // 1. 🔥 FIX UTAMA: Kecualikan CSRF untuk rute API
        // Ini yang bikin error 419 hilang saat Next.js POST ke Laravel
        $middleware->validateCsrfTokens(except: [
            'api/*', 
            'api/activation/*' 
        ]);

        // 2. Cookie Encryption
        $middleware->encryptCookies(
            except: [
                'is_logged_in',
                'peran',
            ]
        );

        // 3. Sanctum (Wajib buat integrasi Stateful dengan Next.js)
        $middleware->statefulApi();

        // 4. Alias Middleware Role
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class, 
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();