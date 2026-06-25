<?php

namespace App\Filament\Resources\SyaratBerkasResource\Pages;

use App\Filament\Resources\SyaratBerkasResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageSyaratBerkas extends ManageRecords
{
    protected static string $resource = SyaratBerkasResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
