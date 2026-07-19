<?php

namespace Database\Factories;

use App\Models\Lomba;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PendaftaranFactory extends Factory
{
    protected $model = Pendaftaran::class;

    public function definition(): array
    {
        $lomba    = Lomba::inRandomOrder()->first();
        $kategori = $lomba?->kategori ?? 'siswa';

        $dataPeserta = $kategori === 'siswa'
            ? [
                'nama_peserta_1' => $this->faker->name(),
                'nama_peserta_2' => $this->faker->name(),
                'nama_pendamping'=> 'Bapak/Ibu ' . $this->faker->lastName(),
                'asal_sekolah'   => 'SMA ' . $this->faker->company() . ' ' . $this->faker->city(),
                'no_wa'          => '0812' . $this->faker->numerify('########'),
                'email'          => $this->faker->safeEmail(),
                'tema'           => $this->faker->sentence(4),
            ]
            : [
                'nama_peserta_1'  => $this->faker->name(),
                'nama_peserta_2'  => $this->faker->name(),
                'nama_peserta_3'  => $this->faker->optional()->name(),
                'asal_universitas'=> 'Universitas ' . $this->faker->company(),
                'no_wa'           => '0812' . $this->faker->numerify('########'),
                'email'           => $this->faker->safeEmail(),
                'tema'            => $this->faker->sentence(4),
            ];

        return [
            'user_id'      => User::factory(),
            'lomba_id'     => $lomba?->id ?? 1,
            'status'       => $this->faker->randomElement(['pending', 'diverifikasi', 'ditolak']),
            'data_peserta' => $dataPeserta,
            'submitted_at' => now()->subDays($this->faker->numberBetween(1, 30)),
        ];
    }
}
