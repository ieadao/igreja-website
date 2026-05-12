import { Head, Link } from '@inertiajs/react';
import { Building2, ChevronRight, MapPin } from 'lucide-react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { Badge } from '@/components/ui/badge';
import type { Province, Region, Zone } from '@/types';

interface ZoneWithCount extends Zone {
    churches_count: number;
}

interface Props {
    province: Province;
    region: Region;
    zones: ZoneWithCount[];
}

export default function RegionIndex({ province, region, zones }: Props) {
    const base     = `/provincia/${province.slug}`;
    const regionBase = `${base}/${region.slug}`;
    const totalChurches = zones.reduce((s, z) => s + z.churches_count, 0);

    return (
        <ProvinceLayout province={province}>
            <Head title={`${region.name} — ${province.name}`} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-ink-muted flex-wrap">
                    <Link href="/" className="hover:text-brand-text transition-colors">MAO</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Link href={base} className="hover:text-brand-text transition-colors">{province.name}</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Link href={`${base}/localizacoes`} className="hover:text-brand-text transition-colors">Localizações</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-ink font-medium">{region.name}</span>
                </div>
            </div>

            {/* Header */}
            <section className="bg-cream border-b border-border py-12 lg:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Região</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-ink">{region.name}</h1>
                    <p className="text-ink-muted mt-1">{province.name}</p>

                    <div className="flex gap-6 mt-6 text-sm text-ink-muted">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-brand-text" />
                            <strong className="text-ink">{zones.length}</strong> zona{zones.length !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-brand-text" />
                            <strong className="text-ink">{totalChurches}</strong> igrej{totalChurches !== 1 ? 'as' : 'a'}
                        </span>
                    </div>
                </div>
            </section>

            {/* Zones grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                {zones.length === 0 ? (
                    <div className="text-center py-20 text-ink-muted">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-brand-text" />
                        <p>Nenhuma zona registada nesta região.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {zones.map(zone => (
                            <Link
                                key={zone.id}
                                href={`${regionBase}/${zone.slug}`}
                                className="group bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-brand/30 transition-all"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h2 className="font-semibold text-ink group-hover:text-brand-text transition-colors">
                                            {zone.name}
                                        </h2>
                                        <p className="text-sm text-ink-muted mt-1">
                                            {zone.churches_count} igrej{zone.churches_count !== 1 ? 'as' : 'a'}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="shrink-0 text-xs border-brand/30 text-brand-text"
                                    >
                                        Zona
                                    </Badge>
                                </div>
                                <p className="text-xs text-brand-text mt-4 font-medium group-hover:underline">
                                    Ver igrejas →
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </ProvinceLayout>
    );
}
