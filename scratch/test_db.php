<?php
include 'vendor/autoload.php';
$app = include 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$seasons = App\Models\Season::all();
foreach ($seasons as $s) {
    echo "ID: {$s->id}, Nama: {$s->nama}, Foto Utama Url: '{$s->foto_utama_url}'\n";
}
