<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    echo "Sending test mail to azelxiteer@gmail.com...\n";
    Mail::raw('Test content from OSCAR 3.0', function($message) {
        $message->to('azelxiteer@gmail.com')->subject('OSCAR 3.0 Test SMTP');
    });
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
