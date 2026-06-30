<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — OSCAR 3.0 SPA Catch-All
|--------------------------------------------------------------------------
| Semua request non-API diteruskan ke React SPA.
| React Router menangani routing di sisi client.
*/

Route::get('/debug-logs-secret-xyz', function () {
    $customPath = storage_path('logs/custom_debug.log');
    $laravelPath = storage_path('logs/laravel.log');
    
    $out = "=== CUSTOM DEBUG LOG ===\n";
    if (file_exists($customPath)) {
        $out .= implode("\n", array_slice(file($customPath), -100));
    } else {
        $out .= "No custom debug log file found.\n";
    }
    
    $out .= "\n\n=== LARAVEL LOG ===\n";
    if (file_exists($laravelPath)) {
        $out .= implode("\n", array_slice(file($laravelPath), -100));
    } else {
        $out .= "No laravel log file found.\n";
    }
    
    return response($out)->header('Content-Type', 'text/plain');
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|admin|debug-logs-secret-xyz).*$');
