<?php

namespace App\Filament\Resources\FinancialSupports;

use App\Filament\Resources\FinancialSupports\Pages\EditFinancialSupport;
use App\Filament\Resources\FinancialSupports\Pages\ListFinancialSupports;
use App\Filament\Resources\FinancialSupports\Schemas\FinancialSupportForm;
use App\Filament\Resources\FinancialSupports\Tables\FinancialSupportsTable;
use App\Models\FinancialSupport;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class FinancialSupportResource extends Resource
{
    protected static ?string $model = FinancialSupport::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static ?string $navigationLabel = 'Contribuições';

    protected static ?string $modelLabel = 'Contribuição';

    protected static ?string $pluralModelLabel = 'Contribuições';

    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Financeiro';
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user  = auth()->user();

        if ($user?->hasRole('province_manager')) {
            return $query->where('province_id', $user->province_id);
        }

        return $query;
    }

    public static function form(Schema $schema): Schema
    {
        return FinancialSupportForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FinancialSupportsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFinancialSupports::route('/'),
            'edit'  => EditFinancialSupport::route('/{record}/edit'),
        ];
    }
}
