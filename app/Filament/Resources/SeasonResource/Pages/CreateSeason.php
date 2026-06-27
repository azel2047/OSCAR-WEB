<?php

namespace App\Filament\Resources\SeasonResource\Pages;

use App\Filament\Resources\SeasonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSeason extends CreateRecord
{
    protected static string $resource = SeasonResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        unset($data['foto_utama_upload']);
        return $data;
    }
}
