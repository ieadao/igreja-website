<?php

namespace App\Filament\Resources\HomogeneousGroupTypes\Pages;

use App\Filament\Resources\HomogeneousGroupTypes\HomogeneousGroupTypeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHomogeneousGroupType extends EditRecord
{
    protected static string $resource = HomogeneousGroupTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
