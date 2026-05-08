<?php

namespace App\Filament\Resources\ChurchPrograms;

use App\Filament\Resources\ChurchPrograms\Pages\CreateChurchProgram;
use App\Filament\Resources\ChurchPrograms\Pages\EditChurchProgram;
use App\Filament\Resources\ChurchPrograms\Pages\ListChurchPrograms;
use App\Filament\Resources\ChurchPrograms\Schemas\ChurchProgramForm;
use App\Filament\Resources\ChurchPrograms\Tables\ChurchProgramsTable;
use App\Models\ChurchProgram;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ChurchProgramResource extends Resource
{
    protected static ?string $model = ChurchProgram::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;



    protected static ?string $navigationLabel = 'Programas';

    protected static ?string $modelLabel = 'Programa';

    protected static ?string $pluralModelLabel = 'Programas';

    protected static ?int $navigationSort = 6;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Estrutura';
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user = auth()->user();

        if ($user?->hasRole('pastor') && $user->church_id) {
            return $query->where('church_id', $user->church_id);
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return ChurchProgramForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ChurchProgramsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListChurchPrograms::route('/'),
            'create' => CreateChurchProgram::route('/create'),
            'edit'   => EditChurchProgram::route('/{record}/edit'),
        ];
    }
}
