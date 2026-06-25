<?php

namespace App\Filament\Resources\PengumpulanKaryas\Pages;

use App\Filament\Resources\PengumpulanKaryas\PengumpulanKaryaResource;
use Filament\Resources\Pages\ManageRecords;

class ManagePengumpulanKaryas extends ManageRecords
{
    protected static string $resource = PengumpulanKaryaResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
