<?php

namespace App\Filament\Resources\FinancialSupports\Pages;

use App\Filament\Resources\FinancialSupports\FinancialSupportResource;
use App\Models\FinancialSupport;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFinancialSupport extends EditRecord
{
    protected static string $resource = FinancialSupportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('confirm')
                ->label('Confirmar')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->status === 'pending')
                ->action(function () {
                    $this->record->update(['status' => 'confirmed']);
                    $this->refreshFormData(['status']);
                }),

            Action::make('fail')
                ->label('Marcar falhado')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->status === 'pending')
                ->action(function () {
                    $this->record->update(['status' => 'failed']);
                    $this->refreshFormData(['status']);
                }),

            DeleteAction::make()
                ->visible(fn () => auth()->user()?->hasAnyRole(['super_admin', 'admin'])),
        ];
    }
}
