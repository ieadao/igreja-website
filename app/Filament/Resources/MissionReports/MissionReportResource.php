<?php

namespace App\Filament\Resources\MissionReports;

use App\Filament\Resources\MissionReports\Pages\CreateMissionReport;
use App\Filament\Resources\MissionReports\Pages\EditMissionReport;
use App\Filament\Resources\MissionReports\Pages\ListMissionReports;
use App\Filament\Resources\MissionReports\Schemas\MissionReportForm;
use App\Filament\Resources\MissionReports\Tables\MissionReportsTable;
use App\Models\MissionReport;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MissionReportResource extends Resource
{
    protected static ?string $model = MissionReport::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $navigationLabel = 'Relatórios';

    protected static ?string $modelLabel = 'Relatório de Missão';

    protected static ?string $pluralModelLabel = 'Relatórios de Missão';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Missões & Social';
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user  = auth()->user();

        if ($user?->hasRole('missionary')) {
            return $query->whereHas('missionary', fn (Builder $q) => $q->where('user_id', $user->id));
        }

        if ($user?->hasRole('province_manager')) {
            return $query->whereHas('missionary', fn (Builder $q) => $q->where('province_id', $user->province_id));
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return MissionReportForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MissionReportsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListMissionReports::route('/'),
            'create' => CreateMissionReport::route('/create'),
            'edit'   => EditMissionReport::route('/{record}/edit'),
        ];
    }
}
