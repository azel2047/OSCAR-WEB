<?php

namespace Database\Seeders;

use App\Models\Config as ConfigModel;
use Illuminate\Database\Seeder;

class ConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            ['key'=>'booklet_url',       'value'=>'',                      'keterangan'=>'URL download booklet utama'],
            ['key'=>'wa_humas',          'value'=>'+6281234567890',         'keterangan'=>'Nomor WhatsApp humas'],
            ['key'=>'ig_handle',         'value'=>'@oscar_official',        'keterangan'=>'Handle Instagram OSCAR'],
            ['key'=>'email_kontak',      'value'=>'info@oscar.id',          'keterangan'=>'Email kontak panitia'],
            ['key'=>'pendaftaran_open',  'value'=>'1',                      'keterangan'=>'Global toggle pendaftaran (1=buka, 0=tutup)'],
            ['key'=>'hero_tagline',      'value'=>'Explore. Create. Excel.','keterangan'=>'Tagline hero section'],
            ['key'=>'hero_subtagline',   'value'=>'Olimpiade Sains Camputer dan Rekayasa — Season Rainforest', 'keterangan'=>'Sub tagline hero'],
            ['key'=>'sponsor_text',      'value'=>'Didukung oleh',          'keterangan'=>'Label section sponsor'],
        ];

        foreach ($configs as $c) {
            ConfigModel::updateOrCreate(['key' => $c['key']], $c);
        }
    }
}
