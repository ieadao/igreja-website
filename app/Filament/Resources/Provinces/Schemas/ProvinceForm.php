<?php

namespace App\Filament\Resources\Provinces\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ProvinceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(100)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug())),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(120)
                    ->unique(ignoreRecord: true),

                TextInput::make('code')
                    ->maxLength(10)
                    ->unique(ignoreRecord: true),

                TextInput::make('country')
                    ->required()
                    ->default('Moçambique')
                    ->maxLength(60),

                FileUpload::make('hero_image')
                    ->image()
                    ->disk('public')
                    ->directory('provinces/heroes')
                    ->columnSpanFull(),

                TextInput::make('hero_video_url')
                    ->url()
                    ->maxLength(500),

                TextInput::make('tagline')
                    ->maxLength(200),

                Textarea::make('description')
                    ->rows(4)
                    ->columnSpanFull(),

                Select::make('status')
                    ->options(['active' => 'Ativo', 'inactive' => 'Inativo'])
                    ->required()
                    ->default('active'),
            ]);
    }
}
