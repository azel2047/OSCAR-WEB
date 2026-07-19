<?php

namespace App\Jobs;

use App\Mail\PengumumanEmail;
use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendPengumumanEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 120;

    public function __construct(public Pengumuman $pengumuman) {}

    public function handle(): void
    {
        $query = User::where('role', 'peserta');

        if ($this->pengumuman->target === 'per_lomba') {
            $query->whereHas('pendaftaran', fn($q) =>
                $q->where('lomba_id', $this->pengumuman->lomba_id)
                  ->where('status', 'diverifikasi')
            );
        } elseif (in_array($this->pengumuman->target, ['siswa', 'mahasiswa'])) {
            $query->where('kategori', $this->pengumuman->target);
        }

        $query->chunk(100, function ($users) {
            foreach ($users as $user) {
                Mail::to($user->email)
                    ->queue(new PengumumanEmail($this->pengumuman, $user));
            }
        });

        $this->pengumuman->update(['email_sent' => true]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("SendPengumumanEmail gagal: " . $exception->getMessage(), [
            'pengumuman_id' => $this->pengumuman->id,
        ]);
    }
}
