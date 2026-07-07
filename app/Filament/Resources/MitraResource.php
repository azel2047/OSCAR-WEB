<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MitraResource\Pages;
use App\Models\Mitra;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MitraResource extends Resource
{
    protected static ?string $model = Mitra::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Mitra / Sponsor';

    protected static ?string $pluralModelLabel = 'Mitra';

    protected static ?string $modelLabel = 'Mitra';

    protected static string | \UnitEnum | null $navigationGroup = 'Konten Landing Page';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->required()
                            ->maxLength(255),
                        Grid::make(2)
                            ->schema([
                                Forms\Components\FileUpload::make('logo_upload')
                                    ->label('Pilih File Logo Lokal (Upload)')
                                    ->disk('public')
                                    ->directory('mitras')
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        if ($state) {
                                            $file = is_array($state) ? array_values($state)[0] : $state;
                                            if ($file instanceof \Livewire\Features\SupportFileUploads\TemporaryUploadedFile) {
                                                $set('logo_path', $file->getClientOriginalName());
                                            }
                                        } else {
                                            $set('logo_path', null);
                                        }
                                    })
                                    ->formatStateUsing(fn ($record) => ($record && $record->logo_path && !str_starts_with($record->logo_path, 'http')) ? $record->logo_path : null),
                                Forms\Components\TextInput::make('logo_path')
                                    ->label('Logo URL / Path')
                                    ->helperText('Jika Anda mengupload file lokal di sebelah kiri, path file akan otomatis disimpan pada kolom ini saat disimpan.')
                                    ->required()
                                    ->maxLength(255),
                            ])->columnSpanFull(),
                        Forms\Components\TextInput::make('website_url')
                            ->url()
                            ->maxLength(255),
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
                Tables\Columns\ImageColumn::make('logo_url')
                    ->label('Logo')
                    ->state(fn ($record) => $record->logo_url)
                    ->circular()
                    ->size(40),
                Tables\Columns\TextColumn::make('nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                Tables\Columns\TextColumn::make('website_url')
                    ->label('Website URL')
                    ->searchable()
                    ->url(fn ($record) => $record->website_url)
                    ->openUrlInNewTab()
                    ->placeholder('-')
                    ->color('primary')
                    ->icon('heroicon-o-link'),
                Tables\Columns\TextColumn::make('urutan')
                    ->label('Urutan Tampil')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
            ])
            ->defaultSort('urutan')
            ->filters([
                //
            ])
            ->actions([
                Actions\EditAction::make()
                    ->using(function (array $data, \Illuminate\Database\Eloquent\Model $record): \Illuminate\Database\Eloquent\Model {
                        if (isset($data['logo_upload']) && !empty($data['logo_upload'])) {
                            $data['logo_path'] = is_array($data['logo_upload']) 
                                ? array_values($data['logo_upload'])[0] 
                                : $data['logo_upload'];
                        }
                        unset($data['logo_upload']);
                        $record->update($data);
                        return $record;
                    }),
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
            'index' => Pages\ManageMitras::route('/'),
        ];
    }
}
