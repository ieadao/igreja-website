<?php

namespace App\Filament\Resources\Missionaries\Pages;

use App\Filament\Resources\Missionaries\MissionaryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateMissionary extends CreateRecord
{
    protected static string $resource = MissionaryResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (auth()->user()?->hasRole('province_manager')) {
            $data['province_id'] = auth()->user()->province_id;
        }

        return $data;
    }
}
