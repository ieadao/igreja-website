<?php

namespace App\Filament\Resources\Contacts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ContactRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('province.name')
                    ->label('Província')
                    ->sortable()
                    ->toggleable()
                    ->hidden(fn () => auth()->user()?->hasRole('province_manager')),

                TextColumn::make('name')
                    ->label('Nome')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('phone')
                    ->label('Telefone')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'general'     => 'Geral',
                        'counseling'  => 'Aconselhamento',
                        'partnership' => 'Parceria',
                        'support'     => 'Apoio',
                        default       => $state,
                    }),

                TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'new'         => 'warning',
                        'in_progress' => 'info',
                        'resolved'    => 'success',
                        'closed'      => 'gray',
                        default       => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'new'         => 'Novo',
                        'in_progress' => 'Em curso',
                        'resolved'    => 'Resolvido',
                        'closed'      => 'Encerrado',
                        default       => $state,
                    }),

                TextColumn::make('created_at')
                    ->label('Recebido em')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('province_id')
                    ->label('Província')
                    ->relationship('province', 'name')
                    ->hidden(fn () => auth()->user()?->hasRole('province_manager')),

                SelectFilter::make('type')
                    ->label('Tipo')
                    ->options([
                        'general'     => 'Geral',
                        'counseling'  => 'Aconselhamento',
                        'partnership' => 'Parceria',
                        'support'     => 'Apoio',
                    ]),
            ])
            ->recordActions([
                EditAction::make()->label('Responder'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
