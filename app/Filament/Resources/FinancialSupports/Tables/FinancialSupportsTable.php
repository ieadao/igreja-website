<?php

namespace App\Filament\Resources\FinancialSupports\Tables;

use App\Models\FinancialSupport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FinancialSupportsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('province.name')
                    ->label('Província')
                    ->sortable()
                    ->toggleable()
                    ->hidden(fn () => auth()->user()?->hasRole('province_manager')),

                TextColumn::make('name')
                    ->label('Contribuinte')
                    ->default('Anónimo')
                    ->searchable(),

                TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'tithe'    => 'success',
                        'offering' => 'info',
                        'mission'  => 'warning',
                        'social'   => 'primary',
                        default    => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'tithe'    => 'Dízimo',
                        'offering' => 'Oferta',
                        'mission'  => 'Missões',
                        'social'   => 'Social',
                        default    => 'Outro',
                    }),

                TextColumn::make('amount')
                    ->label('Valor')
                    ->formatStateUsing(fn ($state, $record) => $record->currency . ' ' . number_format($state, 2, ',', '.'))
                    ->sortable(),

                TextColumn::make('payment_method')
                    ->label('Método')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'mpesa' => 'M-Pesa',
                        'mpago' => 'Mpago',
                        'bank'  => 'Banco',
                        'cash'  => 'Numerário',
                        default => 'Outro',
                    }),

                TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'confirmed' => 'success',
                        'pending'   => 'warning',
                        'failed'    => 'danger',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'confirmed' => 'Confirmado',
                        'pending'   => 'Pendente',
                        'failed'    => 'Falhado',
                    }),

                TextColumn::make('reference')
                    ->label('Referência')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('supported_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('supported_at', 'desc')
            ->filters([
                SelectFilter::make('province_id')
                    ->label('Província')
                    ->relationship('province', 'name')
                    ->hidden(fn () => auth()->user()?->hasRole('province_manager')),

                SelectFilter::make('type')
                    ->label('Tipo')
                    ->options([
                        'tithe'    => 'Dízimo',
                        'offering' => 'Oferta',
                        'mission'  => 'Missões',
                        'social'   => 'Social',
                        'other'    => 'Outro',
                    ]),

                SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'pending'   => 'Pendente',
                        'confirmed' => 'Confirmado',
                        'failed'    => 'Falhado',
                    ]),

                SelectFilter::make('payment_method')
                    ->label('Método')
                    ->options([
                        'mpesa' => 'M-Pesa',
                        'mpago' => 'Mpago / Emola',
                        'bank'  => 'Banco',
                        'cash'  => 'Numerário',
                        'other' => 'Outro',
                    ]),
            ])
            ->recordActions([
                Action::make('confirm')
                    ->label('Confirmar')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (FinancialSupport $record) => $record->status === 'pending')
                    ->action(fn (FinancialSupport $record) => $record->update(['status' => 'confirmed'])),

                Action::make('fail')
                    ->label('Marcar falhado')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (FinancialSupport $record) => $record->status === 'pending')
                    ->action(fn (FinancialSupport $record) => $record->update(['status' => 'failed'])),

                EditAction::make()->label('Editar'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([]),
            ]);
    }
}
