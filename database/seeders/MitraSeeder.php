<?php

namespace Database\Seeders;

use App\Models\Mitra;
use Illuminate\Database\Seeder;

class MitraSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama' => 'Google Cloud', 'logo_path' => 'https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg', 'website_url' => 'https://cloud.google.com', 'urutan' => 1],
            ['nama' => 'Supabase', 'logo_path' => 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg', 'website_url' => 'https://supabase.com', 'urutan' => 2],
            ['nama' => 'Laravel', 'logo_path' => 'https://www.vectorlogo.zone/logos/laravel/laravel-icon.svg', 'website_url' => 'https://laravel.com', 'urutan' => 3],
        ];

        foreach ($items as $item) {
            Mitra::updateOrCreate(['nama' => $item['nama']], $item);
        }
    }
}
