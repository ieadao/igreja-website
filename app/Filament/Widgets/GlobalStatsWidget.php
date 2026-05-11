<?php

namespace App\Filament\Widgets;

use App\Models\Church;
use App\Models\ContactRequest;
use App\Models\Event;
use App\Models\Missionary;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class GlobalStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    public static function canView(): bool
    {
        return auth()->user()?->hasAnyRole(['super_admin', 'admin']) ?? false;
    }

    protected function getStats(): array
    {
        return [
            Stat::make('Igrejas', Church::where('status', 'active')->count())
                ->icon('heroicon-o-building-library')
                ->color('success'),

            Stat::make('Missionários', Missionary::where('status', 'active')->count())
                ->icon('heroicon-o-globe-alt')
                ->color('info'),

            Stat::make('Eventos este mês', Event::where('status', 'published')
                    ->whereYear('starts_at', now()->year)
                    ->whereMonth('starts_at', now()->month)
                    ->count())
                ->icon('heroicon-o-calendar-days')
                ->color('warning'),

            Stat::make('Contactos novos', ContactRequest::where('status', 'new')->count())
                ->icon('heroicon-o-inbox')
                ->color('danger'),
        ];
    }
}
