<?php

namespace App\Filament\Resources\AccessCodes\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AccessCodeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('code')
                ->label('Código')
                ->placeholder('XXXX-XXXX-XXXX-XXXX')
                ->required()
                ->unique(ignoreRecord: true)
                ->maxLength(20)
                ->extraInputAttributes(['class' => 'font-mono tracking-widest']),

            TextInput::make('label')
                ->label('Nota / Evento')
                ->placeholder('Ex: Conferência Anual 2026')
                ->maxLength(255),

            Toggle::make('is_active')
                ->label('Activo')
                ->default(true),

            TextInput::make('max_uses')
                ->label('Limite de usos')
                ->helperText('Deixe em branco para usos ilimitados.')
                ->numeric()
                ->minValue(1)
                ->nullable(),

            DateTimePicker::make('expires_at')
                ->label('Expira em')
                ->nullable()
                ->seconds(false),
        ]);
    }
}
