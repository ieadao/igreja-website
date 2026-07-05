import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense, useMemo, useState } from 'react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import {
    Building2,
    ChevronRight,
    Church as ChurchIcon,
    MapPin,
    MapPinned,
    Search,
    X,
} from 'lucide-react';
import type { Province, Region, Zone } from '@/types';
import type { MapFocus, MapPin as MapPinType } from '@/components/map/PinMap';

const PinMap = lazy(() => import('@/components/map/PinMap'));

interface ChurchPin {
    id: number;
    name: string;
    slug: string;
    type: 'church' | 'congregation';
    address: string | null;
    pastor_name: string | null;
    lat: number | null;
    lng: number | null;
}

interface ZoneWithChurches extends Zone {
    churches_count: number;
    churches: ChurchPin[];
}

interface RegionWithData extends Region {
    churches_count: number;
    zones: ZoneWithChurches[];
}

interface Props {
    province: Province;
    regions: RegionWithData[];
}

function points(churches: ChurchPin[]): [number, number][] {
    return churches
        .filter((c): c is ChurchPin & { lat: number; lng: number } => c.lat !== null && c.lng !== null)
        .map(c => [c.lat, c.lng]);
}

function matches(church: ChurchPin, query: string) {
    const q = query.toLowerCase();
    return church.name.toLowerCase().includes(q) || (church.address ?? '').toLowerCase().includes(q);
}

