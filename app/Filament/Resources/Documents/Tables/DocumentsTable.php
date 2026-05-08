<?php

namespace App\Filament\Resources\Documents\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class DocumentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->sortable()
                    ->limit(60),

                TextColumn::make('category')
                    ->label('Categoria')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'statute'    => 'Estatuto',
                        'regulation' => 'Regulamento',
                        'report'     => 'Relatório',
                        default      => 'Outro',
                    }),

                IconColumn::make('is_public')
                    ->label('Público')
                    ->boolean(),

                TextColumn::make('file_size_kb')
                    ->label('Tamanho')
                    ->formatStateUsing(fn (?int $state) => $state ? "{$state} KB" : '—')
                    ->toggleable(isToggledHiddenByDefault: true),

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
                SelectFilter::make('category')
                    ->label('Categoria')
                    ->options([
                        'statute'    => 'Estatuto',
                        'regulation' => 'Regulamento',
                        'report'     => 'Relatório',
                        'other'      => 'Outro',
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
