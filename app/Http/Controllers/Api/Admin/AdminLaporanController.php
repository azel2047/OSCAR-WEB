<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lomba;
use App\Models\Pendaftaran;
use App\Traits\ApiResponse;

class AdminLaporanController extends Controller
{
    use ApiResponse;

    public function ringkasan()
    {
        $totalRegistered = Pendaftaran::count();
        $totalVerified = Pendaftaran::where('status', 'diverifikasi')->count();
        $totalPending = Pendaftaran::where('status', 'pending')->count();
        $totalRejected = Pendaftaran::where('status', 'ditolak')->count();

        $byKategori = [
            'siswa' => Pendaftaran::whereHas('lomba', fn($q) => $q->where('kategori', 'siswa'))->count(),
            'mahasiswa' => Pendaftaran::whereHas('lomba', fn($q) => $q->where('kategori', 'mahasiswa'))->count(),
        ];

        $byLomba = Lomba::withCount([
            'pendaftaran as total',
            'pendaftaran as verified' => fn($q) => $q->where('status', 'diverifikasi'),
            'pendaftaran as pending' => fn($q) => $q->where('status', 'pending'),
            'pendaftaran as rejected' => fn($q) => $q->where('status', 'ditolak'),
        ])->get()->map(fn($l) => [
            'id' => $l->id,
            'nama' => $l->nama,
            'slug' => $l->slug,
            'total' => $l->total,
            'verified' => $l->verified,
            'pending' => $l->pending,
            'rejected' => $l->rejected,
        ]);

        return $this->success([
            'overview' => [
                'total_pendaftaran' => $totalRegistered,
                'diverifikasi'      => $totalVerified,
                'pending'           => $totalPending,
                'ditolak'           => $totalRejected,
            ],
            'kategori' => $byKategori,
            'lomba'    => $byLomba,
        ]);
    }
}
