<?php

namespace App\Filament\Resources\ChurchPrograms\Schemas;

use App\Models\Church;
use App\Models\HomogeneousGroupType;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class ChurchProgramForm
{
    public static function configure(Schema $schema): Schema
    {
        $isPastor = auth()->user()?->hasRole('pastor');

        return $schema
            ->components([
                Select::make('church_id')
                    ->label('Igreja')
                    ->options(fn () => Church::when(
                        $isPastor,
                        fn (Builder $q) => $q->where('id', auth()->user()->church_id)
                    )->pluck('name', 'id'))
                    ->required()
                    ->searchable()
                    ->disabled($isPastor)
                    ->default($isPastor ? auth()->user()->church_id : null),

                Select::make('group_type_id')
                    ->label('Tipo de Grupo')
                    ->options(HomogeneousGroupType::orderBy('order')->pluck('name', 'id'))
                    ->required()
                    ->preload(),

                TextInput::make('name')
                    ->label('Nome')
                    ->maxLength(120),

                Select::make('day_of_week')
                    ->label('Dia da semana')
                    ->options([
                        'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta',
                        'thu' => 'Quinta', 'fri' => 'Sexta', 'sat' => 'Sábado', 'sun' => 'Domingo',
                    ]),

                TimePicker::make('start_time')
                    ->label('Hora início')
                    ->seconds(false),

                TimePicker::make('end_time')
                    ->label('Hora fim')
                    ->seconds(false),

                Select::make('frequency')
                    ->label('Frequência')
                    ->options([
                        'weekly'     => 'Semanal',
                        'biweekly'   => 'Quinzenal',
                        'monthly'    => 'Mensal',
                        'occasional' => 'Ocasional',
                    ])
                    ->required()
                    ->default('weekly'),

                TextInput::make('location')
                    ->label('Local')
                    ->maxLength(200),

                Textarea::make('description')
                    ->label('Descrição')
                    ->rows(3)
                    ->columnSpanFull(),

                Select::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo', 'suspended' => 'Suspenso'])
                    ->required()
                    ->default('active'),
            ]);
    }
}
