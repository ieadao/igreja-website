<?php

namespace App\Filament\Resources\FamilyGroups\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FamilyGroupsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('church.name')
                    ->label('Igreja')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('name')
                    ->label('Nome')
                    ->searchable(),

                TextColumn::make('leader_name')
                    ->label('Líder')
                    ->searchable(),

                TextColumn::make('meeting_day')
                    ->label('Dia')
                    ->formatStateUsing(fn (?string $state) => match ($state) {
                        'mon' => 'Segunda', 'tue' => 'Terça', 'wed' => 'Quarta',
                        'thu' => 'Quinta', 'fri' => 'Sexta', 'sat' => 'Sábado', 'sun' => 'Domingo',
                        default => '—',
                    }),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active'   => 'success',
                        'inactive' => 'danger',
                    }),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo']),
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
