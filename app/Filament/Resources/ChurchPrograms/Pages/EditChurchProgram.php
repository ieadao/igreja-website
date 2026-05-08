<?php

namespace App\Filament\Resources\ChurchPrograms\Pages;

use App\Filament\Resources\ChurchPrograms\ChurchProgramResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditChurchProgram extends EditRecord
{
    protected static string $resource = ChurchProgramResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
