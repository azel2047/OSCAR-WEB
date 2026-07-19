<?php

namespace App\Filament\Resources\SeasonResource\Pages;

use App\Filament\Resources\SeasonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSeason extends CreateRecord
{
    protected static string $resource = SeasonResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
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
