<?php

namespace App\Filament\Resources\AccessCodes\Pages;

use App\Filament\Resources\AccessCodes\AccessCodeResource;
use App\Models\AccessCode;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListAccessCodes extends ListRecords
{
    protected static string $resource = AccessCodeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('generate')
                ->label('Gerar Códigos')
                ->icon('heroicon-o-sparkles')
                ->modalHeading('Gerar Códigos de Acesso')
                ->form([
                    TextInput::make('label')
                        ->label('Nota / Evento')
                        ->placeholder('Ex: Conferência Anual 2026')
                        ->maxLength(255),

                    TextInput::make('quantity')
                        ->label('Quantidade')
                        ->numeric()
                        ->default(1)
                        ->minValue(1)
                        ->maxValue(50)
                        ->required(),

                    TextInput::make('max_uses')
                        ->label('Limite de usos por código')
                        ->helperText('Deixe em branco para ilimitado.')
                        ->numeric()
                        ->minValue(1)
                        ->nullable(),

                    DateTimePicker::make('expires_at')
                        ->label('Expiração')
                        ->nullable()
                        ->seconds(false),
                ])
                ->action(function (array $data): void {
                    $qty = (int) ($data['quantity'] ?? 1);

                    for ($i = 0; $i < $qty; $i++) {
                        AccessCode::create([
                            'code'       => self::generateCode(),
                            'label'      => $data['label'] ?? null,
                            'max_uses'   => $data['max_uses'] ?? null,
                            'expires_at' => $data['expires_at'] ?? null,
                        ]);
                    }

                    Notification::make()
                        ->title($qty === 1 ? '1 código gerado.' : "{$qty} códigos gerados.")
                        ->success()
                        ->send();
                }),

            CreateAction::make()->label('Criar manualmente'),
        ];
    }

    private static function generateCode(): string
    {
        // Uppercase alphanum without ambiguous chars O/0/I/1
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $len = strlen($chars) - 1;
        $segments = [];

        for ($s = 0; $s < 4; $s++) {
            $seg = '';
            for ($c = 0; $c < 4; $c++) {
                $seg .= $chars[random_int(0, $len)];
            }
            $segments[] = $seg;
        }

        return implode('-', $segments);
    }
}
