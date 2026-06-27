<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SeasonResource\Pages;
use App\Models\Season;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class SeasonResource extends Resource
{
    protected static ?string $model = Season::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-archive-box';

    protected static ?string $navigationLabel = 'Dokumentasi Season';

    protected static ?string $pluralModelLabel = 'Dokumentasi Season';

    protected static ?string $modelLabel = 'Season';

    protected static string | \UnitEnum | null $navigationGroup = 'Manajemen Kompetisi';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Informasi Season')
                    ->description('Detail identitas season kompetisi OSCAR')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Forms\Components\TextInput::make('nama')
                                    ->required()
                                    ->maxLength(255)
                                    ->reactive()
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true),
                                Forms\Components\TextInput::make('tema')
                                    ->required()
                                    ->placeholder('Contoh: Rainforest')
                                    ->maxLength(255),
                            ]),
                        Forms\Components\RichEditor::make('deskripsi')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\RichEditor::make('cerita')
                            ->label('Cerita Season (Aftermovie Text)')
                            ->columnSpanFull(),
                    ]),

                Section::make('Statistik & Media Utama')
                    ->description('Pengaturan tahun pelaksanaan, statistik pencapaian, dan foto/video utama')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Forms\Components\TextInput::make('tahun')
                                    ->numeric()
                                    ->required()
                                    ->default(date('Y')),
                                Forms\Components\TextInput::make('video_url')
                                    ->label('URL Video (YouTube)')
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('urutan')
                                    ->numeric()
                                    ->default(0),
                            ]),
                        Grid::make(2)
                            ->schema([
                                Group::make([
                                Forms\Components\FileUpload::make('foto_utama_upload')
                                    ->label('Upload Foto Utama Lokal')
                                    ->disk('public')
                                    ->directory('seasons')
                                    ->live()
                                    ->saveUploadedFileUsing(function (\Livewire\Features\SupportFileUploads\TemporaryUploadedFile $file, callable $set) {
                                        $path = $file->store('seasons', 'public');
                                        \Log::info('saveUploadedFileUsing FOTO UTAMA:', ['path' => $path]);
                                        $set('foto_utama', $path);
                                        return $path;
                                    }),
                                Forms\Components\TextInput::make('foto_utama')
                                    ->label('Path Foto Utama / URL')
                                    ->helperText('Jika Anda mengupload foto utama lokal, path file akan otomatis disimpan pada kolom ini saat disimpan.')
                                    ->maxLength(255),
                                ]),
                                Group::make([
                                    Grid::make(3)
                                        ->schema([
                                            Forms\Components\TextInput::make('jml_peserta')
                                                ->numeric()
                                                ->label('Jumlah Peserta')
                                                ->default(0),
                                            Forms\Components\TextInput::make('jml_lomba')
                                                ->numeric()
                                                ->label('Jumlah Lomba')
                                                ->default(0),
                                            Forms\Components\TextInput::make('jml_mitra')
                                                ->numeric()
                                                ->label('Jumlah Sponsor')
                                                ->default(0),
                                        ]),
                                ]),
                            ]),
                    ]),

                Section::make('Galeri Season')
                    ->description('Kumpulan foto dokumentasi untuk season ini')
                    ->schema([
                        Forms\Components\FileUpload::make('bulk_upload')
                            ->label('Unggah Banyak Foto Sekaligus (Bulk Upload)')
                            ->disk('public')
                            ->directory('galeri')
                            ->multiple()
                            ->dehydrated(false)
                            ->reactive()
                            ->default([])
                            ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                if (!is_array($state)) {
                                    return;
                                }

                                $currentGaleri = $get('galeri') ?? [];
                                $maxUrutan = count($currentGaleri) > 0 
                                    ? max(array_column($currentGaleri, 'urutan')) 
                                    : 0;

                                foreach ($state as $file) {
                                    $maxUrutan++;
                                    $currentGaleri[] = [
                                        'path_upload' => [$file],
                                        'path' => $file->getClientOriginalName(),
                                        'caption' => null,
                                        'urutan' => $maxUrutan,
                                    ];
                                }

                                $set('galeri', $currentGaleri);
                                $set('bulk_upload', []);
                            }),

                        Forms\Components\Repeater::make('galeri')
                            ->relationship('galeri')
                            ->mutateRelationshipDataBeforeCreateUsing(function (array $data): array {
                                unset($data['path_upload']);
                                return $data;
                            })
                            ->mutateRelationshipDataBeforeSaveUsing(function (array $data): array {
                                unset($data['path_upload']);
                                return $data;
                            })
                            ->schema([
                                Forms\Components\FileUpload::make('path_upload')
                                    ->label('Upload Gambar Lokal')
                                    ->disk('public')
                                    ->directory('galeri')
                                    ->live()
                                    ->saveUploadedFileUsing(function (\Livewire\Features\SupportFileUploads\TemporaryUploadedFile $file, callable $set) {
                                        $path = $file->store('galeri', 'public');
                                        $set('path', $path);
                                        return $path;
                                    }),
                                Forms\Components\TextInput::make('path')
                                    ->label('Path Gambar / URL')
                                    ->helperText('Jika Anda mengupload file lokal, path file akan otomatis disimpan pada kolom ini saat disimpan.')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('caption')
                                    ->label('Keterangan Gambar')
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('urutan')
                                    ->numeric()
                                    ->default(0),
                            ])
                            ->columns(2)
                            ->columnSpanFull()
                            ->createItemButtonLabel('Tambah Foto ke Galeri'),
                    ])->collapsible(),

                Section::make('Daftar Pemenang')
                    ->description('Pemenang dari setiap cabang lomba pada season ini')
                    ->schema([
                        Forms\Components\Repeater::make('pemenang')
                            ->relationship('pemenang')
                            ->schema([
                                Forms\Components\TextInput::make('nama_lomba')
                                    ->label('Cabang Lomba')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('juara_1')
                                    ->label('Juara 1')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('juara_2')
                                    ->label('Juara 2')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('juara_3')
                                    ->label('Juara 3')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('urutan')
                                    ->numeric()
                                    ->default(0),
                            ])
                            ->columns(5)
                            ->columnSpanFull()
                            ->createItemButtonLabel('Tambah Pemenang Lomba'),
                    ])->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('foto_utama_url')
                    ->label('Foto Utama')
                    ->state(fn ($record) => $record->foto_utama_url)
                    ->circular()
                    ->size(40),
                Tables\Columns\TextColumn::make('nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                Tables\Columns\TextColumn::make('tema')
                    ->searchable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('tahun')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
                Tables\Columns\TextColumn::make('jml_peserta')
                    ->label('Peserta (Statistik)')
                    ->numeric(),
                Tables\Columns\TextColumn::make('jml_lomba')
                    ->label('Lomba (Statistik)')
                    ->numeric(),
                Tables\Columns\TextColumn::make('jml_mitra')
                    ->label('Mitra (Statistik)')
                    ->numeric(),
                Tables\Columns\TextColumn::make('urutan')
                    ->label('Urutan')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
            ])
            ->defaultSort('urutan')
            ->filters([
                //
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSeasons::route('/'),
            'create' => Pages\CreateSeason::route('/create'),
            'edit' => Pages\EditSeason::route('/{record}/edit'),
        ];
    }
}
