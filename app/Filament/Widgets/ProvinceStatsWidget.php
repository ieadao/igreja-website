<?php

namespace App\Filament\Widgets;

use App\Models\Church;
use App\Models\Event;
use App\Models\News;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ProvinceStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 2;

    public static function canView(): bool
    {
        return auth()->user()?->hasRole('province_manager') ?? false;
    }

    protected function getStats(): array
    {
        $pid = auth()->user()?->province_id;

        return [
            Stat::make('Igrejas', Church::where('province_id', $pid)
                    ->where('status', 'active')
                    ->count())
                ->icon('heroicon-o-building-library')
                ->color('success'),

            Stat::make('Eventos publicados', Event::where('scope_id', $pid)
                    ->where('scope_type', 'province')
                    ->where('status', 'published')
                    ->count())
                ->icon('heroicon-o-calendar-days')
                ->color('info'),

            Stat::make('Notícias publicadas', News::where('scope_id', $pid)
                    ->where('scope_type', 'province')
                    ->where('status', 'published')
                    ->count())
                ->icon('heroicon-o-newspaper')
                ->color('warning'),
        ];
    }
}
