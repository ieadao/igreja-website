<?php

namespace App\Filament\Resources\SocialProjects;

use App\Filament\Resources\SocialProjects\Pages\CreateSocialProject;
use App\Filament\Resources\SocialProjects\Pages\EditSocialProject;
use App\Filament\Resources\SocialProjects\Pages\ListSocialProjects;
use App\Filament\Resources\SocialProjects\RelationManagers\ProjectImpactsRelationManager;
use App\Filament\Resources\SocialProjects\Schemas\SocialProjectForm;
use App\Filament\Resources\SocialProjects\Tables\SocialProjectsTable;
use App\Models\SocialProject;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SocialProjectResource extends Resource
{
    protected static ?string $model = SocialProject::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;

    protected static ?string $navigationLabel = 'Projectos Sociais';

    protected static ?string $modelLabel = 'Projecto Social';

    protected static ?string $pluralModelLabel = 'Projectos Sociais';

    protected static ?int $navigationSort = 3;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Missões & Social';
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
        return SocialProjectForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SocialProjectsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            ProjectImpactsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListSocialProjects::route('/'),
            'create' => CreateSocialProject::route('/create'),
            'edit'   => EditSocialProject::route('/{record}/edit'),
        ];
    }
}
