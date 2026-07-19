<?php

namespace App\Filament\Resources\PengumumanResource\Pages;

use App\Filament\Resources\PengumumanResource;
use App\Models\User;
use App\Models\Notifikasi;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManagePengumuman extends ManageRecords
{
    protected static string $resource = PengumumanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->after(function ($record) {
                    // Send email if selected and published
                    if ($record->kirim_email && !$record->email_sent && $record->isPublished()) {
                        \App\Jobs\SendPengumumanEmail::dispatch($record);
                    }
                    
                    // Create notifications in app
                    $this->broadcastNotifikasi($record);
                }),
        ];
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = auth()->id();
        return $data;
    }

    private function broadcastNotifikasi($pengumuman): void
    {
        $query = User::where('role', 'peserta');

        if ($pengumuman->target === 'per_lomba') {
            $query->whereHas('pendaftaran', fn($q) =>
                $q->where('lomba_id', $pengumuman->lomba_id)
                  ->where('status', 'diverifikasi')
            );
        } elseif (in_array($pengumuman->target, ['siswa', 'mahasiswa'])) {
            $query->where('kategori', $pengumuman->target);
        }

        $users = $query->pluck('id');

        $notifikasi = $users->map(fn($uid) => [
            'user_id'      => $uid,
            'judul'        => '[Pengumuman] ' . $pengumuman->judul,
            'pesan'        => strip_tags($pengumuman->isi),
            'tipe'         => 'info',
            'related_type' => 'pengumuman',
            'related_id'   => $pengumuman->id,
            'created_at'   => now(),
            'updated_at'   => now(),
        ])->toArray();

        foreach (array_chunk($notifikasi, 500) as $chunk) {
            Notifikasi::insert($chunk);
        }
    }
}
