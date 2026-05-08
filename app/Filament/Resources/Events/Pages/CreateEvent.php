<?php

namespace App\Filament\Resources\Events\Pages;

use App\Filament\Resources\Events\EventResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEvent extends CreateRecord
{
    protected static string $resource = EventResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (auth()->user()?->hasAnyRole(['province_manager', 'province_editor'])) {
            $data['scope_type'] = 'province';
            $data['scope_id']   = auth()->user()->province_id;
        }

        return $data;
    }
}
