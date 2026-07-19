<?php

namespace Database\Seeders;

use App\Models\Timeline;
use Illuminate\Database\Seeder;

class TimelineSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama'=>'Pendaftaran Dibuka',    'tanggal'=>'2026-05-01', 'urutan'=>1, 'is_active'=>false],
            ['nama'=>'Batas Pendaftaran',     'tanggal'=>'2026-06-30', 'urutan'=>2, 'is_active'=>true],
            ['nama'=>'Verifikasi Berkas',     'tanggal'=>'2026-07-05', 'urutan'=>3, 'is_active'=>false],
            ['nama'=>'Pengumuman Peserta',    'tanggal'=>'2026-07-10', 'urutan'=>4, 'is_active'=>false],
            ['nama'=>'Pelaksanaan Lomba',     'tanggal'=>'2026-07-20', 'urutan'=>5, 'is_active'=>false],
            ['nama'=>'Pengumuman Pemenang',   'tanggal'=>'2026-07-25', 'urutan'=>6, 'is_active'=>false],
            ['nama'=>'Awarding Ceremony',     'tanggal'=>'2026-08-01', 'urutan'=>7, 'is_active'=>false],
        ];

        foreach ($items as $item) {
            Timeline::updateOrCreate(['nama' => $item['nama']], $item);
        }
    }
}
