<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SyaratBerkasResource\Pages;
use App\Models\SyaratBerkas;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class SyaratBerkasResource extends Resource
{
    protected static ?string $model = SyaratBerkas::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-check';

    protected static ?string $navigationLabel = 'Persyaratan Berkas';

    protected static ?string $pluralModelLabel = 'Persyaratan Berkas';

    protected static ?string $modelLabel = 'Syarat Berkas';

    protected static string | \UnitEnum | null $navigationGroup = 'Manajemen Kompetisi';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->label('Nama Persyaratan')
                            ->placeholder('Contoh: Bukti Follow Instagram Oscar 3.0')
                            ->required()
                            ->maxLength(150)
                            ->reactive()
                            ->afterStateUpdated(function ($state, callable $set, $context) {
                                if ($context === 'create') {
                                    $set('key', Str::slug($state, '_'));
                                }
                            }),
                        Forms\Components\TextInput::make('key')
                            ->label('Kode Unik / Key')
                            ->placeholder('Contoh: sosmed_sponsor_a')
                            ->required()
                            ->maxLength(50)
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9_]+$/')
                            ->helperText('Hanya huruf kecil, angka, dan underscore. Digunakan sebagai pengenal file.'),
                        Forms\Components\TextInput::make('deskripsi')
                            ->label('Deskripsi Petunjuk')
                            ->placeholder('Contoh: Wajib Unggah Screenshot / File PDF')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('url_target')
                            ->label('Tautan Target / URL Akun (Opsional)')
                            ->placeholder('Contoh: https://instagram.com/akun_sponsor')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('file_template')
                            ->label('Berkas Template / Unduhan (Opsional)')
                            ->directory('syarat-berkas-templates')
                            ->maxSize(2048)
                            ->helperText('Bila ada berkas template yang perlu diunduh peserta (PDF, DOCX, dll)'),
                        Forms\Components\Toggle::make('is_required')
                            ->label('Wajib Diunggah')
                            ->default(true),
                        Forms\Components\Select::make('status')
                            ->options([
                                'aktif' => 'Aktif',
                                'nonaktif' => 'Nonaktif',
                            ])
                            ->required()
                            ->default('aktif'),
                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                Tables\Columns\TextColumn::make('key')
                    ->fontFamily('mono')
                    ->color('gray')
                    ->searchable(),
                Tables\Columns\TextColumn::make('url_target')
                    ->label('Target URL')
                    ->limit(30)
                    ->placeholder('-'),
                Tables\Columns\IconColumn::make('is_required')
                    ->boolean()
                    ->label('Wajib'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'aktif' => 'success',
                        'nonaktif' => 'danger',
                        default => 'gray',
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'aktif' => 'Aktif',
                        'nonaktif' => 'Nonaktif',
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageSyaratBerkas::route('/'),
        ];
    }
}
