<?php

namespace App\Filament\Resources\SocialProjects\Schemas;

use App\Models\Province;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SocialProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        $isProvinceScope = auth()->user()?->hasRole('province_manager');
        $isAdmin         = auth()->user()?->hasAnyRole(['super_admin', 'admin']);

        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nome do projecto')
                    ->required()
                    ->maxLength(200)
                    ->columnSpanFull(),

                Select::make('province_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->required()
                    ->disabled($isProvinceScope)
                    ->default(fn () => auth()->user()?->province_id),

                Select::make('category')
                    ->label('Categoria')
                    ->options([
                        'family'    => 'Família',
                        'education' => 'Educação',
                        'health'    => 'Saúde',
                        'other'     => 'Outro',
                    ])
                    ->required(),

                Select::make('status')
                    ->label('Estado')
                    ->options([
                        'active'    => 'Activo',
                        'completed' => 'Concluído',
                        'paused'    => 'Pausado',
                    ])
                    ->required()
                    ->default('active'),

                DatePicker::make('started_at')
                    ->label('Data de início')
                    ->nullable(),

                DatePicker::make('ended_at')
                    ->label('Data de conclusão')
                    ->nullable()
                    ->after('started_at'),

                Textarea::make('description')
                    ->label('Descrição')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}
