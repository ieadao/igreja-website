<?php

namespace App\Filament\Resources\MissionReports\Pages;

use App\Filament\Resources\MissionReports\MissionReportResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMissionReports extends ListRecords
{
    protected static string $resource = MissionReportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
