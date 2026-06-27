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
        file_put_contents(public_path('debug_edit_season.log'), date('Y-m-d H:i:s') . " - START\n", FILE_APPEND);
        file_put_contents(public_path('debug_edit_season.log'), date('Y-m-d H:i:s') . " - DATA IN: " . json_encode($data) . "\n", FILE_APPEND);

        if (isset($data['foto_utama_upload']) && !empty($data['foto_utama_upload'])) {
            $data['foto_utama'] = is_array($data['foto_utama_upload']) 
                ? array_values($data['foto_utama_upload'])[0] 
                : $data['foto_utama_upload'];
            file_put_contents(public_path('debug_edit_season.log'), date('Y-m-d H:i:s') . " - PROCESSED FOTO UTAMA: " . $data['foto_utama'] . "\n", FILE_APPEND);
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

        file_put_contents(public_path('debug_edit_season.log'), date('Y-m-d H:i:s') . " - DATA OUT: " . json_encode($data) . "\n", FILE_APPEND);
        \Log::info('EditSeason data before save:', $data);
        return $data;
    }
}
