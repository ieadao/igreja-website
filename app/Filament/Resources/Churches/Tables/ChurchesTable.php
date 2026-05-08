<?php

namespace App\Filament\Resources\Churches\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ChurchesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'church'       => 'primary',
                        'congregation' => 'info',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'church'       => 'Igreja',
                        'congregation' => 'Congregação',
                    }),

                TextColumn::make('province.name')
                    ->label('Província')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('pastor_name')
                    ->label('Pastor')
                    ->searchable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'   => 'success',
                        'inactive' => 'danger',
                        'plant'    => 'warning',
                    }),
            ])
            ->filters([
                SelectFilter::make('province')
                    ->relationship('province', 'name'),
                SelectFilter::make('type')
                    ->options(['church' => 'Igreja', 'congregation' => 'Congregação']),
                SelectFilter::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo', 'plant' => 'Planta']),
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
