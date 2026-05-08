<?php

namespace App\Filament\Resources\News\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class NewsTable
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
                    ->limit(60),

                TextColumn::make('author.name')
                    ->label('Autor')
                    ->searchable()
                    ->toggleable(),

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

                TextColumn::make('published_at')
                    ->label('Publicado em')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->placeholder('—'),

                TextColumn::make('updated_at')
                    ->label('Atualizado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('updated_at', 'desc')
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
