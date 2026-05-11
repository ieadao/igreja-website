<?php

namespace App\Filament\Resources\SocialProjects\Pages;

use App\Filament\Resources\SocialProjects\SocialProjectResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSocialProject extends CreateRecord
{
    protected static string $resource = SocialProjectResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (auth()->user()?->hasRole('province_manager')) {
            $data['province_id'] = auth()->user()->province_id;
        }

        return $data;
    }
}
