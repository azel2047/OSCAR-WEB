<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — OSCAR 3.0 SPA Catch-All
|--------------------------------------------------------------------------
| Semua request non-API diteruskan ke React SPA.
| React Router menangani routing di sisi client.
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|admin).*$');
