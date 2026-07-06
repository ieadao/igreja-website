<?php

namespace App\Filament\Resources\Sermons\Schemas;

use App\Models\Province;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SermonForm
{
    public static function configure(Schema $schema): Schema
    {
        $isAdmin = auth()->user()?->hasAnyRole(['super_admin', 'admin']);

        return $schema
            ->components([
                TextInput::make('speaker_name')
                    ->label('Pregador')
                    ->required()
                    ->maxLength(150),

                Select::make('scope_type')
                    ->label('Âmbito')
                    ->options([
                        'national' => 'Nacional',
                        'province' => 'Província',
                    ])
                    ->live()
                    ->afterStateUpdated(fn ($set) => $set('scope_id', null))
                    ->default('province')
                    ->visible($isAdmin),

                Select::make('scope_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->nullable()
                    ->visible(fn ($get) => $isAdmin && $get('scope_type') === 'province'),

                TextInput::make('title')
                    ->label('Título')
                    ->required()
                    ->maxLength(200),

                TextInput::make('series')
                    ->label('Série')
                    ->maxLength(150),

                TextInput::make('video_url')
                    ->label('URL do vídeo (YouTube)')
                    ->url()
                    ->maxLength(500),

                TextInput::make('audio_url')
                    ->label('URL do áudio')
                    ->url()
                    ->maxLength(500),

                FileUpload::make('cover_image')
                    ->label('Imagem de capa')
                    ->disk('public')
                    ->directory('sermons/covers')
                    ->image()
                    ->columnSpanFull(),

                FileUpload::make('pdf_url')
                    ->label('PDF (notas/esboço)')
                    ->disk('public')
                    ->directory('sermons/pdfs')
                    ->acceptedFileTypes(['application/pdf']),

                TextInput::make('duration_minutes')
                    ->label('Duração (min)')
                    ->numeric()
                    ->nullable(),

                DatePicker::make('preached_at')
                    ->label('Data da pregação')
                    ->required(),

                Select::make('status')
                    ->options([
                        'draft'     => 'Rascunho',
                        'published' => 'Publicado',
                        'archived'  => 'Arquivado',
                    ])
                    ->required()
                    ->default('draft'),

                Toggle::make('is_featured')
                    ->label('Destacar na página inicial')
                    ->helperText('A pregação publicada mais recente com destaque aparece na página inicial.')
                    ->default(false)
                    ->visible($isAdmin),

                Textarea::make('description')
                    ->label('Descrição')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }
}
