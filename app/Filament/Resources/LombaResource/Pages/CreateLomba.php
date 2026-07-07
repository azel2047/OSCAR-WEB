<?php

namespace App\Filament\Resources\LombaResource\Pages;

use App\Filament\Resources\LombaResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLomba extends CreateRecord
{
    protected static string $resource = LombaResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['booklet_upload']) && !empty($data['booklet_upload'])) {
            $data['booklet_path'] = is_array($data['booklet_upload']) 
                ? array_values($data['booklet_upload'])[0] 
                : $data['booklet_upload'];
        }
        unset($data['booklet_upload']);

        if (isset($data['banner_upload']) && !empty($data['banner_upload'])) {
            $data['banner_path'] = is_array($data['banner_upload']) 
                ? array_values($data['banner_upload'])[0] 
                : $data['banner_upload'];
        }
        unset($data['banner_upload']);

        return $data;
    }
}
