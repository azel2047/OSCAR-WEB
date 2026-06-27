<?php

namespace App\Filament\Resources\SeasonResource\Pages;

use App\Filament\Resources\SeasonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSeason extends CreateRecord
{
    protected static string $resource = SeasonResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['foto_utama_upload']) && !empty($data['foto_utama_upload'])) {
            $data['foto_utama'] = is_array($data['foto_utama_upload']) 
                ? array_values($data['foto_utama_upload'])[0] 
                : $data['foto_utama_upload'];
        }
        unset($data['foto_utama_upload']);

        if (isset($data['galeri']) && is_array($data['galeri'])) {
            foreach ($data['galeri'] as &$item) {
                if (isset($item['path_upload']) && !empty($item['path_upload'])) {
                    $item['path'] = is_array($item['path_upload'])
                        ? array_values($item['path_upload'])[0]
                        : $item['path_upload'];
                }
                unset($item['path_upload']);
            }
        }

        \Log::info('CreateSeason data before create:', $data);
        return $data;
    }
}
