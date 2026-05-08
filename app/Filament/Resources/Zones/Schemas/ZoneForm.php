<?php

namespace App\Filament\Resources\Zones\Schemas;

use App\Models\Region;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class ZoneForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('province_id_filter')
                    ->label('Província')
                    ->options(\App\Models\Province::pluck('name', 'id'))
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('region_id', null))
                    ->dehydrated(false),

                Select::make('region_id')
                    ->label('Região')
                    ->options(fn ($get) => Region::when(
                        $get('province_id_filter'),
                        fn (Builder $q, $pid) => $q->where('province_id', $pid)
                    )->pluck('name', 'id'))
                    ->required()
                    ->searchable(),

                TextInput::make('name')
                    ->required()
                    ->maxLength(100)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug())),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(120),

                Textarea::make('description')
                    ->rows(3)
                    ->columnSpanFull(),

                Select::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo'])
                    ->required()
                    ->default('active'),
            ]);
    }
}
