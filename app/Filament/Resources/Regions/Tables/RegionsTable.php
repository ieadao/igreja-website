<?php

namespace App\Filament\Resources\Regions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class RegionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('province.name')
                    ->label('Província')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('zones_count')
                    ->label('Zonas')
                    ->counts('zones')
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'   => 'success',
                        'inactive' => 'danger',
                    }),
            ])
            ->filters([
                SelectFilter::make('province')
                    ->relationship('province', 'name'),
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
