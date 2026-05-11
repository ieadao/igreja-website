<?php

namespace App\Filament\Resources\Missionaries\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MissionariesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo_url')
                    ->label('')
                    ->disk('public')
                    ->circular()
                    ->width(40)
                    ->height(40)
                    ->toggleable(),

                TextColumn::make('full_name')
                    ->label('Nome')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('province.name')
                    ->label('Província')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('church.name')
                    ->label('Igreja')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('specialization')
                    ->label('Especialização')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('phone')
                    ->label('Telefone')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('started_at')
                    ->label('Desde')
                    ->date('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'        => 'success',
                        'inactive'      => 'gray',
                        'international' => 'info',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'active'        => 'Activo',
                        'inactive'      => 'Inactivo',
                        'international' => 'Internacional',
                    }),
            ])
            ->defaultSort('full_name')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active'        => 'Activo',
                        'inactive'      => 'Inactivo',
                        'international' => 'Internacional',
                    ]),

                SelectFilter::make('province_id')
                    ->label('Província')
                    ->relationship('province', 'name'),
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
