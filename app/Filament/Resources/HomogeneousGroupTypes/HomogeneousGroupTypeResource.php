<?php

namespace App\Filament\Resources\HomogeneousGroupTypes;

use App\Filament\Resources\HomogeneousGroupTypes\Pages\CreateHomogeneousGroupType;
use App\Filament\Resources\HomogeneousGroupTypes\Pages\EditHomogeneousGroupType;
use App\Filament\Resources\HomogeneousGroupTypes\Pages\ListHomogeneousGroupTypes;
use App\Filament\Resources\HomogeneousGroupTypes\Schemas\HomogeneousGroupTypeForm;
use App\Filament\Resources\HomogeneousGroupTypes\Tables\HomogeneousGroupTypesTable;
use App\Models\HomogeneousGroupType;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class HomogeneousGroupTypeResource extends Resource
{
    protected static ?string $model = HomogeneousGroupType::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;



    protected static ?string $navigationLabel = 'Tipos de Grupo';

    protected static ?string $modelLabel = 'Tipo de Grupo';

    protected static ?string $pluralModelLabel = 'Tipos de Grupo';

    protected static ?int $navigationSort = 5;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Estrutura';
    }

    public static function canCreate(): bool
    {
        return auth()->user()?->hasRole('super_admin') ?? false;
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()?->hasRole('super_admin') ?? false;
    }

    public static function form(Schema $schema): Schema
    {
        return HomogeneousGroupTypeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HomogeneousGroupTypesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListHomogeneousGroupTypes::route('/'),
            'create' => CreateHomogeneousGroupType::route('/create'),
            'edit'   => EditHomogeneousGroupType::route('/{record}/edit'),
        ];
    }
}
