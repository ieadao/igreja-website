import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { storageUrl } from '@/lib/utils';
import { ChevronDown, ChevronUp, MapPin, Building2 } from 'lucide-react';
import type { Province, Region, Zone } from '@/types';

interface ZoneWithCount extends Zone {
    churches_count: number;
}

interface RegionWithData extends Region {
    churches_count: number;
    zones: ZoneWithCount[];
}

interface Props {
    province: Province;
    regions: RegionWithData[];
}

function RegionCard({ region, province }: { region: RegionWithData; province: Province }) {
    const [expanded, setExpanded] = useState(false);
    const regionHref = `/provincia/${province.slug}/${region.slug}`;

    return (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-cream/50 transition-colors"
            >
                {region.cover_image && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <img src={storageUrl(region.cover_image)} alt={region.name} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink">{region.name}</h3>
                    <p className="text-ink-muted text-sm mt-0.5">
                        {region.zones.length} zona{region.zones.length !== 1 ? 's' : ''} ·{' '}
                        {region.churches_count} igrej{region.churches_count !== 1 ? 'as' : 'a'}
                    </p>
                </div>
                {expanded ? (
                    <ChevronUp size={20} className="text-ink-muted shrink-0" />
                ) : (
                    <ChevronDown size={20} className="text-ink-muted shrink-0" />
                )}
            </button>

            {expanded && region.zones.length > 0 && (
                <div className="border-t border-border divide-y divide-border">
                    {region.zones.map(zone => (
                        <Link
                            key={zone.id}
                            href={`${regionHref}/${zone.slug}`}
                            className="px-5 py-3 flex items-center justify-between bg-cream/30 hover:bg-brand-pale transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-brand-text shrink-0" />
                                <span className="text-sm text-ink">{zone.name}</span>
                            </div>
                            <span className="text-xs text-ink-muted">
                                {zone.churches_count} igrej{zone.churches_count !== 1 ? 'as' : 'a'}
                            </span>
                        </Link>
                    ))}
                    <div className="px-5 py-3 bg-cream/20">
                        <Link href={regionHref} className="text-xs font-medium text-brand-text hover:underline">
                            Ver todas as zonas em {region.name} →
                        </Link>
                    </div>
                </div>
            )}

            {expanded && region.zones.length === 0 && (
                <div className="border-t border-border px-5 py-4 text-sm text-ink-muted bg-cream/30">
                    Nenhuma zona registada nesta região.
                </div>
            )}
        </div>
    );
}

export default function Localizacoes({ province, regions }: Props) {
    const totalChurches = regions.reduce((sum, r) => sum + r.churches_count, 0);

    return (
        <ProvinceLayout province={province}>
            <Head title={`Localizações — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Localizações</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Nossas Igrejas</h1>
                    <p className="text-ink-muted mt-2">{province.name}</p>

                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2 text-ink-muted text-sm">
                            <Building2 size={16} className="text-brand-text" />
                            <span><strong className="text-ink">{regions.length}</strong> regiões</span>
                        </div>
                        <div className="flex items-center gap-2 text-ink-muted text-sm">
                            <MapPin size={16} className="text-brand-text" />
                            <span><strong className="text-ink">{totalChurches}</strong> igrejas</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {regions.length === 0 ? (
                    <div className="text-center py-24">
                        <MapPin size={48} className="mx-auto text-brand-text mb-4" />
                        <p className="text-ink-muted">Nenhuma região registada ainda.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {regions.map(region => (
                            <RegionCard key={region.id} region={region} province={province} />
                        ))}
                    </div>
                )}
            </div>
        </ProvinceLayout>
    );
}
