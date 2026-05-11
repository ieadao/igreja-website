<?php

namespace App\Filament\Resources\SocialProjects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SocialProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nome')
                    ->searchable()
                    ->sortable()
                    ->limit(60),

                TextColumn::make('province.name')
                    ->label('Província')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('category')
                    ->label('Categoria')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'family'    => 'info',
                        'education' => 'warning',
                        'health'    => 'success',
                        'other'     => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'family'    => 'Família',
                        'education' => 'Educação',
                        'health'    => 'Saúde',
                        'other'     => 'Outro',
                    }),

                TextColumn::make('started_at')
                    ->label('Início')
                    ->date('d/m/Y')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('ended_at')
                    ->label('Conclusão')
                    ->date('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'    => 'success',
                        'completed' => 'info',
                        'paused'    => 'warning',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'active'    => 'Activo',
                        'completed' => 'Concluído',
                        'paused'    => 'Pausado',
                    }),
            ])
            ->defaultSort('started_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active'    => 'Activo',
                        'completed' => 'Concluído',
                        'paused'    => 'Pausado',
                    ]),

                SelectFilter::make('category')
                    ->options([
                        'family'    => 'Família',
                        'education' => 'Educação',
                        'health'    => 'Saúde',
                        'other'     => 'Outro',
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
