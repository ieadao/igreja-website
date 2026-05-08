<?php

namespace App\Filament\Resources\News\Schemas;

use App\Models\Church;
use App\Models\Province;
use App\Models\Region;
use App\Models\Zone;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NewsForm
{
    public static function configure(Schema $schema): Schema
    {
        $isAdmin = auth()->user()?->hasAnyRole(['super_admin', 'admin']);

        return $schema
            ->components([
                Select::make('scope_type')
                    ->label('Âmbito')
                    ->options([
                        'national' => 'Nacional',
                        'province' => 'Província',
                        'region'   => 'Região',
                        'zone'     => 'Zona',
                        'church'   => 'Igreja',
                    ])
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('scope_id', null))
                    ->default('province')
                    ->visible($isAdmin),

                Select::make('scope_id')
                    ->label('Entidade')
                    ->options(function ($get) {
                        return match ($get('scope_type')) {
                            'province' => Province::pluck('name', 'id')->all(),
                            'region'   => Region::pluck('name', 'id')->all(),
                            'zone'     => Zone::pluck('name', 'id')->all(),
                            'church'   => Church::pluck('name', 'id')->all(),
                            default    => [],
                        };
                    })
                    ->searchable()
                    ->nullable()
                    ->visible(fn ($get) => $isAdmin && in_array($get('scope_type'), ['province', 'region', 'zone', 'church'])),

                TextInput::make('title')
                    ->label('Título')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug()))
                    ->columnSpanFull(),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(220)
                    ->unique(ignoreRecord: true),

                Select::make('status')
                    ->options([
                        'draft'     => 'Rascunho',
                        'published' => 'Publicado',
                        'archived'  => 'Arquivado',
                    ])
                    ->required()
                    ->default('draft')
                    ->live(),

                DateTimePicker::make('published_at')
                    ->label('Publicado em')
                    ->seconds(false)
                    ->nullable()
                    ->visible(fn ($get) => $get('status') === 'published'),

                FileUpload::make('cover_image')
                    ->label('Imagem de capa')
                    ->disk('public')
                    ->directory('news/covers')
                    ->image()
                    ->columnSpanFull(),

                Textarea::make('excerpt')
                    ->label('Resumo')
                    ->rows(2)
                    ->maxLength(500)
                    ->columnSpanFull(),

                RichEditor::make('body')
                    ->label('Conteúdo')
                    ->toolbarButtons(['bold', 'italic', 'link', 'bulletList', 'orderedList', 'h2', 'h3', 'blockquote'])
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
