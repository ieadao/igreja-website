<?php

namespace App\Filament\Resources\SocialProjects\Pages;

use App\Filament\Resources\SocialProjects\SocialProjectResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSocialProject extends EditRecord
{
    protected static string $resource = SocialProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
