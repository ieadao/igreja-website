<?php

namespace App\Filament\Resources\Documents\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class DocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Título')
                    ->required()
                    ->maxLength(200)
                    ->columnSpanFull(),

                Select::make('category')
                    ->label('Categoria')
                    ->options([
                        'statute'    => 'Estatuto',
                        'regulation' => 'Regulamento',
                        'report'     => 'Relatório',
                        'other'      => 'Outro',
                    ])
                    ->required(),

                Toggle::make('is_public')
                    ->label('Público')
                    ->default(true),

                DateTimePicker::make('published_at')
                    ->label('Publicado em')
                    ->seconds(false)
                    ->nullable(),

                FileUpload::make('file_url')
                    ->label('Ficheiro (PDF)')
                    ->disk('public')
                    ->directory('documents')
                    ->acceptedFileTypes(['application/pdf'])
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
