<?php

namespace App\Filament\Resources\FamilyGroups\Schemas;

use App\Models\Church;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class FamilyGroupForm
{
    public static function configure(Schema $schema): Schema
    {
        $user = auth()->user();
        $isPastor = $user?->hasRole('pastor');

        return $schema
            ->components([
                Select::make('church_id')
                    ->label('Igreja')
                    ->options(fn () => Church::when(
                        $isPastor && $user->church_id,
                        fn (Builder $q) => $q->where('id', $user->church_id)
                    )->pluck('name', 'id'))
                    ->required()
                    ->searchable()
                    ->disabled($isPastor)
                    ->default($isPastor ? $user->church_id : null),

                TextInput::make('name')
                    ->label('Nome')
                    ->required()
                    ->maxLength(100),

                TextInput::make('zone')
                    ->label('Zona/Bairro')
                    ->maxLength(100),

                TextInput::make('leader_name')
                    ->label('Líder')
                    ->required()
                    ->maxLength(100),

                TextInput::make('leader_phone')
                    ->label('Telefone do líder')
                    ->tel()
                    ->maxLength(30),

                Select::make('meeting_day')
                    ->label('Dia de reunião')
                    ->options([
                        'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta',
                        'thu' => 'Quinta', 'fri' => 'Sexta', 'sat' => 'Sábado', 'sun' => 'Domingo',
                    ]),

                TimePicker::make('meeting_time')
                    ->label('Hora de reunião')
                    ->seconds(false),

                Select::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo'])
                    ->required()
                    ->default('active'),
            ]);
    }
}
