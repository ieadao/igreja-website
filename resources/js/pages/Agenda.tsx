import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import GlobalLayout from '@/layouts/GlobalLayout';
import EventCard from '@/components/cards/EventCard';
import CalendarView from '@/components/agenda/CalendarView';
import { cn } from '@/lib/utils';
import type { Event, PaginatedData, Province } from '@/types';

const TYPE_LABELS: Record<string, string> = {
    service:    'Culto',
    conference: 'Conferência',
    retreat:    'Retiro',
    seminar:    'Seminário',
    other:      'Evento',
};

interface Props {
    events: PaginatedData<Event>;
    types: string[];
    months: string[];
    provinces: Pick<Province, 'id' | 'name'>[];
    filters: { type?: string; scope?: string; mes?: string; province?: string };
}

export default function Agenda({ events, types, months, provinces, filters = {} }: Props) {
    const [type, setType]         = useState(filters.type ?? '');
    const [scope, setScope]       = useState(filters.scope ?? 'all');
    const [mes, setMes]           = useState(filters.mes ?? '');
    const [province, setProvince] = useState(filters.province ?? '');
    const [view, setView]         = useState<'list' | 'calendar'>('list');

    function apply(overrides: Record<string, string> = {}) {
        const params: Record<string, string> = {};
        const t  = overrides.type     ?? type;
        const sc = overrides.scope    ?? scope;
        const m  = overrides.mes      ?? mes;
        const p  = overrides.province ?? province;

        if (t) params.type = t;
        if (sc && sc !== 'all') params.scope = sc;
        if (m) params.mes = m;
        if (p) params.province = p;

        router.get('/agenda', params, { preserveState: true, preserveScroll: false });
    }

    function clear() {
        setType(''); setScope('all'); setMes(''); setProvince('');
        router.get('/agenda', {}, { preserveState: true, preserveScroll: false });
    }

    const hasFilters = type || scope !== 'all' || mes || province;

    function formatMonthLabel(ym: string) {
        const [y, m] = ym.split('-');
        const d = new Date(parseInt(y), parseInt(m) - 1);
        return d.toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' });
    }

    return (
        <GlobalLayout>
            <Head title="Agenda" />

            {/* Hero */}
            <section className="pt-16 lg:pt-20 bg-brand text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Calendário</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Agenda</h1>
                    <p className="text-white/70 mt-3 max-w-2xl text-lg">
                        Eventos, conferências e cultos do Ministério Alfa e Ômega.
                    </p>
                </div>
            </section>

            {/* Filter bar */}
            <div className="bg-white border-b border-border sticky top-16 lg:top-20 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
                    <select
                        value={type}
                        onChange={e => { setType(e.target.value); apply({ type: e.target.value }); }}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Todos os tipos</option>
                        {types.map(t => (
                            <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>
                        ))}
                    </select>

                    <select
                        value={scope}
                        onChange={e => { setScope(e.target.value); apply({ scope: e.target.value }); }}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="all">Nacional + Províncias</option>
                        <option value="national">Nacional</option>
                        <option value="province">Províncias</option>
                    </select>

                    <select
                        value={province}
                        onChange={e => { setProvince(e.target.value); apply({ province: e.target.value }); }}
                        disabled={scope === 'national'}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                        <option value="">Todas as províncias</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        value={mes}
                        onChange={e => { setMes(e.target.value); apply({ mes: e.target.value }); }}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Todos os meses</option>
                        {months.map(m => (
                            <option key={m} value={m}>{formatMonthLabel(m)}</option>
                        ))}
                    </select>

                    {hasFilters && (
                        <button onClick={clear} className="text-sm text-ink-muted hover:text-brand underline underline-offset-2">
                            Limpar filtros
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-2 border-l border-border pl-3">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                view === 'list' ? "bg-brand/10 text-brand" : "text-ink-muted hover:bg-gray-100"
                            )}
                            title="Ver em lista"
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                view === 'calendar' ? "bg-brand/10 text-brand" : "text-ink-muted hover:bg-gray-100"
                            )}
                            title="Ver em calendário"
                        >
                            <CalendarIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-cream min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                    {view === 'list' ? (
                        <div className="max-w-4xl mx-auto">
                            {events.data.length === 0 ? (
                                <div className="text-center py-24 text-ink-muted">
                                    <p className="text-lg">Nenhum evento encontrado com esses filtros.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {events.data.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <CalendarView events={events.data} />
                    )}

                    {/* Pagination - only show in list view */}
                    {view === 'list' && events.last_page > 1 && (
                        <div className="mt-10 flex justify-center gap-2 flex-wrap">
                            {events.links.map((link, i) => (
                                link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-sm border transition-colors',
                                            link.active
                                                ? 'bg-brand text-white border-brand'
                                                : 'bg-white border-border text-ink-muted hover:border-brand hover:text-brand',
                                        )}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-3 py-1.5 rounded-md text-sm border border-border text-ink-muted/40 bg-white cursor-default"
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GlobalLayout>
    );
}
