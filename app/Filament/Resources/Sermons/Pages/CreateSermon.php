<?php

namespace App\Filament\Resources\Sermons\Pages;

use App\Filament\Resources\Sermons\SermonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSermon extends CreateRecord
{
    protected static string $resource = SermonResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (auth()->user()?->hasAnyRole(['province_manager', 'province_editor'])) {
            $data['scope_type'] = 'province';
            $data['scope_id']   = auth()->user()->province_id;
        }

        if (auth()->user()?->hasRole('church_editor')) {
            $data['scope_type'] = 'church';
            $data['scope_id']   = auth()->user()->church_id;
        }

        return $data;
    }
}
