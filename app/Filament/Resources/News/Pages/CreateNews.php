<?php

namespace App\Filament\Resources\News\Pages;

use App\Filament\Resources\News\NewsResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNews extends CreateRecord
{
    protected static string $resource = NewsResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();

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
