<?php

namespace App\Filament\Resources\AccessCodes\Tables;

use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class AccessCodesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Código')
                    ->copyable()
                    ->fontFamily('mono')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('label')
                    ->label('Nota')
                    ->placeholder('—')
                    ->searchable(),

                IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('uses')
                    ->label('Usos')
                    ->sortable(),

                TextColumn::make('max_uses')
                    ->label('Limite')
                    ->placeholder('∞')
                    ->sortable(),

                TextColumn::make('expires_at')
                    ->label('Expira em')
                    ->dateTime('d/m/Y H:i')
                    ->placeholder('—')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Criado em')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_active')->label('Activo'),
            ])
            ->defaultSort('created_at', 'desc')
            ->bulkActions([
                DeleteBulkAction::make(),
            ]);
    }
}
