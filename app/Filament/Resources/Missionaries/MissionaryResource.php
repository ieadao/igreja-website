<?php

namespace App\Filament\Resources\Missionaries;

use App\Filament\Resources\Missionaries\Pages\CreateMissionary;
use App\Filament\Resources\Missionaries\Pages\EditMissionary;
use App\Filament\Resources\Missionaries\Pages\ListMissionaries;
use App\Filament\Resources\Missionaries\RelationManagers\MissionReportsRelationManager;
use App\Filament\Resources\Missionaries\Schemas\MissionaryForm;
use App\Filament\Resources\Missionaries\Tables\MissionariesTable;
use App\Models\Missionary;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MissionaryResource extends Resource
{
    protected static ?string $model = Missionary::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static ?string $navigationLabel = 'Missionários';

    protected static ?string $modelLabel = 'Missionário';

    protected static ?string $pluralModelLabel = 'Missionários';

    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Missões & Social';
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user  = auth()->user();

        if ($user?->hasRole('missionary')) {
            return $query->where('user_id', $user->id);
        }

        if ($user?->hasRole('province_manager')) {
            return $query->where('province_id', $user->province_id);
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return MissionaryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MissionariesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            MissionReportsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListMissionaries::route('/'),
            'create' => CreateMissionary::route('/create'),
            'edit'   => EditMissionary::route('/{record}/edit'),
        ];
    }
}
