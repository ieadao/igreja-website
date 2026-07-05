<?php

namespace App\Filament\Resources\SiteLock;

use App\Filament\Resources\SiteLock\Pages\ManageSiteLock;
use App\Filament\Resources\SiteLock\Schemas\SiteLockForm;
use App\Models\SiteLock;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SiteLockResource extends Resource
{
    protected static ?string $model = SiteLock::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLockClosed;

    protected static ?string $navigationLabel = 'Bloqueio do Site';

    protected static ?string $modelLabel = 'Bloqueio';

    protected static ?string $pluralModelLabel = 'Bloqueio do Site';

    protected static ?int $navigationSort = 10;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Configuração';
    }

    public static function form(Schema $schema): Schema
    {
        return SiteLockForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSiteLock::route('/'),
        ];
    }
}
