<?php

namespace App\Filament\Resources\Partnerships\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PartnershipRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('org_name')
                    ->label('Organização')
                    ->disabled()
                    ->maxLength(150),

                TextInput::make('contact_name')
                    ->label('Responsável')
                    ->disabled()
                    ->maxLength(100),

                TextInput::make('email')
                    ->label('Email')
                    ->disabled(),

                TextInput::make('phone')
                    ->label('Telefone')
                    ->disabled()
                    ->nullable(),

                Select::make('type')
                    ->label('Tipo de parceria')
                    ->options([
                        'institutional' => 'Institucional',
                        'business'      => 'Empresarial',
                        'media'         => 'Média',
                        'theological'   => 'Teológica',
                        'other'         => 'Outro',
                    ])
                    ->disabled(),

                Select::make('status')
                    ->label('Estado')
                    ->options([
                        'new'       => 'Novo',
                        'reviewing' => 'Em análise',
                        'approved'  => 'Aprovado',
                        'rejected'  => 'Rejeitado',
                    ])
                    ->required(),

                Textarea::make('proposal')
                    ->label('Proposta')
                    ->disabled()
                    ->rows(6)
                    ->columnSpanFull(),
            ]);
    }
}
