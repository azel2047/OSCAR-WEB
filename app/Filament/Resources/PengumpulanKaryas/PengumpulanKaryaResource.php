<?php

namespace App\Filament\Resources\PengumpulanKaryas;

use App\Filament\Resources\PengumpulanKaryas\Pages\ManagePengumpulanKaryas;
use App\Models\PengumpulanKarya;
use Filament\Forms;
use Filament\Actions\ViewAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

class PengumpulanKaryaResource extends Resource
{
    protected static ?string $model = PengumpulanKarya::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-arrow-up-tray';

    protected static ?string $navigationLabel = 'Pengumpulan Karya';

    protected static ?string $pluralModelLabel = 'Pengumpulan Karya';

    protected static ?string $modelLabel = 'Pengumpulan Karya';

    protected static string | \UnitEnum | null $navigationGroup = 'Manajemen Kompetisi';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Informasi Utama Pengumpulan')
                    ->description('Detail nomor registrasi, cabang lomba, nama pendaftar, email, dan nomor HP')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Forms\Components\Placeholder::make('lomba_nama')
                                    ->label('Cabang Lomba')
                                    ->content(fn ($record) => $record?->lomba?->nama ?? '-'),
                                Forms\Components\Placeholder::make('pendaftaran_nomor')
                                    ->label('Nomor Pendaftaran')
                                    ->content(fn ($record) => $record?->pendaftaran?->nomor ?? '-'),
                                Forms\Components\Placeholder::make('user_nama')
                                    ->label('Nama Pendaftar')
                                    ->content(fn ($record) => $record?->user?->nama ?? '-'),
                            ]),
                        Grid::make(3)
                            ->schema([
                                Forms\Components\Placeholder::make('email')
                                    ->label('Email Pengirim')
                                    ->content(fn ($record) => $record?->email ?? '-'),
                                Forms\Components\Placeholder::make('no_hp')
                                    ->label('No. HP Peserta')
                                    ->content(fn ($record) => $record?->no_hp ?? '-'),
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Tanggal Submit')
                                    ->content(fn ($record) => $record?->created_at?->format('d M Y H:i') ?? '-'),
                            ]),
                        Forms\Components\Placeholder::make('tema_lomba')
                            ->label('Tema Lomba yang Diikuti')
                            ->content(fn ($record) => $record?->tema_lomba ?? '-'),
                    ]),

                Section::make('Isi Dokumen & Detail Karya')
                    ->description('Detail isian form kustom karya berdasarkan cabang lomba')
                    ->schema([
                        Forms\Components\Placeholder::make('data_karya')
                            ->label('')
                            ->content(function ($record) {
                                if (!$record || !$record->data_karya) return 'Tidak ada data.';
                                $html = '<div class="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-5 font-sans">';
                                foreach ($record->data_karya as $key => $val) {
                                    $label = ucwords(str_replace('_', ' ', $key));
                                    if (filter_var($val, FILTER_VALIDATE_URL)) {
                                        $valStr = "<a href='{$val}' target='_blank' class='text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold'>{$val} <svg style='width:12px;height:12px;display:inline-block;vertical-align:middle;' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'></path></svg></a>";
                                    } else {
                                        $valStr = e($val);
                                    }
                                    $html .= "<div class='border-b border-gray-100 pb-2'><strong class='text-gray-600 block text-xs uppercase tracking-wide'>{$label}</strong> <span class='text-gray-900 text-sm'>{$valStr}</span></div>";
                                }
                                $html .= '</div>';
                                return new HtmlString($html);
                            })
                    ]),

                Section::make('File Lampiran')
                    ->description('Berkas pendukung seperti bukti screenshot Instagram')
                    ->schema([
                        Forms\Components\Placeholder::make('file_screenshot')
                            ->label('Bukti Postingan Instagram')
                            ->content(function ($record) {
                                if (!$record || !$record->file_screenshot) return 'Tidak ada / Bukan kategori Infografis & Poster';
                                
                                $isImage = str_ends_with(strtolower($record->file_screenshot), '.jpg') || 
                                           str_ends_with(strtolower($record->file_screenshot), '.jpeg') || 
                                           str_ends_with(strtolower($record->file_screenshot), '.png') ||
                                           str_contains(strtolower($record->file_screenshot), 'image/');
                                
                                $previewHtml = '';
                                if ($isImage) {
                                    $previewHtml = "
                                        <div class='mb-3 relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 shadow-sm transition-all hover:shadow' style='max-width: 320px;'>
                                            <a href='{$record->file_screenshot}' target='_blank' class='block cursor-zoom-in'>
                                                <img src='{$record->file_screenshot}' alt='Bukti Instagram' class='w-full object-contain mx-auto' style='max-height: 240px; min-height: 120px;' />
                                            </a>
                                        </div>";
                                }

                                return new HtmlString("
                                    <div class='flex flex-col gap-1'>
                                        {$previewHtml}
                                        <div>
                                            <a href='{$record->file_screenshot}' target='_blank' class='inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 font-semibold text-xs tracking-wide transition-colors'>
                                                <svg style='width: 14px; height: 14px; display: inline-block; vertical-align: middle;' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'></path>
                                                </svg>
                                                <span>BUKA SCREENSHOT INSTAGRAM</span>
                                            </a>
                                        </div>
                                    </div>");
                            })
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('pendaftaran.nomor')
                    ->label('No. Pendaftaran')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('user.nama')
                    ->label('Nama Akun')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                Tables\Columns\TextColumn::make('lomba.nama')
                    ->label('Cabang Lomba')
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email Pengirim')
                    ->searchable(),
                Tables\Columns\TextColumn::make('no_hp')
                    ->label('No. HP')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Submit')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('lomba_id')
                    ->relationship('lomba', 'nama')
                    ->label('Cabang Lomba'),
            ])
            ->actions([
                ViewAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePengumpulanKaryas::route('/'),
        ];
    }
}
