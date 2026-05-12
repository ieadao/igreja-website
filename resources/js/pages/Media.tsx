import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import GlobalLayout from '@/layouts/GlobalLayout';
import SermonCard from '@/components/cards/SermonCard';
import { cn } from '@/lib/utils';
import type { Sermon, PaginatedData, Province } from '@/types';

interface Props {
    sermons: PaginatedData<Sermon>;
    series: string[];
    preachers: string[];
    months: string[];
    provinces: Pick<Province, 'id' | 'name'>[];
    filters: { serie?: string; pregador?: string; scope?: string; mes?: string; province?: string };
}

export default function Media({ sermons, series, preachers, months, provinces, filters = {} }: Props) {
    const [serie, setSerie]       = useState(filters.serie ?? '');
    const [pregador, setPregador] = useState(filters.pregador ?? '');
    const [scope, setScope]       = useState(filters.scope ?? 'all');
    const [mes, setMes]           = useState(filters.mes ?? '');
    const [province, setProvince] = useState(filters.province ?? '');

    function apply(overrides: Record<string, string> = {}) {
        const params: Record<string, string> = {};
        const s   = overrides.serie    ?? serie;
        const p   = overrides.pregador ?? pregador;
        const sc  = overrides.scope    ?? scope;
        const m   = overrides.mes      ?? mes;
        const pr  = overrides.province ?? province;

        if (s) params.serie = s;
        if (p) params.pregador = p;
        if (sc && sc !== 'all') params.scope = sc;
        if (m) params.mes = m;
        if (pr) params.province = pr;

        router.get('/media', params, { preserveState: true, preserveScroll: false });
    }

    function clear() {
        setSerie(''); setPregador(''); setScope('all'); setMes(''); setProvince('');
        router.get('/media', {}, { preserveState: true, preserveScroll: false });
    }

    const hasFilters = serie || pregador || scope !== 'all' || mes || province;

    function formatMonthLabel(ym: string) {
        const [y, m] = ym.split('-');
        const d = new Date(parseInt(y), parseInt(m) - 1);
        return d.toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' });
    }

    return (
        <GlobalLayout>
            <Head title="Média — Pregações" />

            {/* Hero */}
            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Arquivo</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Pregações</h1>
                    <p className="text-white/65 mt-3 max-w-2xl text-lg">
                        Ouça e assista às mensagens do Ministério Alfa e Ômega.
                    </p>
                </div>
            </section>

            {/* Filter bar */}
            <div className="bg-white border-b border-border sticky top-16 lg:top-20 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
                    <select
                        value={serie}
                        onChange={e => { setSerie(e.target.value); apply({ serie: e.target.value }); }}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Todas as séries</option>
                        {series.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        value={pregador}
                        onChange={e => { setPregador(e.target.value); apply({ pregador: e.target.value }); }}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Todos os pregadores</option>
                        {preachers.map(p => <option key={p} value={p}>{p}</option>)}
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
                        <button onClick={clear} className="text-sm text-ink-muted hover:text-brand-text underline underline-offset-2">
                            Limpar filtros
                        </button>
                    )}

                    <span className="ml-auto text-sm text-ink-muted">
                        {sermons.total} {sermons.total === 1 ? 'pregação' : 'pregações'}
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-cream min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                    {sermons.data.length === 0 ? (
                        <div className="text-center py-24 text-ink-muted">
                            <p className="text-lg">Nenhuma pregação encontrada com esses filtros.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sermons.data.map(sermon => (
                                <SermonCard key={sermon.id} sermon={sermon} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {sermons.last_page > 1 && (
                        <div className="mt-10 flex justify-center gap-2 flex-wrap">
                            {sermons.links.map((link, i) => (
                                link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-sm border transition-colors',
                                            link.active
                                                ? 'bg-brand-dark text-white border-brand-dark'
                                                : 'bg-white border-border text-ink-muted hover:border-brand hover:text-brand-text',
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
