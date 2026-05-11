<?php

namespace App\Filament\Resources\Partnerships;

use App\Filament\Resources\Partnerships\Pages\EditPartnershipRequest;
use App\Filament\Resources\Partnerships\Pages\ListPartnershipRequests;
use App\Filament\Resources\Partnerships\Schemas\PartnershipRequestForm;
use App\Filament\Resources\Partnerships\Tables\PartnershipRequestsTable;
use App\Models\PartnershipRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PartnershipRequestResource extends Resource
{
    protected static ?string $model = PartnershipRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static ?string $navigationLabel = 'Parcerias';

    protected static ?string $modelLabel = 'Parceria';

    protected static ?string $pluralModelLabel = 'Parcerias';

    protected static ?int $navigationSort = 3;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Utilizadores & Comunicação';
    }

    public static function form(Schema $schema): Schema
    {
        return PartnershipRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PartnershipRequestsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPartnershipRequests::route('/'),
            'edit'  => EditPartnershipRequest::route('/{record}/edit'),
        ];
    }
}