export default function Localizacoes({ province, regions }: Props) {
    const [query, setQuery] = useState('');
    const [expandedRegions, setExpandedRegions] = useState<Set<number>>(
        () => new Set(regions[0] ? [regions[0].id] : []),
    );
    const [expandedZones, setExpandedZones] = useState<Set<number>>(new Set());
    const [focus, setFocus] = useState<MapFocus>(() => {
        const all = regions.flatMap(r => r.zones.flatMap(z => points(z.churches)));
        return all.length > 0 ? { type: 'bounds', points: all } : null;
    });
    const [activeChurchId, setActiveChurchId] = useState<number | null>(null);

    const totalZones    = regions.reduce((s, r) => s + r.zones.length, 0);
    const totalChurches = regions.reduce((s, r) => s + r.churches_count, 0);

    const allPins: MapPinType[] = useMemo(() => regions.flatMap(region =>
        region.zones.flatMap(zone =>
            zone.churches
                .filter((c): c is ChurchPin & { lat: number; lng: number } => c.lat !== null && c.lng !== null)
                .map(c => ({
                    id: c.id,
                    name: c.name,
                    lat: c.lat,
                    lng: c.lng,
                    subtitle: `${zone.name} · ${region.name}`,
                    href: `/provincia/${province.slug}/${region.slug}/${zone.slug}/${c.slug}`,
                })),
        ),
    ), [regions, province.slug]);

    const searching = query.trim().length > 0;

    // When searching, only keep branches that contain a match, and force them open.
    const visibleRegions = useMemo(() => {
        if (!searching) return regions;
        return regions
            .map(region => ({
                ...region,
                zones: region.zones
                    .map(zone => ({ ...zone, churches: zone.churches.filter(c => matches(c, query)) }))
                    .filter(zone => zone.churches.length > 0),
            }))
            .filter(region => region.zones.length > 0);
    }, [regions, query, searching]);

    function toggleRegion(region: RegionWithData) {
        setExpandedRegions(prev => {
            const next = new Set(prev);
            next.has(region.id) ? next.delete(region.id) : next.add(region.id);
            return next;
        });
        const pts = points(region.zones.flatMap(z => z.churches));
        if (pts.length > 0) setFocus({ type: 'bounds', points: pts });
        setActiveChurchId(null);
    }

    function toggleZone(zone: ZoneWithChurches) {
        setExpandedZones(prev => {
            const next = new Set(prev);
            next.has(zone.id) ? next.delete(zone.id) : next.add(zone.id);
            return next;
        });
        const pts = points(zone.churches);
        if (pts.length > 0) setFocus({ type: 'bounds', points: pts });
        setActiveChurchId(null);
    }

    function previewChurch(church: ChurchPin) {
        setActiveChurchId(church.id);
    }

    function focusChurch(church: ChurchPin) {
        setActiveChurchId(church.id);
        if (church.lat !== null && church.lng !== null) {
            setFocus({ type: 'point', lat: church.lat, lng: church.lng, zoom: 16 });
        }
    }

    return (
        <ProvinceLayout province={province}>
            <Head title={`Localizações — ${province.name}`} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-ink-muted flex-wrap">
                    <Link href="/" className="hover:text-brand-text transition-colors">MAO</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Link href={`/provincia/${province.slug}`} className="hover:text-brand-text transition-colors">{province.name}</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-ink font-medium">Localizações</span>
                </div>
            </div>

            {/* Hero */}
            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Localizações</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Onde estamos</h1>
                    <p className="text-ink-muted mt-2">{province.name} — encontre uma igreja perto de si</p>

                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2 text-ink-muted text-sm">
                            <Building2 size={16} className="text-brand-text" />
                            <span><strong className="text-ink">{regions.length}</strong> região{regions.length !== 1 ? 'ões' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-ink-muted text-sm">
                            <MapPinned size={16} className="text-brand-text" />
                            <span><strong className="text-ink">{totalZones}</strong> zona{totalZones !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-ink-muted text-sm">
                            <ChurchIcon size={16} className="text-brand-text" />
                            <span><strong className="text-ink">{totalChurches}</strong> igrej{totalChurches !== 1 ? 'as' : 'a'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {regions.length === 0 ? (
                    <div className="text-center py-24">
                        <MapPin size={48} className="mx-auto text-brand-text mb-4" />
                        <p className="text-ink-muted">Nenhuma região registada ainda.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_26rem] gap-6 items-start">
                        {/* Map */}
                        <div className="h-[45vh] lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24 rounded-2xl overflow-hidden border border-border shadow-sm relative bg-cream">
                            <Suspense fallback={
                                <div className="h-full flex items-center justify-center animate-pulse">
                                    <p className="text-sm text-ink-muted">A carregar mapa…</p>
                                </div>
                            }>
                                <PinMap pins={allPins} focus={focus} activeId={activeChurchId} zoom={11} />
                            </Suspense>
                            {allPins.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-cream/90 pointer-events-none px-6 text-center">
                                    <p className="text-sm text-ink-muted">Ainda sem coordenadas registadas para mostrar no mapa.</p>
                                </div>
                            )}
                        </div>

                        {/* Tree */}
                        <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col lg:max-h-[calc(100vh-8rem)]">
                            <div className="p-3 border-b border-border">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        placeholder="Procurar igreja ou endereço…"
                                        className="w-full pl-8 pr-8 h-9 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery('')}
                                            aria-label="Limpar pesquisa"
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-y-auto p-2">
                                {visibleRegions.length === 0 ? (
                                    <p className="text-sm text-ink-muted text-center py-10 px-4">
                                        Nenhuma igreja encontrada para &ldquo;{query}&rdquo;.
                                    </p>
                                ) : (
                                    visibleRegions.map(region => {
                                        const regionOpen = searching || expandedRegions.has(region.id);
                                        return (
                                            <div key={region.id} className="mb-1">
                                                <button
                                                    onClick={() => toggleRegion(region)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-cream/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    <ChevronRight
                                                        size={15}
                                                        className={`shrink-0 text-ink-muted transition-transform ${regionOpen ? 'rotate-90' : ''}`}
                                                    />
                                                    <Building2 size={15} className="shrink-0 text-brand-text" />
                                                    <span className="flex-1 text-sm font-semibold text-ink">{region.name}</span>
                                                    <span className="text-xs text-ink-muted">
                                                        {region.churches_count}
                                                    </span>
                                                </button>

                                                {regionOpen && (
                                                    <div className="ml-[1.15rem] pl-3 border-l border-border">
                                                        {region.zones.length === 0 ? (
                                                            <p className="text-xs text-ink-muted py-2 px-3">Nenhuma zona registada nesta região.</p>
                                                        ) : (
                                                            region.zones.map(zone => {
                                                                const zoneOpen = searching || expandedZones.has(zone.id);
                                                                return (
                                                                    <div key={zone.id} className="mb-0.5">
                                                                        <button
                                                                            onClick={() => toggleZone(zone)}
                                                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-cream/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                                        >
                                                                            <ChevronRight
                                                                                size={13}
                                                                                className={`shrink-0 text-ink-muted transition-transform ${zoneOpen ? 'rotate-90' : ''}`}
                                                                            />
                                                                            <MapPinned size={13} className="shrink-0 text-brand-text" />
                                                                            <span className="flex-1 text-sm text-ink">{zone.name}</span>
                                                                            <span className="text-xs text-ink-muted">
                                                                                {zone.churches_count}
                                                                            </span>
                                                                        </button>

                                                                        {zoneOpen && (
                                                                            <div className="ml-[1.05rem] pl-3 border-l border-border">
                                                                                {zone.churches.length === 0 ? (
                                                                                    <p className="text-xs text-ink-muted py-2 px-3">Nenhuma igreja registada nesta zona.</p>
                                                                                ) : (
                                                                                    zone.churches.map(church => (
                                                                                        <div
                                                                                            key={church.id}
                                                                                            onMouseEnter={() => previewChurch(church)}
                                                                                            className={`group flex items-center gap-2 pl-3 pr-1.5 py-2 rounded-lg transition-colors ${
                                                                                                activeChurchId === church.id ? 'bg-brand-pale' : 'hover:bg-cream/70'
                                                                                            }`}
                                                                                        >
                                                                                            <ChurchIcon size={13} className="shrink-0 text-brand-text" />
                                                                                            <Link
                                                                                                href={`/provincia/${province.slug}/${region.slug}/${zone.slug}/${church.slug}`}
                                                                                                className="flex-1 min-w-0 text-sm text-ink hover:text-brand-text transition-colors truncate"
                                                                                            >
                                                                                                {church.name}
                                                                                            </Link>
                                                                                            {church.lat !== null && church.lng !== null && (
                                                                                                <button
                                                                                                    onClick={() => focusChurch(church)}
                                                                                                    aria-label={`Ver ${church.name} no mapa`}
                                                                                                    className="shrink-0 p-1.5 rounded-md text-ink-muted hover:text-brand-text hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                                                                >
                                                                                                    <MapPin size={13} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    ))
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                        {!searching && (
                                                            <Link
                                                                href={`/provincia/${province.slug}/${region.slug}`}
                                                                className="block text-xs font-medium text-brand-text hover:underline px-3 py-2"
                                                            >
                                                                Ver região completa →
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProvinceLayout>
    );
}
