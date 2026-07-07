<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$c = App\Models\Config::find('booklet_url');
$res = $c->update(['value' => 'booklets/test_eloquent.pdf']);
echo "Update result: " . ($res ? 'SUCCESS' : 'FAILED') . "\n";
print_r(App\Models\Config::find('booklet_url')?->toArray());

// Revert it
$c->update(['value' => '/booklet-oscar3.pdf']);





