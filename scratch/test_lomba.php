<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$lomba = \App\Models\Lomba::first();
$resource = new \App\Http\Resources\LombaResource($lomba);
$request = \Illuminate\Http\Request::create('/api/lomba', 'GET');

print_r($resource->toArray($request));
