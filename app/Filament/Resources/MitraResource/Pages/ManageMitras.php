<?php

namespace App\Filament\Resources\MitraResource\Pages;

use App\Filament\Resources\MitraResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageMitras extends ManageRecords
{
    protected static string $resource = MitraResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->mutateFormDataUsing(function (array $data): array {
                    if (isset($data['logo_upload']) && !empty($data['logo_upload'])) {
                        $data['logo_path'] = is_array($data['logo_upload']) 
                            ? array_values($data['logo_upload'])[0] 
                            : $data['logo_upload'];
                    }
                    unset($data['logo_upload']);
                    return $data;
                }),
        ];
    }
}
