<?php

namespace App\Filament\Resources\Churches\Schemas;

use App\Models\Region;
use App\Models\Zone;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class ChurchForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('province_id')
                    ->label('Província')
                    ->relationship('province', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->live()
                    ->afterStateUpdated(fn ($set) => [$set('region_id', null), $set('zone_id', null)]),

                Select::make('region_id')
                    ->label('Região')
                    ->options(fn ($get) => Region::when(
                        $get('province_id'),
                        fn (Builder $q, $pid) => $q->where('province_id', $pid)
                    )->pluck('name', 'id'))
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('zone_id', null))
                    ->searchable(),

                Select::make('zone_id')
                    ->label('Zona')
                    ->options(fn ($get) => Zone::when(
                        $get('region_id'),
                        fn (Builder $q, $rid) => $q->where('region_id', $rid)
                    )->pluck('name', 'id'))
                    ->searchable(),

                TextInput::make('name')
                    ->required()
                    ->maxLength(150)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug())),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(170),

                Select::make('type')
                    ->options(['church' => 'Igreja', 'congregation' => 'Congregação'])
                    ->required()
                    ->default('church'),

                TextInput::make('address')
                    ->maxLength(255)
                    ->columnSpanFull(),

                TextInput::make('lat')
                    ->label('Latitude')
                    ->numeric(),

                TextInput::make('lng')
                    ->label('Longitude')
                    ->numeric(),

                TextInput::make('pastor_name')
                    ->label('Pastor')
                    ->maxLength(100),

                TextInput::make('phone')
                    ->tel()
                    ->maxLength(30),

                TextInput::make('email')
                    ->email()
                    ->maxLength(100),

                Select::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo', 'plant' => 'Planta'])
                    ->required()
                    ->default('active'),

                DatePicker::make('founded_at')
                    ->label('Fundada em'),

                Repeater::make('service_times')
                    ->label('Horários de culto')
                    ->schema([
                        Select::make('day')
                            ->label('Dia')
                            ->options([
                                'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta',
                                'thu' => 'Quinta', 'fri' => 'Sexta', 'sat' => 'Sábado', 'sun' => 'Domingo',
                            ])
                            ->required(),
                        TimePicker::make('time')
                            ->label('Hora')
                            ->seconds(false),
                        TextInput::make('label')
                            ->label('Descrição')
                            ->placeholder('ex: Culto Principal'),
                    ])
                    ->columns(3)
                    ->collapsible()
                    ->defaultItems(0)
                    ->columnSpanFull(),
            ]);
    }
}
