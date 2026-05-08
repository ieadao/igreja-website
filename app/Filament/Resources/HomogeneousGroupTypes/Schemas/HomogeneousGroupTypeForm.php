<?php

namespace App\Filament\Resources\HomogeneousGroupTypes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class HomogeneousGroupTypeForm
{
    public static function configure(Schema $schema): Schema
    {
        $isSuperAdmin = auth()->user()?->hasRole('super_admin');

        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(80)
                    ->disabled(! $isSuperAdmin)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $isSuperAdmin ? $set('slug', str($state)->slug()) : null),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(80)
                    ->unique(ignoreRecord: true)
                    ->disabled(! $isSuperAdmin),

                TextInput::make('icon')
                    ->maxLength(50)
                    ->placeholder('heroicon-o-users')
                    ->disabled(! $isSuperAdmin),

                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->disabled(! $isSuperAdmin),
            ]);
    }
}
