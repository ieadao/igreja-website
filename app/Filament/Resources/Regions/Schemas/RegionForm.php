<?php

namespace App\Filament\Resources\Regions\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RegionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('province_id')
                    ->relationship('province', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),

                TextInput::make('name')
                    ->required()
                    ->maxLength(100)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug())),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(120),

                Textarea::make('description')
                    ->rows(3)
                    ->columnSpanFull(),

                FileUpload::make('cover_image')
                    ->image()
                    ->disk('public')
                    ->directory('regions/covers')
                    ->columnSpanFull(),

                Select::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo'])
                    ->required()
                    ->default('active'),
            ]);
    }
}
