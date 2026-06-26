<?php

namespace App\Filament\Resources\SeasonResource\Pages;

use App\Filament\Resources\SeasonResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSeason extends EditRecord
{
    protected static string $resource = SeasonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        \Log::info('mutateFormDataBeforeSave keys: ' . implode(', ', array_keys($data)));
        \Log::info('mutateFormDataBeforeSave foto_utama_upload:', ['val' => $data['foto_utama_upload'] ?? 'not_present']);
        \Log::info('mutateFormDataBeforeSave foto_utama:', ['val' => $data['foto_utama'] ?? 'not_present']);

        if (!empty($data['foto_utama_upload'])) {
            $data['foto_utama'] = is_array($data['foto_utama_upload']) 
                ? array_values($data['foto_utama_upload'])[0] 
                : $data['foto_utama_upload'];
            \Log::info('mutateFormDataBeforeSave set foto_utama to:', ['val' => $data['foto_utama']]);
        }
        unset($data['foto_utama_upload']);
        return $data;
    }
}
