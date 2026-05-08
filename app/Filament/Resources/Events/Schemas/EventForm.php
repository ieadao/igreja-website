<?php

namespace App\Filament\Resources\Events\Schemas;

use App\Models\Church;
use App\Models\Province;
use App\Models\Region;
use App\Models\Zone;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class EventForm
{
    public static function configure(Schema $schema): Schema
    {
        $isAdmin = auth()->user()?->hasAnyRole(['super_admin', 'admin']);

        return $schema
            ->components([
                Select::make('scope_type')
                    ->label('Âmbito')
                    ->options([
                        'national' => 'Nacional',
                        'province' => 'Província',
                        'region'   => 'Região',
                        'zone'     => 'Zona',
                        'church'   => 'Igreja',
                    ])
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('scope_id', null))
                    ->default('province')
                    ->visible($isAdmin),

                Select::make('scope_id')
                    ->label('Entidade')
                    ->options(function ($get) {
                        return match ($get('scope_type')) {
                            'province' => Province::pluck('name', 'id')->all(),
                            'region'   => Region::pluck('name', 'id')->all(),
                            'zone'     => Zone::pluck('name', 'id')->all(),
                            'church'   => Church::pluck('name', 'id')->all(),
                            default    => [],
                        };
                    })
                    ->searchable()
                    ->nullable()
                    ->visible(fn ($get) => $isAdmin && in_array($get('scope_type'), ['province', 'region', 'zone', 'church'])),

                TextInput::make('title')
                    ->label('Título')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug())),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(220)
                    ->unique(ignoreRecord: true),

                Select::make('type')
                    ->label('Tipo')
                    ->options([
                        'conference' => 'Conferência',
                        'retreat'    => 'Retiro',
                        'service'    => 'Culto',
                        'youth'      => 'Juventude',
                        'social'     => 'Social',
                        'other'      => 'Outro',
                    ])
                    ->required(),

                DateTimePicker::make('starts_at')
                    ->label('Início')
                    ->required()
                    ->seconds(false),

                DateTimePicker::make('ends_at')
                    ->label('Fim')
                    ->seconds(false)
                    ->after('starts_at'),

                TextInput::make('location')
                    ->label('Local')
                    ->maxLength(255),

                Toggle::make('is_online')
                    ->label('Online')
                    ->live(),

                TextInput::make('stream_url')
                    ->label('Link da transmissão')
                    ->url()
                    ->maxLength(500)
                    ->visible(fn ($get) => $get('is_online')),

                TextInput::make('max_capacity')
                    ->label('Capacidade máxima')
                    ->numeric()
                    ->nullable(),

                Toggle::make('registration_required')
                    ->label('Inscrição obrigatória'),

                Select::make('status')
                    ->options([
                        'draft'     => 'Rascunho',
                        'published' => 'Publicado',
                        'cancelled' => 'Cancelado',
                        'completed' => 'Concluído',
                    ])
                    ->required()
                    ->default('draft'),

                FileUpload::make('cover_image')
                    ->label('Imagem de capa')
                    ->disk('public')
                    ->directory('events/covers')
                    ->image()
                    ->columnSpanFull(),

                Textarea::make('description')
                    ->label('Descrição')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}
