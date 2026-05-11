<?php

namespace App\Filament\Resources\Missionaries\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MissionReportsRelationManager extends RelationManager
{
    protected static string $relationship = 'missionReports';

    protected static ?string $title = 'Relatórios de missão';

    public function form(Schema $form): Schema
    {
        return $form->components([
            TextInput::make('title')
                ->label('Título')
                ->required()
                ->maxLength(200)
                ->columnSpanFull(),

            DatePicker::make('report_date')
                ->label('Data do relatório')
                ->required(),

            Select::make('status')
                ->options([
                    'draft'     => 'Rascunho',
                    'published' => 'Publicado',
                ])
                ->default('draft')
                ->required(),

            RichEditor::make('body')
                ->label('Conteúdo')
                ->toolbarButtons(['bold', 'italic', 'link', 'bulletList', 'orderedList', 'h2', 'h3', 'blockquote'])
                ->required()
                ->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->limit(60),

                TextColumn::make('report_date')
                    ->label('Data')
                    ->date('d/m/Y')
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'published' => 'success',
                        'draft'     => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'published' => 'Publicado',
                        'draft'     => 'Rascunho',
                    }),
            ])
            ->defaultSort('report_date', 'desc')
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
