<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LombaResource\Pages;
use App\Models\Lomba;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class LombaResource extends Resource
{
    protected static ?string $model = Lomba::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-trophy';

    protected static ?string $navigationLabel = 'Cabang Lomba';

    protected static ?string $pluralModelLabel = 'Cabang Lomba';

    protected static ?string $modelLabel = 'Lomba';

    protected static string | \UnitEnum | null $navigationGroup = 'Manajemen Kompetisi';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Tabs::make('Lomba')
                    ->tabs([
                        Tab::make('Detail Kompetisi')
                            ->icon('heroicon-o-information-circle')
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
                                        Forms\Components\Select::make('kategori')
                                            ->options([
                                                'siswa' => 'Siswa SMA/SMK',
                                                'mahasiswa' => 'Mahasiswa',
                                                'umum' => 'Umum',
                                            ])
                                            ->required(),
                                    ]),
                                Grid::make(3)
                                    ->schema([
                                        Forms\Components\Select::make('status')
                                            ->options([
                                                'buka' => 'BUKA',
                                                'tutup' => 'TUTUP',
                                                'segera' => 'SEGERA',
                                                'habis' => 'HABIS',
                                            ])
                                            ->required()
                                            ->default('segera'),
                                        Forms\Components\DateTimePicker::make('deadline')
                                            ->label('Batas Pendaftaran')
                                            ->required(),
                                        Forms\Components\TextInput::make('kuota')
                                            ->numeric()
                                            ->label('Kuota Maksimal')
                                            ->helperText('0 untuk tanpa batas')
                                            ->default(0),
                                    ]),
                                Forms\Components\RichEditor::make('deskripsi')
                                    ->label('Deskripsi Lengkap Lomba')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),

                        Tab::make('Persyaratan & Aturan')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Forms\Components\RichEditor::make('persyaratan')
                                    ->label('Persyaratan Pendaftaran')
                                    ->columnSpanFull(),
                                Forms\Components\RichEditor::make('ketentuan')
                                    ->label('Ketentuan Teknis Lomba')
                                    ->columnSpanFull(),
                            ]),

                        Tab::make('Hadiah & Benefit')
                            ->icon('heroicon-o-gift')
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        Forms\Components\TextInput::make('hadiah_1')
                                            ->label('Hadiah Juara 1')
                                            ->maxLength(255),
                                        Forms\Components\TextInput::make('hadiah_2')
                                            ->label('Hadiah Juara 2')
                                            ->maxLength(255),
                                        Forms\Components\TextInput::make('hadiah_3')
                                            ->label('Hadiah Juara 3')
                                            ->maxLength(255),
                                    ]),
                                Forms\Components\Textarea::make('benefit')
                                    ->label('Benefit Tambahan Peserta')
                                    ->placeholder('Contoh: E-Sertifikat, Merchandise, Konsumsi')
                                    ->helperText('Pisahkan setiap benefit dengan tanda koma (,)')
                                    ->columnSpanFull(),
                            ]),

                        Tab::make('Berkas & Kolaborator')
                            ->icon('heroicon-o-folder-open')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        Forms\Components\FileUpload::make('booklet_upload')
                                            ->label('Unggah Booklet Lokal')
                                            ->disk('public')
                                            ->directory('booklets')
                                            ->dehydrated(false)
                                            ->reactive()
                                            ->afterStateUpdated(function ($state, callable $set) {
                                                if ($state) {
                                                    $file = is_array($state) ? array_values($state)[0] : $state;
                                                    if ($file instanceof \Livewire\Features\SupportFileUploads\TemporaryUploadedFile) {
                                                        $set('booklet_path', $file->getClientOriginalName());
                                                    }
                                                } else {
                                                    $set('booklet_path', null);
                                                }
                                            })
                                            ->formatStateUsing(fn ($record) => ($record && $record->booklet_path && !str_starts_with($record->booklet_path, 'http')) ? $record->booklet_path : null),
                                        Forms\Components\TextInput::make('booklet_path')
                                            ->label('Atau Tautan (URL) Booklet')
                                            ->dehydrateStateUsing(function ($state, $get) {
                                                $upload = $get('booklet_upload');
                                                if ($upload) {
                                                    return is_array($upload) ? array_values($upload)[0] : $upload;
                                                }
                                                return $state;
                                            })
                                            ->maxLength(255),
                                    ]),
                                Grid::make(2)
                                    ->schema([
                                        Forms\Components\FileUpload::make('banner_upload')
                                            ->label('Unggah Gambar Banner')
                                            ->disk('public')
                                            ->directory('banners')
                                            ->dehydrated(false)
                                            ->reactive()
                                            ->afterStateUpdated(function ($state, callable $set) {
                                                if ($state) {
                                                    $file = is_array($state) ? array_values($state)[0] : $state;
                                                    if ($file instanceof \Livewire\Features\SupportFileUploads\TemporaryUploadedFile) {
                                                        $set('banner_path', $file->getClientOriginalName());
                                                    }
                                                } else {
                                                    $set('banner_path', null);
                                                }
                                            })
                                            ->formatStateUsing(fn ($record) => ($record && $record->banner_path && !str_starts_with($record->banner_path, 'http')) ? $record->banner_path : null),
                                        Forms\Components\TextInput::make('banner_path')
                                            ->label('Atau Tautan (URL) Banner')
                                            ->dehydrateStateUsing(function ($state, $get) {
                                                $upload = $get('banner_upload');
                                                if ($upload) {
                                                    return is_array($upload) ? array_values($upload)[0] : $upload;
                                                }
                                                return $state;
                                            })
                                            ->maxLength(255),
                                    ]),

                                Forms\Components\Select::make('mitra')
                                    ->multiple()
                                    ->relationship('mitra', 'nama')
                                    ->preload()
                                    ->label('Pilih Mitra Terkait')
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('banner_url')
                    ->label('Banner')
                    ->state(fn ($record) => $record->banner_url)
                    ->circular()
                    ->size(40),
                Tables\Columns\TextColumn::make('nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                Tables\Columns\TextColumn::make('kategori')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'siswa' => 'info',
                        'mahasiswa' => 'warning',
                        'umum' => 'success',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'buka' => 'success',
                        'tutup' => 'danger',
                        'segera' => 'info',
                        'habis' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('deadline')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('terdaftar')
                    ->label('Terdaftar')
                    ->badge()
                    ->color(fn (Lomba $record): string => $record->isKuotaPenuh() ? 'danger' : 'success'),
                Tables\Columns\TextColumn::make('kuota')
                    ->label('Kuota')
                    ->formatStateUsing(fn ($state) => $state == 0 ? 'Tanpa Batas' : $state)
                    ->badge(fn ($state) => $state == 0)
                    ->color(fn ($state) => $state == 0 ? 'gray' : 'primary')
                    ->numeric(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('kategori')
                    ->options([
                        'siswa' => 'Siswa SMA/SMK',
                        'mahasiswa' => 'Mahasiswa',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'buka' => 'BUKA',
                        'tutup' => 'TUTUP',
                        'segera' => 'SEGERA',
                        'habis' => 'HABIS',
                    ]),
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
            'index' => Pages\ListLombas::route('/'),
            'create' => Pages\CreateLomba::route('/create'),
            'edit' => Pages\EditLomba::route('/{record}/edit'),
        ];
    }
}
