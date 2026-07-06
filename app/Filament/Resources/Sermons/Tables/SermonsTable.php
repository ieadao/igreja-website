<?php

namespace App\Filament\Resources\Sermons\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SermonsTable
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

                TextColumn::make('speaker_name')
                    ->label('Pregador')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('series')
                    ->label('Série')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('preached_at')
                    ->label('Data')
                    ->date('d/m/Y')
                    ->sortable(),

                TextColumn::make('duration_minutes')
                    ->label('Duração')
                    ->formatStateUsing(fn (?int $state) => $state ? "{$state} min" : '—')
                    ->toggleable(isToggledHiddenByDefault: true),

                IconColumn::make('is_featured')
                    ->label('Destaque')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'published' => 'success',
                        'draft'     => 'gray',
                        'archived'  => 'danger',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'published' => 'Publicado',
                        'draft'     => 'Rascunho',
                        'archived'  => 'Arquivado',
                    }),
            ])
            ->defaultSort('preached_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft'     => 'Rascunho',
                        'published' => 'Publicado',
                        'archived'  => 'Arquivado',
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
