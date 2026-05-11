<?php

namespace App\Filament\Resources\Partnerships\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PartnershipRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('org_name')
                    ->label('Organização')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('contact_name')
                    ->label('Responsável')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'institutional' => 'Institucional',
                        'business'      => 'Empresarial',
                        'media'         => 'Média',
                        'theological'   => 'Teológica',
                        'other'         => 'Outro',
                        default         => $state,
                    }),

                TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'new'       => 'warning',
                        'reviewing' => 'info',
                        'approved'  => 'success',
                        'rejected'  => 'danger',
                        default     => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'new'       => 'Novo',
                        'reviewing' => 'Em análise',
                        'approved'  => 'Aprovado',
                        'rejected'  => 'Rejeitado',
                        default     => $state,
                    }),

                TextColumn::make('created_at')
                    ->label('Recebido em')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'new'       => 'Novo',
                        'reviewing' => 'Em análise',
                        'approved'  => 'Aprovado',
                        'rejected'  => 'Rejeitado',
                    ]),

                SelectFilter::make('type')
                    ->label('Tipo')
                    ->options([
                        'institutional' => 'Institucional',
                        'business'      => 'Empresarial',
                        'media'         => 'Média',
                        'theological'   => 'Teológica',
                        'other'         => 'Outro',
                    ]),
            ])
            ->recordActions([
                EditAction::make()->label('Analisar'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
