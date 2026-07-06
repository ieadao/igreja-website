<?php

namespace App\Filament\Resources\Events\RelationManagers;

use App\Exports\EventRegistrationsExport;
use Filament\Actions\Action;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Maatwebsite\Excel\Facades\Excel;

class EventRegistrationsRelationManager extends RelationManager
{
    protected static string $relationship = 'registrations';

    protected static ?string $title = 'Inscrições';

    protected function getHeaderActions(): array
    {
        return [
            Action::make('exportXlsx')
                ->label('Exportar XLSX')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('success')
                ->action(function () {
                    $event    = $this->getOwnerRecord();
                    $filename = 'inscricoes-' . str($event->title)->slug() . '.xlsx';

                    return Excel::download(new EventRegistrationsExport($event->id), $filename);
                }),
        ];
    }

    public function canCreate(): bool
    {
        return false;
    }

    public function canEdit(mixed $record): bool
    {
        return false;
    }

    public function canDelete(mixed $record): bool
    {
        return false;
    }

    public function form(Schema $form): Schema
    {
        return $form->components([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nome')
                    ->searchable(),

                TextColumn::make('phone')
                    ->label('Telefone'),

                TextColumn::make('payment_proof')
                    ->label('Comprovativo')
                    ->formatStateUsing(fn (?string $state) => $state ? 'Ver comprovativo' : '—')
                    ->url(fn ($record) => $record->payment_proof
                        ? asset('storage/' . $record->payment_proof)
                        : null)
                    ->openUrlInNewTab()
                    ->color(fn ($record) => $record->payment_proof ? 'primary' : 'gray'),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'confirmed'  => 'success',
                        'waitlisted' => 'warning',
                        'cancelled'  => 'danger',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'confirmed'  => 'Confirmado',
                        'waitlisted' => 'Lista de espera',
                        'cancelled'  => 'Cancelado',
                    }),

                TextColumn::make('created_at')
                    ->label('Inscrito em')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
