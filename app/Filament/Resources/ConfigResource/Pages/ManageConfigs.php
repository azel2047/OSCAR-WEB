<?php

namespace App\Filament\Resources\ConfigResource\Pages;

use App\Filament\Resources\ConfigResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageConfigs extends ManageRecords
{
    protected static string $resource = ConfigResource::class;

    protected function getHeaderActions(): array
    {
        return []; // Nonaktifkan tombol tambah karena key konfigurasi bersifat statik
    }
}
