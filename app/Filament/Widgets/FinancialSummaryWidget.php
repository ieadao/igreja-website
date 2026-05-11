<?php

namespace App\Filament\Widgets;

use App\Models\FinancialSupport;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class FinancialSummaryWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 3;

    public static function canView(): bool
    {
        return auth()->user()?->hasAnyRole(['super_admin', 'admin', 'province_manager']) ?? false;
    }

    protected function getStats(): array
    {
        $user = auth()->user();
        $base = FinancialSupport::confirmed();

        if ($user?->hasRole('province_manager')) {
            $base->where('province_id', $user->province_id);
        }

        $total    = (clone $base)->sum('amount');
        $tithes   = (clone $base)->where('type', 'tithe')->sum('amount');
        $missions = (clone $base)->where('type', 'mission')->sum('amount');
        $pending  = FinancialSupport::where('status', 'pending')
            ->when($user?->hasRole('province_manager'), fn ($q) => $q->where('province_id', $user->province_id))
            ->count();

        return [
            Stat::make('Total confirmado', 'MZN ' . number_format($total, 2, ',', '.'))
                ->icon('heroicon-o-banknotes')
                ->color('success'),

            Stat::make('Dízimos', 'MZN ' . number_format($tithes, 2, ',', '.'))
                ->icon('heroicon-o-arrow-trending-up')
                ->color('info'),

            Stat::make('Missões', 'MZN ' . number_format($missions, 2, ',', '.'))
                ->icon('heroicon-o-globe-alt')
                ->color('warning'),

            Stat::make('Pendentes', $pending)
                ->icon('heroicon-o-clock')
                ->color('danger'),
        ];
    }
}
