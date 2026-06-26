<?php

namespace Database\Seeders;

use App\Models\Lomba;
use Illuminate\Database\Seeder;

class LombaSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama'=>'Web Development',    'slug'=>'web-development',    'kategori'=>'siswa',      'kuota'=>50,  'hadiah_1'=>'Rp 1.500.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 1.000.000 + Sertifikat', 'hadiah_3'=>'Rp 750.000 + Sertifikat'],
            ['nama'=>'Desain Poster',      'slug'=>'desain-poster',      'kategori'=>'siswa',      'kuota'=>100, 'hadiah_1'=>'Rp 1.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 750.000 + Sertifikat',   'hadiah_3'=>'Rp 500.000 + Sertifikat'],
            ['nama'=>'Desain Infografis',  'slug'=>'desain-infografis',  'kategori'=>'siswa',      'kuota'=>100, 'hadiah_1'=>'Rp 1.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 750.000 + Sertifikat',   'hadiah_3'=>'Rp 500.000 + Sertifikat'],
            ['nama'=>'Capture The Flag',   'slug'=>'ctf',                'kategori'=>'siswa',      'kuota'=>30,  'hadiah_1'=>'Rp 2.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 1.500.000 + Sertifikat', 'hadiah_3'=>'Rp 1.000.000 + Sertifikat'],
            ['nama'=>'Desain UI/UX',       'slug'=>'desain-ui-ux',       'kategori'=>'mahasiswa',  'kuota'=>50,  'hadiah_1'=>'Rp 2.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 1.500.000 + Sertifikat', 'hadiah_3'=>'Rp 1.000.000 + Sertifikat'],
        ];

        foreach ($items as $item) {
            Lomba::updateOrCreate(['slug' => $item['slug']], array_merge($item, [
                'status'   => 'buka',
                'deadline' => now()->addDays(45),
                'surat_izin_path' => 'https://docs.google.com/document/d/1Xy_Jz-zF8_dummy_template/edit?usp=sharing'
            ]));
        }
    }
}
