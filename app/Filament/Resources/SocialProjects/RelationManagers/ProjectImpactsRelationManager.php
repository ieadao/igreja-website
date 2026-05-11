<?php

namespace App\Filament\Resources\SocialProjects\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProjectImpactsRelationManager extends RelationManager
{
    protected static string $relationship = 'projectImpacts';

    protected static ?string $title = 'Impacto do projecto';

    public function form(Schema $form): Schema
    {
        return $form->components([
            TextInput::make('metric_name')
                ->label('Indicador')
                ->required()
                ->maxLength(150),

            TextInput::make('metric_value')
                ->label('Valor')
                ->numeric()
                ->required(),

            DatePicker::make('recorded_at')
                ->label('Data de registo')
                ->required(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('metric_name')
                    ->label('Indicador')
                    ->searchable(),

                TextColumn::make('metric_value')
                    ->label('Valor')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('recorded_at')
                    ->label('Data')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('recorded_at', 'desc')
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
