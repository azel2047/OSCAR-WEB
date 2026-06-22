<?php

namespace App\Filament\Resources\PendaftaranResource\Pages;

use App\Filament\Resources\PendaftaranResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPendaftaran extends ViewRecord
{
    protected static string $resource = PendaftaranResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Action Terima
            Actions\Action::make('terima_detail')
                ->label('Terima Pendaftaran')
                ->color('success')
                ->icon('heroicon-o-check')
                ->visible(fn () => $this->record->status === 'pending')
                ->requiresConfirmation()
                ->form([
                    \Filament\Forms\Components\Textarea::make('catatan')
                        ->label('Catatan Tambahan (Opsional)')
                        ->placeholder('Masukkan grup WhatsApp lomba atau info lainnya...')
                ])
                ->action(function (array $data) {
                    $record = $this->record;
                    \DB::transaction(function () use ($record, $data) {
                        $record->update([
                            'status' => 'diverifikasi',
                            'catatan_admin' => $data['catatan'],
                            'verified_at' => now(),
                            'verified_by' => auth()->id(),
                        ]);

                        \App\Models\StatusHistory::create([
                            'pendaftaran_id' => $record->id,
                            'status' => 'diverifikasi',
                            'keterangan' => $data['catatan'] ?? 'Diverifikasi oleh admin',
                            'changed_by' => auth()->id(),
                        ]);

                        \App\Models\Notifikasi::create([
                            'user_id' => $record->user_id,
                            'judul' => 'Pendaftaran Diverifikasi',
                            'pesan' => "Selamat! Pendaftaran Anda untuk {$record->lomba->nama} telah diverifikasi.",
                            'tipe' => 'success',
                            'related_type' => 'pendaftaran',
                            'related_id' => $record->id,
                        ]);
                    });

                    try {
                        \Illuminate\Support\Facades\Mail::to($record->user->email)
                            ->queue(new \App\Mail\PendaftaranDiverifikasiEmail($record));
                    } catch (\Exception $e) {
                        // Ignore
                    }

                    \Filament\Notifications\Notification::make()
                        ->title('Pendaftaran berhasil diverifikasi!')
                        ->success()
                        ->send();

                    // Refresh model data in the form view
                    $this->refreshFormData(['status', 'catatan_admin', 'verified_by', 'verified_at']);
                }),

            // Action Tolak
            Actions\Action::make('tolak_detail')
                ->label('Tolak Pendaftaran')
                ->color('danger')
                ->icon('heroicon-o-x-mark')
                ->visible(fn () => $this->record->status === 'pending')
                ->requiresConfirmation()
                ->form([
                    \Filament\Forms\Components\Textarea::make('catatan')
                        ->label('Alasan Penolakan (Wajib)')
                        ->placeholder('Sebutkan alasan penolakan atau berkas yang salah...')
                        ->required()
                ])
                ->action(function (array $data) {
                    $record = $this->record;
                    \DB::transaction(function () use ($record, $data) {
                        $record->update([
                            'status' => 'ditolak',
                            'catatan_admin' => $data['catatan'],
                            'verified_at' => now(),
                            'verified_by' => auth()->id(),
                        ]);

                        \App\Models\StatusHistory::create([
                            'pendaftaran_id' => $record->id,
                            'status' => 'ditolak',
                            'keterangan' => $data['catatan'],
                            'changed_by' => auth()->id(),
                        ]);

                        \App\Models\Notifikasi::create([
                            'user_id' => $record->user_id,
                            'judul' => 'Pendaftaran Ditolak',
                            'pesan' => "Pendaftaran Anda untuk {$record->lomba->nama} ditolak. Alasan: {$data['catatan']}",
                            'tipe' => 'error',
                            'related_type' => 'pendaftaran',
                            'related_id' => $record->id,
                        ]);
                    });

                    try {
                        \Illuminate\Support\Facades\Mail::to($record->user->email)
                            ->queue(new \App\Mail\PendaftaranDitolakEmail($record));
                    } catch (\Exception $e) {
                        // Ignore
                    }

                    \Filament\Notifications\Notification::make()
                        ->title('Pendaftaran berhasil ditolak!')
                        ->danger()
                        ->send();

                    // Refresh model data in the form view
                    $this->refreshFormData(['status', 'catatan_admin', 'verified_by', 'verified_at']);
                }),
        ];
    }
}
