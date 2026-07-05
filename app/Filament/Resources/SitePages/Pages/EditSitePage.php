<?php

namespace App\Filament\Resources\SitePages\Pages;

use App\Filament\Resources\SitePages\Pages\Concerns\InteractsWithSitePageData;
use App\Filament\Resources\SitePages\SitePageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSitePage extends EditRecord
{
    use InteractsWithSitePageData;

    protected static string $resource = SitePageResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->mutateSitePageData($data);
    }
}
