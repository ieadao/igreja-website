<?php

namespace App\Filament\Resources\ChurchPrograms\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ChurchProgramsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('church.name')
                    ->label('Igreja')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('groupType.name')
                    ->label('Tipo de Grupo')
                    ->searchable(),

                TextColumn::make('day_of_week')
                    ->label('Dia')
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta',
                        'thu' => 'Quinta', 'fri' => 'Sexta', 'sat' => 'Sábado', 'sun' => 'Domingo',
                        default => $state,
                    }),

                TextColumn::make('start_time')
                    ->label('Hora')
                    ->time('H:i'),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'    => 'success',
                        'inactive'  => 'danger',
                        'suspended' => 'warning',
                    }),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo', 'suspended' => 'Suspenso']),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
