import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Event } from '@/types';

interface Props {
    events: Event[];
}

export default function CalendarView({ events }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const prevMonthDays = daysInMonth(year, month - 1);
    const days = [];

    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }

    // Next month filler
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
    }

    function getEventsForDate(date: Date) {
        return events.filter(e => {
            const d = new Date(e.starts_at);
            return d.getFullYear() === date.getFullYear() &&
                   d.getMonth() === date.getMonth() &&
                   d.getDate() === date.getDate();
        });
    }

    const monthName = currentDate.toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50/50">
                <h2 className="font-display text-xl font-bold text-ink capitalize">{monthName}</h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-ink-muted"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1 text-xs font-medium text-brand-text hover:bg-brand/5 rounded-md"
                    >
                        Hoje
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-ink-muted"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border bg-gray-50/30">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                    <div key={d} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-ink-muted/60">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days.map((d, i) => {
                    const dateEvents = getEventsForDate(d.date);
                    const isToday = new Date().toDateString() === d.date.toDateString();

                    return (
                        <div
                            key={i}
                            className={cn(
                                "min-h-[100px] lg:min-h-[140px] p-2 border-r border-b border-border group transition-colors hover:bg-brand/5",
                                !d.currentMonth && "bg-gray-50/50 text-ink-muted/40",
                                (i + 1) % 7 === 0 && "border-r-0"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                    "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                                    isToday ? "bg-brand text-white" : "text-ink"
                                )}>
                                    {d.day}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {dateEvents.map(event => (
                                    <Link
                                        key={event.id}
                                        href={`/agenda/${event.slug}`}
                                        className="block p-1 rounded bg-brand/10 border-l-2 border-brand text-[10px] font-medium text-brand-text hover:bg-brand/20 transition-colors line-clamp-1"
                                        title={event.title}
                                    >
                                        {new Date(event.starts_at).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })} {event.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
