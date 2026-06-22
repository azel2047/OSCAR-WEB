<?php

namespace App\Filament\Widgets;

use App\Models\StatusHistory;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentActivityWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Log Aktivitas Pendaftaran Terbaru';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                StatusHistory::query()->with(['pendaftaran.user', 'pendaftaran.lomba', 'changedBy'])->latest('id')
            )
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i')
                    ->description(fn (StatusHistory $record): string => $record->created_at ? $record->created_at->diffForHumans() : '-')
                    ->sortable(),
                Tables\Columns\TextColumn::make('pendaftaran.nomor')
                    ->label('No. Pendaftaran')
                    ->placeholder('-')
                    ->searchable()
                    ->url(fn (StatusHistory $record): ?string => $record->pendaftaran_id ? route('filament.admin.resources.pendaftarans.view', ['record' => $record->pendaftaran_id]) : null),
                Tables\Columns\TextColumn::make('pendaftaran.user.nama')
                    ->label('Nama Pendaftar')
                    ->placeholder('-')
                    ->searchable(),
                Tables\Columns\TextColumn::make('pendaftaran.lomba.nama')
                    ->label('Cabang Lomba')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status Baru')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'diverifikasi' => 'success',
                        'ditolak' => 'danger',
                        default => 'warning',
                    }),
                Tables\Columns\TextColumn::make('keterangan')
                    ->label('Keterangan / Catatan Admin')
                    ->placeholder('-')
                    ->limit(50),
                Tables\Columns\TextColumn::make('changedBy.nama')
                    ->label('Oleh Admin')
                    ->placeholder('-'),
            ]);
    }
}
