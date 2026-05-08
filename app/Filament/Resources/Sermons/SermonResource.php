<?php

namespace App\Filament\Resources\Sermons;

use App\Filament\Resources\Sermons\Pages\CreateSermon;
use App\Filament\Resources\Sermons\Pages\EditSermon;
use App\Filament\Resources\Sermons\Pages\ListSermons;
use App\Filament\Resources\Sermons\Schemas\SermonForm;
use App\Filament\Resources\Sermons\Tables\SermonsTable;
use App\Models\Sermon;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SermonResource extends Resource
{
    protected static ?string $model = Sermon::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMicrophone;

    protected static ?string $navigationLabel = 'Pregações';

    protected static ?string $modelLabel = 'Pregação';

    protected static ?string $pluralModelLabel = 'Pregações';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Conteúdo';
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user  = auth()->user();

        if ($user?->hasAnyRole(['province_manager', 'province_editor'])) {
            return $query->where('scope_type', 'province')
                         ->where('scope_id', $user->province_id);
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return SermonForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SermonsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListSermons::route('/'),
            'create' => CreateSermon::route('/create'),
            'edit'   => EditSermon::route('/{record}/edit'),
        ];
    }
}
