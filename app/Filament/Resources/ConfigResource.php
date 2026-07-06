<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConfigResource\Pages;
use App\Models\Config;
use Filament\Forms;
use Filament\Actions;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Tables;
use Filament\Tables\Table;

class ConfigResource extends Resource
{
    protected static ?string $model = Config::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Konfigurasi Sistem';

    protected static ?string $pluralModelLabel = 'Konfigurasi';

    protected static ?string $modelLabel = 'Konfigurasi';

    protected static string | \UnitEnum | null $navigationGroup = 'Sistem';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('key')
                            ->label('Kunci (Key)')
                            ->disabled()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('keterangan')
                            ->label('Keterangan / Fungsi')
                            ->disabled()
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('booklet_upload')
                            ->label('Unggah Booklet (PDF/Lokal)')
                            ->disk('public')
                            ->directory('booklets')
                            ->visible(fn ($record) => $record?->key === 'booklet_url')
                            ->reactive()
                            ->afterStateUpdated(function ($state, callable $set) {
                                if ($state) {
                                    $file = is_array($state) ? array_values($state)[0] : $state;
                                    if ($file instanceof \Livewire\Features\SupportFileUploads\TemporaryUploadedFile) {
                                        $set('value', $file->getClientOriginalName());
                                    } elseif (is_string($file)) {
                                        $set('value', basename($file));
                                    }
                                } else {
                                    $set('value', null);
                                }
                            })
                            ->formatStateUsing(fn ($record) => ($record && $record->key === 'booklet_url' && $record->value && !str_starts_with($record->value, 'http')) ? $record->value : null),
                        Forms\Components\Textarea::make('value')
                            ->label(fn ($record) => $record?->key === 'booklet_url' ? 'Atau Tautan (URL) Booklet' : 'Nilai Konfigurasi (Value)')
                            ->required(fn ($record) => $record?->key !== 'booklet_url')
                            ->rows(3)
                            ->columnSpanFull()
                            ->maxLength(1000)
                            ->dehydrated(fn ($get) => empty($get('booklet_upload'))),
                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('key')
                    ->label('Kunci (Key)')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('value')
                    ->label('Nilai (Value)')
                    ->limit(60)
                    ->searchable(),
                Tables\Columns\TextColumn::make('keterangan')
                    ->label('Keterangan')
                    ->limit(60)
                    ->searchable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Terakhir Diperbarui')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('key')
            ->filters([
                //
            ])
            ->actions([
                Actions\EditAction::make(),
            ])
            ->bulkActions([
                // No bulk actions for system configs
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageConfigs::route('/'),
        ];
    }
}
