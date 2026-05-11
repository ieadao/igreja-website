<?php

namespace App\Filament\Resources\MissionReports\Schemas;

use App\Models\Missionary;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MissionReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('missionary_id')
                    ->label('Missionário')
                    ->options(function () {
                        $user = auth()->user();

                        if ($user?->hasRole('missionary')) {
                            return Missionary::where('user_id', $user->id)->pluck('full_name', 'id')->all();
                        }

                        if ($user?->hasRole('province_manager')) {
                            return Missionary::where('province_id', $user->province_id)->pluck('full_name', 'id')->all();
                        }

                        return Missionary::pluck('full_name', 'id')->all();
                    })
                    ->searchable()
                    ->required(),

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
                    ->required()
                    ->default('draft'),

                RichEditor::make('body')
                    ->label('Conteúdo')
                    ->toolbarButtons(['bold', 'italic', 'link', 'bulletList', 'orderedList', 'h2', 'h3', 'blockquote'])
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
