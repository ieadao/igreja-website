<?php

namespace App\Filament\Resources\Events\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class EventsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('cover_image')
                    ->label('')
                    ->disk('public')
                    ->width(60)
                    ->height(40)
                    ->toggleable(),

                TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'conference' => 'primary',
                        'retreat'    => 'info',
                        'service'    => 'success',
                        'youth'      => 'warning',
                        'social'     => 'gray',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'conference' => 'Conferência',
                        'retreat'    => 'Retiro',
                        'service'    => 'Culto',
                        'youth'      => 'Juventude',
                        'social'     => 'Social',
                        default      => 'Outro',
                    }),

                TextColumn::make('starts_at')
                    ->label('Início')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),

                TextColumn::make('location')
                    ->label('Local')
                    ->limit(30)
                    ->toggleable(),

                IconColumn::make('is_online')
                    ->label('Online')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'published' => 'success',
                        'draft'     => 'gray',
                        'cancelled' => 'danger',
                        'completed' => 'info',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'published' => 'Publicado',
                        'draft'     => 'Rascunho',
                        'cancelled' => 'Cancelado',
                        'completed' => 'Concluído',
                    }),

                TextColumn::make('updated_at')
                    ->label('Atualizado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('starts_at', 'desc')
            ->filters([
                SelectFilter::make('type')
                    ->label('Tipo')
                    ->options([
                        'conference' => 'Conferência',
                        'retreat'    => 'Retiro',
                        'service'    => 'Culto',
                        'youth'      => 'Juventude',
                        'social'     => 'Social',
                        'other'      => 'Outro',
                    ]),

                SelectFilter::make('status')
                    ->options([
                        'draft'     => 'Rascunho',
                        'published' => 'Publicado',
                        'cancelled' => 'Cancelado',
                        'completed' => 'Concluído',
                    ]),
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
