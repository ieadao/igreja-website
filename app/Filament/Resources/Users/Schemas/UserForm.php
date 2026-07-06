<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\Church;
use App\Models\Province;
use App\Models\Region;
use App\Models\Zone;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Spatie\Permission\Models\Role;

class UserForm
{
    private const ROLE_LABELS = [
        'super_admin'      => 'Super Administrador',
        'admin'            => 'Administrador',
        'province_manager' => 'Gestor Provincial',
        'province_editor'  => 'Editor Provincial',
        'region_leader'    => 'Líder Regional',
        'pastor'           => 'Pastor',
        'church_editor'    => 'Editor de Igreja',
        'missionary'       => 'Missionário',
        'viewer'           => 'Visualizador',
    ];

    public static function configure(Schema $schema): Schema
    {
        $isProvinceManager = auth()->user()?->hasRole('province_manager');

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
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $operation) => $operation === 'create')
                    ->minLength(8)
                    ->maxLength(255),

                Select::make('roles')
                    ->label('Função')
                    ->relationship(
                        'roles',
                        'name',
                        modifyQueryUsing: fn ($query) => $query
                            ->when(
                                ! auth()->user()?->hasRole('super_admin'),
                                fn ($q) => $q->whereNotIn('name', ['super_admin'])
                            )
                            ->when(
                                $isProvinceManager,
                                fn ($q) => $q->whereNotIn('name', ['admin'])
                            )
                    )
                    ->getOptionLabelFromRecordUsing(
                        fn (Role $record) => self::ROLE_LABELS[$record->name] ?? str($record->name)->headline()->toString()
                    )
                    ->multiple()
                    ->preload()
                    ->searchable(),

                Select::make('province_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->nullable()
                    ->disabled($isProvinceManager)
                    ->default(fn () => auth()->user()?->province_id)
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('church_id', null)),

                Select::make('church_id')
                    ->label('Igreja')
                    ->helperText('Obrigatório para a função church_editor — limita o conteúdo à igreja indicada.')
                    ->searchable()
                    ->nullable()
                    ->options(
                        fn ($get) => Church::query()
                            ->when($get('province_id'), fn ($q, $provinceId) => $q->where('province_id', $provinceId))
                            ->orderBy('name')
                            ->limit(50)
                            ->pluck('name', 'id')
                            ->all()
                    )
                    ->getSearchResultsUsing(
                        fn (string $search, $get) => Church::query()
                            ->when($get('province_id'), fn ($q, $provinceId) => $q->where('province_id', $provinceId))
                            ->where('name', 'like', "%{$search}%")
                            ->limit(30)
                            ->pluck('name', 'id')
                    )
                    ->getOptionLabelUsing(fn ($value) => Church::find($value)?->name),

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
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('scope_id', null))
                    ->visible(fn () => auth()->user()?->hasAnyRole(['super_admin', 'admin'])),

                Select::make('scope_id')
                    ->label('Entidade do âmbito')
                    ->helperText('Ex.: para um líder regional, escolha a região que ele gere.')
                    ->options(fn ($get) => match ($get('scope_type')) {
                        'province' => Province::pluck('name', 'id')->all(),
                        'region'   => Region::pluck('name', 'id')->all(),
                        'zone'     => Zone::pluck('name', 'id')->all(),
                        'church'   => Church::orderBy('name')->limit(50)->pluck('name', 'id')->all(),
                        default    => [],
                    })
                    ->searchable()
                    ->nullable()
                    ->visible(fn ($get) => auth()->user()?->hasAnyRole(['super_admin', 'admin'])
                        && in_array($get('scope_type'), ['province', 'region', 'zone', 'church'])),
            ]);
    }
}
