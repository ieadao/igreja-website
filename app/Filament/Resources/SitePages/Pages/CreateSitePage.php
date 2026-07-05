<?php

namespace App\Filament\Resources\SitePages\Pages;

use App\Filament\Resources\SitePages\SitePageResource;
use App\Filament\Resources\SitePages\Pages\Concerns\InteractsWithSitePageData;
use Filament\Resources\Pages\CreateRecord;

class CreateSitePage extends CreateRecord
{
    use InteractsWithSitePageData;

    protected static string $resource = SitePageResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->mutateSitePageData($data);
    }
}
