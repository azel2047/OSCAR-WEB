<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@oscar.id'], [
            'nama'     => 'Admin OSCAR',
            'password' => bcrypt(env('ADMIN_PASSWORD', 'Admin@oscar3')),
            'role'     => 'admin',
            'kategori' => null,
        ]);
    }
}
