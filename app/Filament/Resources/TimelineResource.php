<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TimelineResource\Pages;
use App\Models\Timeline;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TimelineResource extends Resource
{
    protected static ?string $model = Timeline::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-calendar';

    protected static ?string $navigationLabel = 'Timeline Global';

    protected static ?string $pluralModelLabel = 'Timeline';

    protected static ?string $modelLabel = 'Timeline';

    protected static string | \UnitEnum | null $navigationGroup = 'Konten Landing Page';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\DatePicker::make('tanggal')
                            ->required(),
                        Forms\Components\TextInput::make('waktu')
                            ->placeholder('Contoh: 09:00 WIB atau 23:59 WITA')
                            ->maxLength(50),
                        Forms\Components\TextInput::make('keterangan')
                            ->maxLength(255),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Tahap Aktif Saat Ini')
                            ->default(false),
                        Forms\Components\TextInput::make('urutan')
                            ->numeric()
                            ->default(0),
                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('tanggal')
                    ->date('d M Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('waktu'),
                Tables\Columns\TextColumn::make('keterangan')
                    ->limit(30),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Aktif'),
                Tables\Columns\TextColumn::make('urutan')
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageTimelines::route('/'),
        ];
    }
}
