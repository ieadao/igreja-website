<?php

namespace App\Filament\Resources\Partnerships\Pages;

use App\Filament\Resources\Partnerships\PartnershipRequestResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPartnershipRequest extends EditRecord
{
    protected static string $resource = PartnershipRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
