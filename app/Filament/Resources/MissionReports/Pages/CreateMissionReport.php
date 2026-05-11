<?php

namespace App\Filament\Resources\MissionReports\Pages;

use App\Filament\Resources\MissionReports\MissionReportResource;
use App\Models\Missionary;
use Filament\Resources\Pages\CreateRecord;

class CreateMissionReport extends CreateRecord
{
    protected static string $resource = MissionReportResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (auth()->user()?->hasRole('missionary') && empty($data['missionary_id'])) {
            $missionary = Missionary::where('user_id', auth()->id())->first();
            if ($missionary) {
                $data['missionary_id'] = $missionary->id;
            }
        }

        return $data;
    }
}
