<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PendaftaranResource\Pages;
use App\Models\Pendaftaran;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

class PendaftaranResource extends Resource
{
    protected static ?string $model = Pendaftaran::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Pendaftaran Peserta';

    protected static ?string $pluralModelLabel = 'Pendaftaran';

    protected static ?string $modelLabel = 'Pendaftaran';

    protected static string | \UnitEnum | null $navigationGroup = 'Manajemen Kompetisi';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        $makeBerkasPlaceholder = function (string $key, string $label, string $method, string $buttonText, string $color) {
            return Forms\Components\Placeholder::make($key)
                ->label($label)
                ->content(function ($record) use ($method, $buttonText, $color) {
                    $berkas = $record?->$method();
                    if (!$berkas) return 'Belum diunggah / Tidak ada';
                    
                    $isImage = $berkas->mime_type && str_starts_with($berkas->mime_type, 'image/');
                    $previewHtml = '';
                    if ($isImage) {
                        $previewHtml = "
                            <div class='mb-3 relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 shadow-sm transition-all hover:shadow' style='max-width: 320px;'>
                                <a href='{$berkas->url}' target='_blank' class='block cursor-zoom-in'>
                                    <img src='{$berkas->url}' alt='{$berkas->nama_asli}' class='w-full object-contain mx-auto' style='max-height: 240px; min-height: 120px;' />
                                </a>
                            </div>";
                    }

                    $bgClass = $color === 'emerald' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50';

                    return new HtmlString("
                        <div class='flex flex-col gap-1'>
                            {$previewHtml}
                            <div>
                                <a href='{$berkas->url}' target='_blank' class='inline-flex items-center gap-1.5 px-3 py-1.5 rounded {$bgClass} font-semibold text-xs tracking-wide transition-colors'>
                                    <svg style='width: 14px; height: 14px; display: inline-block; vertical-align: middle;' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'></path>
                                    </svg>
                                    <span>{$buttonText}</span>
                                </a>
                            </div>
                        </div>");
                });
        };

        return $schema
            ->schema([
                Section::make('Informasi Utama Pendaftaran')
                    ->description('Detail nomor registrasi, status, identitas pendaftar, dan cabang lomba')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Forms\Components\TextInput::make('nomor')
                                    ->disabled()
                                    ->label('Nomor Pendaftaran'),
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'diverifikasi' => 'Diverifikasi',
                                        'ditolak' => 'Ditolak',
                                    ])
                                    ->disabled()
                                    ->required(),
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Tanggal Submit')
                                    ->content(fn ($record) => $record?->created_at?->format('d M Y H:i') ?? '-'),
                            ]),
                        Grid::make(3)
                            ->schema([
                                Forms\Components\Placeholder::make('user_nama')
                                    ->label('Nama Pendaftar')
                                    ->content(fn ($record) => $record?->user?->nama ?? '-'),
                                Forms\Components\Placeholder::make('user_email')
                                    ->label('Email Pendaftar')
                                    ->content(fn ($record) => $record?->user?->email ?? '-'),
                                Forms\Components\Placeholder::make('lomba_nama')
                                    ->label('Cabang Lomba')
                                    ->content(fn ($record) => $record?->lomba?->nama ?? '-'),
                            ]),
                    ]),

                Section::make('Berkas & Dokumen Verifikasi')
                    ->description('Unduh atau buka bukti administrasi yang diunggah peserta')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                $makeBerkasPlaceholder('bukti_transfer', 'Bukti Pembayaran / Transfer', 'berkasTransfer', 'BUKA BUKTI TRANSFER', 'emerald'),
                                $makeBerkasPlaceholder('bukti_sosmed', 'Bukti Follow Instagram Oscar 3.0', 'berkasSosmed', 'BUKA BUKTI INSTAGRAM', 'blue'),
                                $makeBerkasPlaceholder('bukti_sosmed_hima', 'Bukti Follow HIMA TI', 'berkasSosmedHima', 'BUKA BUKTI FOLLOW HIMA TI', 'blue'),
                                $makeBerkasPlaceholder('bukti_twibbon', 'Bukti Post Twibbon', 'berkasTwibbon', 'BUKA BUKTI TWIBBON', 'blue'),
                                $makeBerkasPlaceholder('bukti_follow_medpart', 'Bukti Follow Media Partner', 'berkasFollowMedpart', 'BUKA BUKTI FOLLOW MEDPART', 'blue'),
                                $makeBerkasPlaceholder('bukti_follow_sponsor', 'Bukti Follow Sponsor Resmi', 'berkasFollowSponsor', 'BUKA BUKTI FOLLOW SPONSOR', 'blue'),
                            ]),
                    ]),

                Section::make('Hasil Keputusan & Riwayat Admin')
                    ->description('Status persetujuan terakhir serta admin yang memproses')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Forms\Components\Placeholder::make('verified_by')
                                    ->label('Diverifikasi Oleh')
                                    ->content(fn ($record) => $record?->verifiedBy?->nama ?? '-'),
                                Forms\Components\Placeholder::make('verified_at')
                                    ->label('Waktu Verifikasi')
                                    ->content(fn ($record) => $record?->verified_at?->format('d M Y H:i') ?? '-'),
                            ]),
                        Forms\Components\Placeholder::make('catatan_admin')
                            ->label('Catatan Keputusan Terakhir')
                            ->content(fn ($record) => $record?->catatan_admin ?? '-'),
                    ]),

                Section::make('Isi Formulir Pendaftaran Peserta')
                    ->description('Detail isian form kustom peserta berdasarkan cabang lomba')
                    ->schema([
                        Forms\Components\Placeholder::make('data_peserta')
                            ->label('')
                            ->content(function ($record) {
                                if (!$record || !$record->data_peserta) return 'Tidak ada data.';
                                $html = '<div class="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-5 font-sans">';
                                foreach ($record->data_peserta as $key => $val) {
                                    $label = ucwords(str_replace('_', ' ', $key));
                                    if (is_array($val)) {
                                        $valStr = implode(', ', $val);
                                    } else {
                                        $valStr = e($val);
                                    }
                                    $html .= "<div class='border-b border-gray-100 pb-2'><strong class='text-gray-600 block text-xs uppercase tracking-wide'>{$label}</strong> <span class='text-gray-900 text-sm'>{$valStr}</span></div>";
                                }
                                $html .= '</div>';
                                return new HtmlString($html);
                            })
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nomor')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->copyable()
                    ->copyMessage('Nomor pendaftaran disalin!'),
                Tables\Columns\TextColumn::make('user.nama')
                    ->label('Nama Pendaftar')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                Tables\Columns\TextColumn::make('user.kategori')
                    ->label('Tingkat')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'siswa' => 'info',
                        'mahasiswa' => 'warning',
                        default => 'gray',
                    })
                    ->placeholder('-')
                    ->sortable(),
                Tables\Columns\TextColumn::make('lomba.nama')
                    ->label('Cabang Lomba')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->icon(fn (string $state): string => match ($state) {
                        'pending' => 'heroicon-m-clock',
                        'diverifikasi' => 'heroicon-m-check-circle',
                        'ditolak' => 'heroicon-m-x-circle',
                        default => 'heroicon-m-question-mark-circle',
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'diverifikasi' => 'success',
                        'ditolak' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Daftar')
                    ->dateTime('d M Y H:i')
                    ->description(fn (Pendaftaran $record): string => $record->created_at ? $record->created_at->diffForHumans() : '-')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'diverifikasi' => 'Diverifikasi',
                        'ditolak' => 'Ditolak',
                    ]),
                Tables\Filters\SelectFilter::make('lomba_id')
                    ->relationship('lomba', 'nama')
                    ->label('Cabang Lomba'),
            ])
            ->actions([
                Actions\ViewAction::make(),
                // Custom Action untuk Terima Pendaftaran
                Actions\Action::make('terima')
                    ->label('Terima')
                    ->color('success')
                    ->icon('heroicon-o-check')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('catatan')
                            ->label('Catatan Tambahan (Opsional)')
                            ->placeholder('Masukkan grup WhatsApp lomba atau info lainnya...')
                    ])
                    ->action(function ($record, array $data) {
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

                        // Kirim email
                        try {
                            \Illuminate\Support\Facades\Mail::to($record->user->email)
                                ->queue(new \App\Mail\PendaftaranDiverifikasiEmail($record));
                        } catch (\Exception $e) {
                            // Silently ignore mail errors in dev env
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('Pendaftaran berhasil diverifikasi!')
                            ->success()
                            ->send();
                    }),
                // Custom Action untuk Tolak Pendaftaran
                Actions\Action::make('tolak')
                    ->label('Tolak')
                    ->color('danger')
                    ->icon('heroicon-o-x-mark')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('catatan')
                            ->label('Alasan Penolakan (Wajib)')
                            ->placeholder('Sebutkan alasan penolakan atau berkas yang salah...')
                            ->required()
                    ])
                    ->action(function ($record, array $data) {
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

                        // Kirim email
                        try {
                            \Illuminate\Support\Facades\Mail::to($record->user->email)
                                ->queue(new \App\Mail\PendaftaranDitolakEmail($record));
                        } catch (\Exception $e) {
                            // Silently ignore mail errors in dev env
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('Pendaftaran berhasil ditolak!')
                            ->danger()
                            ->send();
                    }),
            ])
            ->bulkActions([
                // No bulk actions for registrations
            ]);
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->with(['user', 'lomba']);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPendaftarans::route('/'),
            'view' => Pages\ViewPendaftaran::route('/{record}'),
        ];
    }
}
