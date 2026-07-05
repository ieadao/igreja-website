<?php

namespace App\Filament\Resources\HomogeneousGroupTypes\Schemas;

use Filament\Forms\Components\Textarea;
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
                    ->label('Nome completo')
                    ->required()
                    ->maxLength(80)
                    ->disabled(! $isSuperAdmin)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $isSuperAdmin ? $set('slug', str($state)->slug()) : null),

                TextInput::make('acronym')
                    ->label('Sigla')
                    ->maxLength(10)
                    ->placeholder('GHJ')
                    ->helperText('Ex: GHJ = Grupo Homogéneo de Jovens')
                    ->disabled(! $isSuperAdmin),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(80)
                    ->unique(ignoreRecord: true)
                    ->disabled(! $isSuperAdmin),

                TextInput::make('icon')
                    ->maxLength(50)
                    ->placeholder('heroicon-o-users')
                    ->disabled(! $isSuperAdmin),

                TextInput::make('whatsapp_number')
                    ->label('Número WhatsApp')
                    ->maxLength(30)
                    ->placeholder('+258840000000')
                    ->tel(),

                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->disabled(! $isSuperAdmin),

                Textarea::make('description')
                    ->label('Descrição')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}
