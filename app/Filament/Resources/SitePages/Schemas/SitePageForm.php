<?php

namespace App\Filament\Resources\SitePages\Schemas;

use App\Models\HomogeneousGroupType;
use App\SitePages\SitePageTemplateRegistry;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SitePageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Título')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', str($state)->slug())),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(220)
                    ->unique(ignoreRecord: true),

                Select::make('template')
                    ->label('Template')
                    ->options(SitePageTemplateRegistry::options())
                    ->required()
                    ->default('about')
                    ->live(),

                Select::make('group_type_id')
                    ->label('Grupo Homogéneo')
                    ->options(
                        HomogeneousGroupType::orderBy('order')
                            ->get()
                            ->mapWithKeys(fn ($g) => [
                                $g->id => $g->acronym
                                    ? "{$g->acronym} — {$g->name}"
                                    : $g->name,
                            ])
                    )
                    ->searchable()
                    ->nullable()
                    ->placeholder('Nenhum (página genérica)')
                    ->visible(fn ($get) => $get('template') === 'homogeneous_group')
                    ->required(fn ($get) => $get('template') === 'homogeneous_group'),

                FileUpload::make('hero_image')
                    ->label('Imagem de destaque')
                    ->disk('public')
                    ->directory('pages/heroes')
                    ->image()
                    ->columnSpanFull(),

                Textarea::make('excerpt')
                    ->label('Resumo / subtítulo')
                    ->rows(3)
                    ->columnSpanFull(),

                TextInput::make('whatsapp_number')
                    ->label('WhatsApp')
                    ->maxLength(30)
                    ->placeholder('+258840000000')
                    ->tel()
                    ->helperText('Número de WhatsApp específico desta página'),

                Toggle::make('is_published')
                    ->label('Publicada'),

                RichEditor::make('content')
                    ->label('Conteúdo principal')
                    ->toolbarButtons(['bold', 'italic', 'link', 'bulletList', 'orderedList', 'h2', 'h3', 'blockquote'])
                    ->columnSpanFull(),

                Section::make('Conteúdo do template Sobre')
                    ->visible(fn ($get) => $get('template') === 'about')
                    ->schema([
                        TextInput::make('sections.about.hero_quote')
                            ->label('Citação do hero')
                            ->maxLength(255),
                        TextInput::make('sections.about.hero_reference')
                            ->label('Referência bíblica')
                            ->maxLength(120),
                        Textarea::make('sections.about.mission')
                            ->label('Missão')
                            ->rows(4)
                            ->columnSpanFull(),
                        Textarea::make('sections.about.vision')
                            ->label('Visão')
                            ->rows(4)
                            ->columnSpanFull(),
                        Repeater::make('sections.about.timeline')
                            ->label('Linha do tempo')
                            ->schema([
                                TextInput::make('year')->label('Ano')->required(),
                                TextInput::make('label')->label('Título')->required(),
                                Textarea::make('desc')->label('Descrição')->rows(3)->required()->columnSpanFull(),
                            ])
                            ->defaultItems(0)
                            ->columnSpanFull(),
                        TextInput::make('sections.about.cta_heading')
                            ->label('Título do CTA'),
                        Textarea::make('sections.about.cta_body')
                            ->label('Texto do CTA')
                            ->rows(2),
                        TextInput::make('sections.about.cta_button_label')
                            ->label('Botão do CTA'),
                        TextInput::make('sections.about.cta_button_href')
                            ->label('Link do CTA')
                            ->placeholder('/igrejas'),
                        Placeholder::make('about_dynamic_notice')
                            ->label('Secções dinâmicas')
                            ->content('A liderança e os documentos públicos continuam a ser carregados automaticamente a partir das tabelas existentes.'),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Section::make('Conteúdo do template Grupo Homogéneo')
                    ->visible(fn ($get) => $get('template') === 'homogeneous_group')
                    ->schema([
                        Repeater::make('sections.homogeneous_group.scripture_highlights')
                            ->label('Destaques bíblicos')
                            ->schema([
                                TextInput::make('label')
                                    ->label('Texto')
                                    ->placeholder('Ex: 1Rs 2:1')
                                    ->required(),
                                TextInput::make('url')
                                    ->label('Link YouVersion')
                                    ->placeholder('https://www.bible.com/pt/bible/...')
                                    ->url()
                                    ->nullable(),
                            ])
                            ->helperText('Adicione um ou mais destaques. Quando houver link, o utilizador poderá clicar para abrir o versículo.')
                            ->defaultItems(0)
                            ->columnSpanFull(),
                        Repeater::make('sections.homogeneous_group.key_points')
                            ->label('Pontos principais')
                            ->schema([
                                TextInput::make('title')->label('Título')->required(),
                                Textarea::make('body')->label('Texto')->rows(3)->required()->columnSpanFull(),
                            ])
                            ->defaultItems(0)
                            ->columnSpanFull(),
                        TextInput::make('sections.homogeneous_group.cta_heading')
                            ->label('Título do CTA'),
                        Textarea::make('sections.homogeneous_group.cta_body')
                            ->label('Texto do CTA')
                            ->rows(2),
                        TextInput::make('sections.homogeneous_group.cta_button_label')
                            ->label('Botão do CTA'),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Section::make('Conteúdo do template Estrutura da Igreja')
                    ->visible(fn ($get) => $get('template') === 'church_structure')
                    ->schema([
                        TextInput::make('sections.church_structure.intro_title')
                            ->label('Título introdutório'),
                        Textarea::make('sections.church_structure.intro_body')
                            ->label('Texto introdutório')
                            ->rows(3)
                            ->columnSpanFull(),
                        Repeater::make('sections.church_structure.blocks')
                            ->label('Blocos editoriais')
                            ->schema([
                                Select::make('type')
                                    ->label('Tipo')
                                    ->options([
                                        'text' => 'Texto',
                                        'image' => 'Imagem / diagrama',
                                    ])
                                    ->default('text')
                                    ->required()
                                    ->live(),
                                TextInput::make('title')
                                    ->label('Título')
                                    ->required(),
                                RichEditor::make('body')
                                    ->label('Conteúdo')
                                    ->toolbarButtons(['bold', 'italic', 'link', 'bulletList', 'orderedList', 'h2', 'h3', 'blockquote'])
                                    ->visible(fn ($get) => ($get('type') ?? 'text') === 'text')
                                    ->columnSpanFull(),
                                FileUpload::make('image')
                                    ->label('Imagem')
                                    ->disk('public')
                                    ->directory('pages/structure')
                                    ->image()
                                    ->visible(fn ($get) => $get('type') === 'image')
                                    ->columnSpanFull(),
                                TextInput::make('caption')
                                    ->label('Legenda')
                                    ->visible(fn ($get) => $get('type') === 'image')
                                    ->columnSpanFull(),
                            ])
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),
            ]);
    }
}
