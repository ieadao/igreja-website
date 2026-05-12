import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { MapChurch } from '@/components/map/ChurchMap';

const ChurchMap = lazy(() => import('@/components/map/ChurchMap'));

function MapSkeleton() {
    return (
        <div className="h-full w-full flex items-center justify-center bg-brand-pale animate-pulse rounded-xl">
            <p className="text-sm text-ink-muted">A carregar mapa…</p>
        </div>
    );
}

export default function ChurchMapSection() {
    const { data: churches = [], isError } = useQuery<MapChurch[]>({
        queryKey: ['churches-map'],
        queryFn: () => fetch('/api/churches').then((r) => r.json()),
        staleTime: 1000 * 60 * 10,
    });

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-text mb-3">
                        Presença Nacional
                    </p>
                    <h2 className="font-display text-4xl font-semibold text-ink mb-4">
                        Igrejas em Todo Moçambique
                    </h2>
                    <p className="text-ink-muted max-w-xl mx-auto">
                        Encontre a sua comunidade local. Clique em qualquer marcador para conhecer a igreja.
                    </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: 480 }}>
                    {isError ? (
                        <div className="h-full flex items-center justify-center bg-brand-pale">
                            <p className="text-sm text-ink-muted">Não foi possível carregar o mapa.</p>
                        </div>
                    ) : (
                        <Suspense fallback={<MapSkeleton />}>
                            <ChurchMap churches={churches} />
                        </Suspense>
                    )}
                </div>

                {churches.length > 0 && (
                    <p className="text-center text-xs text-ink-faint mt-4">
                        {churches.length} igrejas activas em todo o país
                    </p>
                )}
            </div>
        </section>
    );
}
