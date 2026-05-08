<?php

namespace App\Filament\Resources\Zones\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ZonesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('region.name')
                    ->label('Região')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('churches_count')
                    ->label('Igrejas')
                    ->counts('churches')
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'   => 'success',
                        'inactive' => 'danger',
                    }),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo']),
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
