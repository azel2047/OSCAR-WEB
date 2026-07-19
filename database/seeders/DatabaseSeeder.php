<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            MitraSeeder::class,
            LombaSeeder::class,
            TimelineSeeder::class,
            SeasonSeeder::class,
            ConfigSeeder::class,
            SyaratBerkasSeeder::class,
        ]);

        if (app()->isLocal()) {
            $this->call([
                UserSeeder::class,
                PendaftaranSeeder::class,
            ]);
        }
    }
}
