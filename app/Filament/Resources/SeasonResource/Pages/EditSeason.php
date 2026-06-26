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
        $logMsg = date('Y-m-d H:i:s') . " - mutateFormDataBeforeSave CALLED\n";
        $logMsg .= "ALL keys: " . implode(', ', array_keys($data)) . "\n";
        $logMsg .= "foto_utama_upload RAW: " . json_encode($data['foto_utama_upload'] ?? 'NOT_PRESENT') . "\n";
        $logMsg .= "foto_utama RAW: " . json_encode($data['foto_utama'] ?? 'NOT_PRESENT') . "\n";
        $logMsg .= "foto_utama_upload type: " . gettype($data['foto_utama_upload'] ?? null) . "\n";

        if (!empty($data['foto_utama_upload'])) {
            $val = $data['foto_utama_upload'];
            if (is_array($val)) {
                $data['foto_utama'] = array_values($val)[0];
                $logMsg .= "ARRAY -> extracted first value: " . $data['foto_utama'] . "\n";
            } else {
                $data['foto_utama'] = $val;
                $logMsg .= "STRING -> set directly: " . $data['foto_utama'] . "\n";
            }
        } else {
            $logMsg .= "foto_utama_upload is EMPTY, not overriding foto_utama\n";
        }
        
        unset($data['foto_utama_upload']);
        $logMsg .= "FINAL foto_utama: " . json_encode($data['foto_utama'] ?? 'NOT_SET') . "\n";
        $logMsg .= "FINAL all keys: " . implode(', ', array_keys($data)) . "\n";
        $logMsg .= "---\n";
        file_put_contents($logPath, $logMsg, FILE_APPEND);
        
        return $data;
    }

    protected function afterSave(): void
    {
        $logPath = storage_path('logs/custom_debug.log');
        $record = $this->record->fresh();
        $logMsg = date('Y-m-d H:i:s') . " - afterSave: record id=" . $record->id . ", foto_utama=" . $record->foto_utama . "\n---\n";
        file_put_contents($logPath, $logMsg, FILE_APPEND);
    }
}
