<?php

namespace App\Filament\Resources\MissionReports\Pages;

use App\Filament\Resources\MissionReports\MissionReportResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMissionReport extends EditRecord
{
    protected static string $resource = MissionReportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
