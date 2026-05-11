<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\Province;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Spatie\Permission\Models\Role;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        $isProvinceManager = auth()->user()?->hasRole('province_manager');

        $availableRoles = Role::query()
            ->when(
                ! auth()->user()?->hasRole('super_admin'),
                fn ($q) => $q->whereNotIn('name', ['super_admin'])
            )
            ->when(
                $isProvinceManager,
                fn ($q) => $q->whereNotIn('name', ['admin'])
            )
            ->pluck('name', 'name')
            ->all();

        return $schema
            ->columns(2)
            ->components([
                TextInput::make('name')
                    ->label('Nome')
                    ->required()
                    ->maxLength(255),

                TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                TextInput::make('password')
                    ->label('Palavra-passe')
                    ->password()
                    ->revealable()
                    ->dehydrateStateUsing(fn ($state) => filled($state) ? bcrypt($state) : null)
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $operation) => $operation === 'create')
                    ->minLength(8)
                    ->maxLength(255),

                Select::make('roles')
                    ->label('Função')
                    ->options($availableRoles)
                    ->multiple()
                    ->preload()
                    ->searchable()
                    ->relationship('roles', 'name'),

                Select::make('province_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->nullable()
                    ->disabled($isProvinceManager)
                    ->default(fn () => auth()->user()?->province_id),

                Select::make('scope_type')
                    ->label('Tipo de âmbito')
                    ->options([
                        'national' => 'Nacional',
                        'province' => 'Província',
                        'region'   => 'Região',
                        'zone'     => 'Zona',
                        'church'   => 'Igreja',
                    ])
                    ->nullable()
                    ->visible(fn () => auth()->user()?->hasAnyRole(['super_admin', 'admin'])),
            ]);
    }
}
