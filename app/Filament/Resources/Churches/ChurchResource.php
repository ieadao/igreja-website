<?php

namespace App\Filament\Resources\Churches;

use App\Filament\Resources\Churches\Pages\CreateChurch;
use App\Filament\Resources\Churches\Pages\EditChurch;
use App\Filament\Resources\Churches\Pages\ListChurches;
use App\Filament\Resources\Churches\Schemas\ChurchForm;
use App\Filament\Resources\Churches\Tables\ChurchesTable;
use App\Models\Church;
use BackedEnum;
use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Builder;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ChurchResource extends Resource
{
    protected static ?string $model = Church::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingLibrary;



    protected static ?string $navigationLabel = 'Igrejas';

    protected static ?string $modelLabel = 'Igreja';

    protected static ?string $pluralModelLabel = 'Igrejas';

    protected static ?int $navigationSort = 4;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Estrutura';
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user  = auth()->user();

        if (! $user || $user->hasAnyRole(['super_admin', 'admin'])) {
            return $query;
        }

        if ($user->hasAnyRole(['province_manager', 'province_editor'])) {
            return $query->where('province_id', $user->province_id);
        }

        if ($user->hasRole('region_leader')) {
            return $query->where('region_id', $user->scope_type === 'region' ? $user->scope_id : -1);
        }

        if ($user->church_id) {
            return $query->whereKey($user->church_id);
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return ChurchForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ChurchesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListChurches::route('/'),
            'create' => CreateChurch::route('/create'),
            'edit' => EditChurch::route('/{record}/edit'),
        ];
    }
}
