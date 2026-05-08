<?php

namespace App\Filament\Resources\HomogeneousGroupTypes\Pages;

use App\Filament\Resources\HomogeneousGroupTypes\HomogeneousGroupTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHomogeneousGroupTypes extends ListRecords
{
    protected static string $resource = HomogeneousGroupTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
