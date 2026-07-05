<?php

namespace App\Filament\Resources\SiteLock\Pages;

use App\Filament\Resources\SiteLock\SiteLockResource;
use App\Models\SiteLock;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class ManageSiteLock extends EditRecord
{
    protected static string $resource = SiteLockResource::class;

    public function mount(int|string $record = null): void
    {
        $this->record = SiteLock::config();
        $this->authorizeAccess();
        $this->fillForm();
    }

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getRecord(): Model
    {
        return $this->record ?? SiteLock::config();
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
