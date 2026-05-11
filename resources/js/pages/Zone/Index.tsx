import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import ChurchCard from '@/components/cards/ChurchCard';
import type { Province, Region, Zone, Church } from '@/types';
import type { MapPin } from '@/components/map/PinMap';

const PinMap = lazy(() => import('@/components/map/PinMap'));

interface Props {
    province: Province;
    region: Region;
    zone: Zone;
    churches: Church[];
}

export default function ZoneIndex({ province, region, zone, churches }: Props) {
    const base        = `/provincia/${province.slug}`;
    const regionBase  = `${base}/${region.slug}`;
    const zoneBase    = `${regionBase}/${zone.slug}`;

    const pins: MapPin[] = churches
        .filter(c => c.lat && c.lng)
        .map(c => ({
            id:       c.id,
            name:     c.name,
            lat:      c.lat!,
            lng:      c.lng!,
            href:     `${zoneBase}/${c.slug}`,
            subtitle: c.pastor_name ?? undefined,
        }));

    const mapCenter = pins.length > 0
        ? ([pins[0].lat, pins[0].lng] as [number, number])
        : undefined;

    return (
        <ProvinceLayout province={province}>
            <Head title={`${zone.name} — ${region.name} — ${province.name}`} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-ink-muted flex-wrap">
                    <Link href="/" className="hover:text-brand transition-colors">MAO</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Link href={base} className="hover:text-brand transition-colors">{province.name}</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Link href={`${base}/localizacoes`} className="hover:text-brand transition-colors">Localizações</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Link href={regionBase} className="hover:text-brand transition-colors">{region.name}</Link>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-ink font-medium">{zone.name}</span>
                </div>
            </div>

            {/* Header */}
            <section className="bg-cream border-b border-border py-12 lg:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Zona</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-ink">{zone.name}</h1>
                    <p className="text-ink-muted mt-1">{region.name} · {province.name}</p>

                    <div className="flex items-center gap-1.5 mt-5 text-sm text-ink-muted">
                        <Building2 className="w-4 h-4 text-brand" />
                        <strong className="text-ink">{churches.length}</strong>
                        &nbsp;igrej{churches.length !== 1 ? 'as' : 'a'} activ{churches.length !== 1 ? 'as' : 'a'}
                    </div>
                </div>
            </section>

            {/* Map */}
            {pins.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: 360 }}>
                        <Suspense fallback={
                            <div className="h-full flex items-center justify-center bg-brand-pale animate-pulse">
                                <p className="text-sm text-ink-muted">A carregar mapa…</p>
                            </div>
                        }>
                            <PinMap pins={pins} center={mapCenter} zoom={13} />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* Church cards */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                {churches.length === 0 ? (
                    <div className="text-center py-20 text-ink-muted">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-brand-light" />
                        <p>Nenhuma igreja registada nesta zona.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {churches.map(church => (
                            <ChurchCard
                                key={church.id}
                                church={church}
                                href={`${zoneBase}/${church.slug}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ProvinceLayout>
    );
}
