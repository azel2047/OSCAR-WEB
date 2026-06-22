<?php

namespace Database\Seeders;

use App\Models\Season;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    public function run(): void
    {
        $seasons = [
            [
                'nama'        => 'OSCAR 1.0',
                'slug'        => 'oscar-1-0',
                'tema'        => 'Digital Revolution',
                'tahun'       => 2022,
                'deskripsi'   => 'Season perdana OSCAR yang menjadi cikal bakal kompetisi tahunan.',
                'jml_peserta' => 150,
                'jml_lomba'   => 3,
                'jml_mitra'   => 5,
                'urutan'      => 1,
            ],
            [
                'nama'        => 'OSCAR 2.0',
                'slug'        => 'oscar-2-0',
                'tema'        => 'Future Technology',
                'tahun'       => 2024,
                'deskripsi'   => 'Season kedua dengan peserta lebih dari dua kali lipat season pertama.',
                'jml_peserta' => 320,
                'jml_lomba'   => 4,
                'jml_mitra'   => 8,
                'urutan'      => 2,
            ],
            [
                'nama'        => 'OSCAR 3.0',
                'slug'        => 'oscar-3-0',
                'tema'        => 'Rainforest',
                'tahun'       => 2026,
                'deskripsi'   => 'Season terbaru dengan tema alam dan teknologi berkelanjutan.',
                'jml_peserta' => 0,
                'jml_lomba'   => 4,
                'jml_mitra'   => 0,
                'urutan'      => 3,
            ],
        ];

        foreach ($seasons as $s) {
            Season::updateOrCreate(['slug' => $s['slug']], $s);
        }
    }
}
