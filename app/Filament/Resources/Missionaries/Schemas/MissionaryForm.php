<?php

namespace App\Filament\Resources\Missionaries\Schemas;

use App\Models\Church;
use App\Models\Province;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MissionaryForm
{
    public static function configure(Schema $schema): Schema
    {
        $isMissionary    = auth()->user()?->hasRole('missionary');
        $isProvinceScope = auth()->user()?->hasAnyRole(['province_manager']);
        $isAdmin         = auth()->user()?->hasAnyRole(['super_admin', 'admin']);

        return $schema
            ->components([
                TextInput::make('full_name')
                    ->label('Nome completo')
                    ->required()
                    ->maxLength(150),

                Select::make('province_id')
                    ->label('Província')
                    ->options(Province::pluck('name', 'id')->all())
                    ->searchable()
                    ->required()
                    ->disabled($isMissionary || $isProvinceScope)
                    ->default(fn () => auth()->user()?->province_id),

                Select::make('church_id')
                    ->label('Igreja')
                    ->options(fn ($get) => Church::when(
                        $get('province_id'),
                        fn ($q, $pid) => $q->where('province_id', $pid)
                    )->pluck('name', 'id')->all())
                    ->searchable()
                    ->nullable(),

                Select::make('status')
                    ->label('Estado')
                    ->options([
                        'active'        => 'Activo',
                        'inactive'      => 'Inactivo',
                        'international' => 'Internacional',
                    ])
                    ->required()
                    ->default('active'),

                TextInput::make('specialization')
                    ->label('Especialização')
                    ->maxLength(150),

                TextInput::make('phone')
                    ->label('Telefone')
                    ->tel()
                    ->maxLength(30),

                TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->maxLength(100),

                DatePicker::make('started_at')
                    ->label('Início de actividade')
                    ->nullable(),

                FileUpload::make('photo_url')
                    ->label('Foto')
                    ->disk('public')
                    ->directory('missionaries/photos')
                    ->image()
                    ->columnSpanFull(),

                Textarea::make('bio')
                    ->label('Biografia')
                    ->rows(4)
                    ->columnSpanFull(),

                Textarea::make('needs')
                    ->label('Necessidades / Pedidos de oração')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }
}
