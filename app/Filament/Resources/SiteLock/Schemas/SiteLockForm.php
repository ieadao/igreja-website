<?php

namespace App\Filament\Resources\SiteLock\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SiteLockForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Toggle::make('is_active')
                ->label('Ativar bloqueio do site')
                ->helperText('Quando ativo, visitantes sem código de acesso não poderão ver o site.')
                ->columnSpanFull(),

            Select::make('scope')
                ->label('Âmbito do bloqueio')
                ->options([
                    'global' => 'Todo o site',
                    'paths'  => 'Caminhos específicos',
                ])
                ->default('global')
                ->live()
                ->required(),

            TagsInput::make('locked_paths')
                ->label('Caminhos bloqueados')
                ->helperText('Ex: /noticias, /media/*, /agenda — use * como wildcard')
                ->placeholder('/caminho')
                ->visible(fn ($get) => $get('scope') === 'paths')
                ->columnSpanFull(),

            TextInput::make('gate_title')
                ->label('Título da página de acesso')
                ->default('Acesso Restrito')
                ->required()
                ->maxLength(100),

            Textarea::make('gate_message')
                ->label('Mensagem para os visitantes')
                ->helperText('Opcional. Ex: "Este evento é exclusivo para membros. Insira o seu código."')
                ->rows(3)
                ->columnSpanFull(),
        ]);
    }
}
