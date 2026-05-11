<?php

namespace App\Filament\Resources\SocialProjects\Pages;

use App\Filament\Resources\SocialProjects\SocialProjectResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSocialProjects extends ListRecords
{
    protected static string $resource = SocialProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
