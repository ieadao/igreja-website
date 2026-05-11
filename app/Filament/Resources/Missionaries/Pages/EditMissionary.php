<?php

namespace App\Filament\Resources\Missionaries\Pages;

use App\Filament\Resources\Missionaries\MissionaryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMissionary extends EditRecord
{
    protected static string $resource = MissionaryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->hidden(fn () => auth()->user()?->hasRole('missionary')),
        ];
    }
}
