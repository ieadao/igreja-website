<?php

namespace App\Filament\Resources\ChurchPrograms\Pages;

use App\Filament\Resources\ChurchPrograms\ChurchProgramResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListChurchPrograms extends ListRecords
{
    protected static string $resource = ChurchProgramResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
