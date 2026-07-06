<?php

namespace App\Filament\Resources\FamilyGroups;

use App\Filament\Resources\FamilyGroups\Pages\CreateFamilyGroup;
use App\Filament\Resources\FamilyGroups\Pages\EditFamilyGroup;
use App\Filament\Resources\FamilyGroups\Pages\ListFamilyGroups;
use App\Filament\Resources\FamilyGroups\Schemas\FamilyGroupForm;
use App\Filament\Resources\FamilyGroups\Tables\FamilyGroupsTable;
use App\Models\FamilyGroup;
use BackedEnum;
use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Builder;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FamilyGroupResource extends Resource
{
    protected static ?string $model = FamilyGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;



    protected static ?string $navigationLabel = 'Grupos Familiares';

    protected static ?string $modelLabel = 'Grupo Familiar';

    protected static ?string $pluralModelLabel = 'Grupos Familiares';

    protected static ?int $navigationSort = 7;

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
            return $query->whereHas('church', fn (Builder $q) => $q->where('province_id', $user->province_id));
        }

        if ($user->hasRole('region_leader')) {
            return $query->whereHas('church', fn (Builder $q) => $q->where(
                'region_id',
                $user->scope_type === 'region' ? $user->scope_id : -1,
            ));
        }

        if ($user->church_id) {
            return $query->where('church_id', $user->church_id);
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return FamilyGroupForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FamilyGroupsTable::configure($table);
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
            'index' => ListFamilyGroups::route('/'),
            'create' => CreateFamilyGroup::route('/create'),
            'edit' => EditFamilyGroup::route('/{record}/edit'),
        ];
    }
}
