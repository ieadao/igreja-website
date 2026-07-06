import { Head, Link, router } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Province, Event, PaginatedData } from '@/types';

interface Props {
    province: Province;
    events: PaginatedData<Event>;
    types: string[];
}

function EventCard({ event }: { event: Event }) {
    return (
        <Link
            href={`/agenda/${event.slug}`}
            className="block bg-white rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow"
        >
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-text">
                        <Calendar size={15} />
                        <span className="text-xs font-medium">{formatDate(event.starts_at)}</span>
                    </div>
                    <span className="text-xs text-brand-text font-medium capitalize bg-brand-pale px-2 py-0.5 rounded-full">
                        {event.type}
                    </span>
                </div>
                <h3 className="font-semibold text-ink leading-snug">{event.title}</h3>
                {event.location && (
                    <div className="flex items-center gap-1 text-ink-muted text-xs">
                        <MapPin size={13} />
                        <span>{event.location}</span>
                    </div>
                )}
                {event.is_online && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full self-start font-medium">
                        Online
                    </span>
                )}
            </div>
        </Link>
    );
}

export default function ProvinceEvents({ province, events, types }: Props) {
    const base = `/provincia/${province.slug}`;

    function setType(type: string | null) {
        router.get(
            `${base}/eventos`,
            type ? { type } : {},
            { preserveState: true, replace: true },
        );
    }

    const currentType = new URLSearchParams(window.location.search).get('type');

    return (
        <ProvinceLayout province={province}>
            <Head title={`Eventos — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Agenda</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Eventos</h1>
                    <p className="text-ink-muted mt-2">{province.name}</p>
                </div>
            </div>

            {types.length > 0 && (
                <div className="bg-white border-b border-border py-4 sticky top-16 lg:top-20 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setType(null)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                !currentType ? 'bg-brand-dark text-white' : 'bg-cream text-ink-muted hover:text-ink'
                            }`}
                        >
                            Todos
                        </button>
                        {types.map(type => (
                            <button
                                key={type}
                                onClick={() => setType(type)}
                                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                                    currentType === type ? 'bg-brand-dark text-white' : 'bg-cream text-ink-muted hover:text-ink'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {events.data.length === 0 ? (
                    <div className="text-center py-24">
                        <Calendar size={48} className="mx-auto text-brand-text mb-4" />
                        <p className="text-ink-muted">Nenhum evento encontrado.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.data.map(event => <EventCard key={event.id} event={event} />)}
                        </div>

                        {events.last_page > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                {events.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        preserveState
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-brand-dark text-white'
                                                : link.url
                                                ? 'text-ink hover:bg-cream'
                                                : 'text-ink-muted opacity-40 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </ProvinceLayout>
    );
}
