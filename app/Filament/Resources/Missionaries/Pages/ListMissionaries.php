<?php

namespace App\Filament\Resources\Missionaries\Pages;

use App\Filament\Resources\Missionaries\MissionaryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMissionaries extends ListRecords
{
    protected static string $resource = MissionaryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
