<?php

namespace App\Filament\Resources\FinancialSupports\Pages;

use App\Filament\Resources\FinancialSupports\FinancialSupportResource;
use App\Models\FinancialSupport;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListFinancialSupports extends ListRecords
{
    protected static string $resource = FinancialSupportResource::class;

    public function getTabs(): array
    {
        $user    = auth()->user();
        $isProvManager = $user?->hasRole('province_manager');
        $pid     = $user?->province_id;

        $pendingCount = FinancialSupport::where('status', 'pending')
            ->when($isProvManager, fn (Builder $q) => $q->where('province_id', $pid))
            ->count();

        return [
            'all' => Tab::make('Todas'),

            'pending' => Tab::make('Pendentes')
                ->badge($pendingCount)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending')),

            'confirmed' => Tab::make('Confirmadas')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'confirmed')),

            'failed' => Tab::make('Falhadas')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'failed')),
        ];
    }
}
