import { Link } from '@inertiajs/react';
import { MapPin, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types';

const TYPE_LABELS: Record<string, string> = {
    service:    'Culto',
    conference: 'Conferência',
    retreat:    'Retiro',
    seminar:    'Seminário',
    other:      'Evento',
};

function formatEventDate(dateString: string) {
    const d = new Date(dateString);
    return {
        day:   d.toLocaleDateString('pt-MZ', { day: '2-digit' }),
        month: d.toLocaleDateString('pt-MZ', { month: 'short' }).replace('.', '').toUpperCase(),
        time:  d.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' }),
    };
}

export default function EventCard({ event }: { event: Event }) {
    const { day, month, time } = formatEventDate(event.starts_at);

    return (
        <div className="group flex gap-4 bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
            <div className="shrink-0 w-14 h-16 rounded-lg bg-brand flex flex-col items-center justify-center text-brand-dark select-none">
                <span className="text-xl font-bold leading-none">{day}</span>
                <span className="text-[10px] uppercase tracking-widest mt-0.5 opacity-80">{month}</span>
            </div>

            <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-xs border-brand/40 text-brand-text mb-1">
                    {TYPE_LABELS[event.type] ?? 'Evento'}
                </Badge>
                <h3 className="font-semibold text-ink leading-snug group-hover:text-brand-text transition-colors line-clamp-1">
                    {event.title}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted">
                    <span>{time}h</span>
                    {event.is_online ? (
                        <span className="flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5" /> Online
                        </span>
                    ) : event.location ? (
                        <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </span>
                    ) : null}
                </div>
            </div>

            <Link href={`/agenda/${event.slug}`} className="shrink-0 self-center">
                <Button
                    size="sm"
                    variant="outline"
                    className="border-brand text-brand-text hover:bg-brand hover:text-white"
                >
                    Ver
                </Button>
            </Link>
        </div>
    );
}
