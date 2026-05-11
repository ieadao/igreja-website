<?php

namespace App\Filament\Resources\FinancialSupports\Schemas;

use App\Models\Province;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FinancialSupportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Select::make('province_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->nullable()
                    ->disabled(fn () => auth()->user()?->hasRole('province_manager'))
                    ->default(fn () => auth()->user()?->province_id),

                TextInput::make('name')
                    ->label('Nome do contribuinte')
                    ->disabled()
                    ->maxLength(100),

                Select::make('type')
                    ->label('Tipo')
                    ->options([
                        'tithe'    => 'Dízimo',
                        'offering' => 'Oferta',
                        'mission'  => 'Missões',
                        'social'   => 'Intervenção Social',
                        'other'    => 'Outro',
                    ])
                    ->disabled(),

                Select::make('payment_method')
                    ->label('Método')
                    ->options([
                        'mpesa'  => 'M-Pesa',
                        'mpago'  => 'Mpago / Emola',
                        'bank'   => 'Transferência Bancária',
                        'cash'   => 'Numerário',
                        'other'  => 'Outro',
                    ])
                    ->disabled(),

                TextInput::make('amount')
                    ->label('Valor')
                    ->prefix('MZN')
                    ->disabled()
                    ->numeric(),

                TextInput::make('currency')
                    ->label('Moeda')
                    ->disabled()
                    ->default('MZN'),

                TextInput::make('reference')
                    ->label('Referência')
                    ->disabled()
                    ->maxLength(100),

                TextInput::make('destination')
                    ->label('Destino')
                    ->disabled()
                    ->maxLength(200),

                Select::make('status')
                    ->label('Estado')
                    ->options([
                        'pending'   => 'Pendente',
                        'confirmed' => 'Confirmado',
                        'failed'    => 'Falhado',
                    ])
                    ->required(),

                DateTimePicker::make('supported_at')
                    ->label('Data da contribuição')
                    ->disabled()
                    ->displayFormat('d/m/Y H:i'),
            ]);
    }
}
