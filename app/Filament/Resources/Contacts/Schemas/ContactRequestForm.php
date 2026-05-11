<?php

namespace App\Filament\Resources\Contacts\Schemas;

use App\Models\Province;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ContactRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        $isProvinceManager = auth()->user()?->hasRole('province_manager');

        return $schema
            ->columns(2)
            ->components([
                Select::make('province_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->nullable()
                    ->disabled($isProvinceManager)
                    ->default(fn () => auth()->user()?->province_id)
                    ->visible(fn () => auth()->user()?->hasAnyRole(['super_admin', 'admin', 'province_manager'])),

                TextInput::make('name')
                    ->label('Nome')
                    ->disabled()
                    ->maxLength(100),

                TextInput::make('email')
                    ->label('Email')
                    ->disabled(),

                TextInput::make('phone')
                    ->label('Telefone')
                    ->disabled(),

                Select::make('type')
                    ->label('Tipo')
                    ->options([
                        'general'     => 'Geral',
                        'counseling'  => 'Aconselhamento',
                        'partnership' => 'Parceria',
                        'support'     => 'Apoio',
                    ])
                    ->disabled(),

                Textarea::make('message')
                    ->label('Mensagem')
                    ->disabled()
                    ->rows(4)
                    ->columnSpanFull(),

                Select::make('status')
                    ->label('Estado')
                    ->options([
                        'new'         => 'Novo',
                        'in_progress' => 'Em curso',
                        'resolved'    => 'Resolvido',
                        'closed'      => 'Encerrado',
                    ])
                    ->required(),

                Select::make('assigned_to')
                    ->label('Atribuído a')
                    ->options(
                        User::whereHas('roles', fn ($q) => $q->whereIn('name', ['super_admin', 'admin', 'province_manager']))
                            ->pluck('name', 'id')
                            ->all()
                    )
                    ->searchable()
                    ->nullable(),

                Textarea::make('response')
                    ->label('Resposta')
                    ->rows(5)
                    ->columnSpanFull(),
            ]);
    }
}
