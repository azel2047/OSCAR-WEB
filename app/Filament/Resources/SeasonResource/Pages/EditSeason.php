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
        $logPath = storage_path('logs/custom_debug.log');
        $logMsg = date('Y-m-d H:i:s') . " - mutateFormDataBeforeSave keys: " . implode(', ', array_keys($data)) . "\n";
        $logMsg .= "foto_utama_upload: " . json_encode($data['foto_utama_upload'] ?? 'not_present') . "\n";
        $logMsg .= "foto_utama: " . json_encode($data['foto_utama'] ?? 'not_present') . "\n";

        if (!empty($data['foto_utama_upload'])) {
            $data['foto_utama'] = is_array($data['foto_utama_upload']) 
                ? array_values($data['foto_utama_upload'])[0] 
                : $data['foto_utama_upload'];
            $logMsg .= "set foto_utama to: " . $data['foto_utama'] . "\n";
        }
        unset($data['foto_utama_upload']);
        
        file_put_contents($logPath, $logMsg, FILE_APPEND);
        return $data;
    }
}
