<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PengumumanResource\Pages;
use App\Models\Pengumuman;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PengumumanResource extends Resource
{
    protected static ?string $model = Pengumuman::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationLabel = 'Pengumuman';

    protected static ?string $pluralModelLabel = 'Pengumuman';

    protected static ?string $modelLabel = 'Pengumuman';

    protected static string | \UnitEnum | null $navigationGroup = 'Manajemen Informasi';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('judul')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('target')
                            ->options([
                                'semua' => 'Semua Peserta',
                                'siswa' => 'Siswa SMA/SMK',
                                'mahasiswa' => 'Mahasiswa',
                                'per_lomba' => 'Peserta Lomba Tertentu',
                            ])
                            ->required()
                            ->reactive(),
                        Forms\Components\Select::make('lomba_id')
                            ->relationship('lomba', 'nama')
                            ->label('Cabang Lomba')
                            ->visible(fn (callable $get) => $get('target') === 'per_lomba')
                            ->required(fn (callable $get) => $get('target') === 'per_lomba')
                            ->nullable(),
                        Forms\Components\DateTimePicker::make('publish_at')
                            ->label('Jadwal Publish')
                            ->default(now()),
                        Forms\Components\RichEditor::make('isi')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('kirim_email')
                            ->label('Kirim Email ke Target Peserta')
                            ->default(false),
                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('judul')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('target')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'semua' => 'success',
                        'siswa' => 'warning',
                        'mahasiswa' => 'info',
                        'per_lomba' => 'primary',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('lomba.nama')
                    ->label('Lomba')
                    ->placeholder('-')
                    ->sortable(),
                Tables\Columns\TextColumn::make('publish_at')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\IconColumn::make('kirim_email')
                    ->boolean()
                    ->label('Kirim E-mail'),
                Tables\Columns\IconColumn::make('email_sent')
                    ->boolean()
                    ->label('E-mail Terkirim'),
                Tables\Columns\TextColumn::make('createdBy.nama')
                    ->label('Dibuat Oleh'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('target')
                    ->options([
                        'semua' => 'Semua Peserta',
                        'siswa' => 'Siswa SMA/SMK',
                        'mahasiswa' => 'Mahasiswa',
                        'per_lomba' => 'Peserta Lomba Tertentu',
                    ]),
            ])
            ->actions([
                Actions\Action::make('kirimEmail')
                    ->label('Kirim E-mail')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('success')
                    ->visible(fn ($record) => $record->kirim_email && !$record->email_sent && $record->isPublished())
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        \App\Jobs\SendPengumumanEmail::dispatch($record);
                        
                        \Filament\Notifications\Notification::make()
                            ->title('Email pengumuman sedang dikirim!')
                            ->success()
                            ->send();
                    }),
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->with(['lomba', 'createdBy']);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManagePengumuman::route('/'),
        ];
    }
}
