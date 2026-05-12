import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Suspense, lazy } from 'react';
import GlobalLayout from '@/layouts/GlobalLayout';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, Search } from 'lucide-react';
import type { Church, SharedProps } from '@/types';

const PinMap = lazy(() => import('@/components/map/PinMap'));

interface Props {
    churches: Church[];
    filters: { province?: string };
}

const TYPE_LABEL: Record<string, string> = {
    church:       'Igreja',
    congregation: 'Congregação',
};

export default function Churches({ churches, filters = {} }: Props) {
    const { provinces } = usePage<SharedProps>().props;
    const [search, setSearch]       = useState('');
    const [province, setProvince]   = useState(filters.province ?? '');

    function applyProvince(slug: string) {
        setProvince(slug);
        setSearch('');
        const params: Record<string, string> = {};
        if (slug) params.province = slug;
        router.get('/igrejas', params, { preserveState: true, preserveScroll: false });
    }

    const pins = churches
        .filter(c => c.lat && c.lng)
        .map(c => ({
            id:       c.id,
            name:     c.name,
            lat:      c.lat!,
            lng:      c.lng!,
            subtitle: c.province?.name,
            href:     c.province ? `/provincia/${c.province.slug}` : undefined,
        }));

    const filtered = search
        ? churches.filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.address?.toLowerCase().includes(search.toLowerCase()) ||
              c.zone?.name.toLowerCase().includes(search.toLowerCase()),
          )
        : churches;

    return (
        <GlobalLayout>
            <Head title="Igrejas — MAO" />

            {/* Hero */}
            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Localizações</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Nossas Igrejas</h1>
                    <p className="text-white/65 mt-3 max-w-2xl text-lg">
                        {churches.length} igrej{churches.length !== 1 ? 'as' : 'a'} e congregaçõe{churches.length !== 1 ? 's' : ''} em todo o território nacional.
                    </p>
                </div>
            </section>

            {/* Map */}
            {pins.length > 0 && (
                <div className="h-80 lg:h-96 border-b border-border">
                    <Suspense fallback={<div className="h-full bg-cream animate-pulse" />}>
                        <PinMap pins={pins} className="h-full" />
                    </Suspense>
                </div>
            )}

            {/* Filter bar */}
            <div className="bg-white border-b border-border sticky top-16 lg:top-20 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
                    {/* Province dropdown — server-side filter */}
                    <select
                        value={province}
                        onChange={e => applyProvince(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Todas as províncias</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.slug}>{p.name}</option>
                        ))}
                    </select>

                    {/* Search — client-side on already-filtered list */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Pesquisar…"
                            className="pl-8 pr-3 h-9 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-48 sm:w-64"
                        />
                    </div>

                    {(province || search) && (
                        <button
                            onClick={() => { applyProvince(''); setSearch(''); }}
                            className="text-sm text-ink-muted hover:text-brand-text underline underline-offset-2"
                        >
                            Limpar filtros
                        </button>
                    )}

                    <span className="ml-auto text-sm text-ink-muted">
                        {filtered.length} igrej{filtered.length !== 1 ? 'as' : 'a'}
                    </span>
                </div>
            </div>

            {/* List */}
            <div className="bg-cream min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24 text-ink-muted">
                            <MapPin size={40} className="mx-auto mb-4 text-brand-text" />
                            <p>Nenhuma igreja encontrada.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map(church => {
                                const parts = [
                                    church.province?.slug,
                                    church.region?.slug,
                                    church.zone?.slug,
                                    church.slug,
                                ].filter(Boolean);
                                const href = parts.length >= 4
                                    ? `/provincia/${parts.join('/')}`
                                    : church.province ? `/provincia/${church.province.slug}` : '#';

                                return (
                                    <Link
                                        key={church.id}
                                        href={href}
                                        className="group bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-brand/30 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-ink group-hover:text-brand-text transition-colors leading-snug">
                                                {church.name}
                                            </h3>
                                            <Badge variant="outline" className="text-xs ml-2 shrink-0">
                                                {TYPE_LABEL[church.type] ?? church.type}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1.5 text-sm text-ink-muted">
                                            {church.province && (
                                                <p className="flex items-center gap-1.5">
                                                    <MapPin size={13} className="text-brand-text shrink-0" />
                                                    {church.province.name}
                                                    {church.address && ` · ${church.address}`}
                                                </p>
                                            )}
                                            {church.pastor_name && (
                                                <p className="flex items-center gap-1.5">
                                                    <User size={13} className="text-brand-text shrink-0" />
                                                    {church.pastor_name}
                                                </p>
                                            )}
                                            {church.service_times && church.service_times.length > 0 && (
                                                <p className="flex items-center gap-1.5">
                                                    <Clock size={13} className="text-brand-text shrink-0" />
                                                    {church.service_times[0].label ?? `${church.service_times[0].day} ${church.service_times[0].time}`}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </GlobalLayout>
    );
}
