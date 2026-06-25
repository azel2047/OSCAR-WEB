<?php

namespace Database\Seeders;

use App\Models\SyaratBerkas;
use Illuminate\Database\Seeder;

class SyaratBerkasSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'key' => 'sosmed',
                'nama' => 'Bukti Follow Instagram Oscar 3.0',
                'deskripsi' => 'Wajib Unggah Screenshot',
                'url_target' => 'https://instagram.com/oscar.himati',
                'is_required' => true,
                'status' => 'aktif',
            ],
            [
                'key' => 'sosmed_hima',
                'nama' => 'Bukti Follow HIMA TI',
                'deskripsi' => 'Wajib Unggah Screenshot',
                'url_target' => 'https://instagram.com/himati.unpak',
                'is_required' => true,
                'status' => 'aktif',
            ],
            [
                'key' => 'twibbon',
                'nama' => 'Bukti Post Twibbon',
                'deskripsi' => 'Link media sosial atau screenshot',
                'url_target' => null,
                'is_required' => true,
                'status' => 'aktif',
            ],
            [
                'key' => 'follow_medpart',
                'nama' => 'Bukti Follow Media Partner',
                'deskripsi' => 'Wajib Unggah Screenshot',
                'url_target' => null,
                'is_required' => true,
                'status' => 'aktif',
            ],
            [
                'key' => 'follow_sponsor',
                'nama' => 'Bukti Follow Sponsor Resmi',
                'deskripsi' => 'Wajib Unggah Screenshot',
                'url_target' => null,
                'is_required' => true,
                'status' => 'aktif',
            ],
            [
                'key' => 'surat_izin',
                'nama' => 'Surat Izin Perlombaan',
                'deskripsi' => 'Format PDF/JPG/PNG, maks 1MB',
                'url_target' => null,
                'is_required' => true,
                'status' => 'aktif',
            ],
        ];

        foreach ($data as $item) {
            $item['is_required'] = $item['is_required'] ? \DB::raw('true') : \DB::raw('false');
            SyaratBerkas::updateOrCreate(['key' => $item['key']], $item);
        }
    }
}
