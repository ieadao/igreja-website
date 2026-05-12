import { Link } from '@inertiajs/react';
import type { Event } from '@/types';

const TYPE_LABELS: Record<string, string> = {
    service:    'Culto',
    conference: 'Conferência',
    retreat:    'Retiro',
    seminar:    'Seminário',
    other:      'Evento',
};

function EventCard({ event }: { event: Event }) {
    const date = new Date(event.starts_at);
    const day   = date.toLocaleDateString('pt-MZ', { day: '2-digit' });
    const month = date.toLocaleDateString('pt-MZ', { month: 'short' }).replace('.', '').toUpperCase();
    const time  = date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' });

    return (
        <Link
            href={`/agenda/${event.slug}`}
            className="group flex gap-5 p-5 rounded-2xl border border-border bg-white hover:border-brand hover:bg-brand-pale/30 transition-all"
        >
            {/* Date block */}
            <div className="shrink-0 w-14 text-center">
                <span className="block font-display text-3xl font-semibold text-brand-text leading-none">{day}</span>
                <span className="block text-xs font-semibold uppercase tracking-widest text-ink-muted mt-0.5">{month}</span>
            </div>

            {/* Divider */}
            <div className="shrink-0 w-px bg-border" />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        {TYPE_LABELS[event.type] ?? event.type}
                    </span>
                    {event.is_online && (
                        <span className="text-xs bg-brand-pale text-brand-text px-2 py-0.5 rounded-full">Online</span>
                    )}
                </div>
                <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand-text transition-colors leading-snug truncate">
                    {event.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                    {time}{event.location ? ` · ${event.location}` : ''}
                </p>
            </div>

            {/* Arrow */}
            <div className="shrink-0 self-center text-ink-faint group-hover:text-brand-text transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}

export default function NationalEventsSection({ events }: { events: Event[] }) {
    return (
        <section className="py-20 bg-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-text mb-3">
                            Agenda Nacional
                        </p>
                        <h2 className="font-display text-4xl font-semibold text-ink">
                            Próximos Eventos
                        </h2>
                    </div>
                    <Link
                        href="/agenda"
                        className="shrink-0 text-sm font-semibold text-brand-text hover:text-brand-dark transition-colors"
                    >
                        Ver agenda completa →
                    </Link>
                </div>

                {events.length === 0 ? (
                    <p className="text-ink-muted">Nenhum evento nacional agendado de momento.</p>
                ) : (
                    <div className="flex flex-col gap-4 max-w-2xl">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
