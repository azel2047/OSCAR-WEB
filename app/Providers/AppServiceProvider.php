<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Validation\Events\Failed::class,
            function ($event) {
                $logPath = storage_path('logs/custom_debug.log');
                $msg = date('Y-m-d H:i:s') . " - Validation Failed for " . get_class($event->validator) . "\n";
                $msg .= "Rules: " . json_encode($event->rules) . "\n";
                $msg .= "Errors: " . json_encode($event->errors) . "\n";
                file_put_contents($logPath, $msg, FILE_APPEND);
            }
        );
    }
}
