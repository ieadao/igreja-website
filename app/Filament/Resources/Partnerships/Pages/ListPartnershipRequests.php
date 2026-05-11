<?php

namespace App\Filament\Resources\Partnerships\Pages;

use App\Filament\Resources\Partnerships\PartnershipRequestResource;
use Filament\Resources\Pages\ListRecords;

class ListPartnershipRequests extends ListRecords
{
    protected static string $resource = PartnershipRequestResource::class;
}
