<?php

namespace Database\Seeders;

use App\Models\Lomba;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Database\Seeder;

class PendaftaranSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'peserta')->get();
        $lombas = Lomba::all();

        foreach ($users->take(40) as $user) {
            if ($lombas->where('kategori', $user->kategori)->count() > 0) {
                $lomba = $lombas->where('kategori', $user->kategori)->random();
                if (!Pendaftaran::where('user_id', $user->id)->where('lomba_id', $lomba->id)->exists()) {
                    Pendaftaran::factory()->create([
                        'user_id'  => $user->id,
                        'lomba_id' => $lomba->id,
                    ]);
                }
            }
        }
    }
}
