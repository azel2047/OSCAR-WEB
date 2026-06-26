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
        if (!empty($data['foto_utama_upload'])) {
            $data['foto_utama'] = is_array($data['foto_utama_upload']) 
                ? array_values($data['foto_utama_upload'])[0] 
                : $data['foto_utama_upload'];
        }
        unset($data['foto_utama_upload']);
        return $data;
    }
}
