import { Head, Link } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import SermonCard from '@/components/cards/SermonCard';
import { Mic2, ArrowRight } from 'lucide-react';
import type { Province, Sermon } from '@/types';

interface Props {
    province: Province;
    sermons: Sermon[];
}

export default function ProvinceSermons({ province, sermons }: Props) {
    return (
        <ProvinceLayout province={province}>
            <Head title={`Pregações — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Média</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Pregações</h1>
                    <p className="text-ink-muted mt-2">{province.name}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {sermons.length === 0 ? (
                    <div className="text-center py-24">
                        <Mic2 size={48} className="mx-auto text-brand-light mb-4" />
                        <p className="text-ink-muted mb-6">Nenhuma pregação publicada para esta província ainda.</p>
                        <Link
                            href="/media"
                            className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
                        >
                            Ver todas as pregações nacionais <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sermons.map(sermon => (
                                <SermonCard key={sermon.id} sermon={sermon} />
                            ))}
                        </div>

                        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
                            <p className="text-sm text-ink-muted">A mostrar as {sermons.length} pregações mais recentes</p>
                            <Link
                                href={`/media?province=${province.id}`}
                                className="inline-flex items-center gap-1.5 text-sm text-brand font-medium hover:underline"
                            >
                                Ver todas <ArrowRight size={14} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </ProvinceLayout>
    );
}
