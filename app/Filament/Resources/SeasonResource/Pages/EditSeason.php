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
            $val = $data['foto_utama_upload'];
            $data['foto_utama'] = is_array($val) ? array_values($val)[0] : $val;
        }
        unset($data['foto_utama_upload']);
        
        return $data;
    }
}
