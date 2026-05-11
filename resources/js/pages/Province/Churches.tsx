import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import ChurchCard from '@/components/cards/ChurchCard';
import { MapPin, Search } from 'lucide-react';
import type { Province, Church } from '@/types';

interface Props {
    province: Province;
    churches: Church[];
}

export default function ProvinceChurches({ province, churches }: Props) {
    const [search, setSearch] = useState('');
    const base = `/provincia/${province.slug}`;

    const filtered = search
        ? churches.filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.zone?.name.toLowerCase().includes(search.toLowerCase()) ||
              c.address?.toLowerCase().includes(search.toLowerCase()),
          )
        : churches;

    return (
        <ProvinceLayout province={province}>
            <Head title={`Igrejas — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Localizações</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Igrejas</h1>
                    <p className="text-ink-muted mt-2">{province.name} · {churches.length} igrej{churches.length !== 1 ? 'as' : 'a'}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {churches.length > 6 && (
                    <div className="mb-6 relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Pesquisar por nome ou localização…"
                            className="w-full pl-9 pr-4 h-10 rounded-md border border-input bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <MapPin size={48} className="mx-auto text-brand-light mb-4" />
                        <p className="text-ink-muted">Nenhuma igreja encontrada.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(church => {
                            const parts = [
                                church.region?.slug,
                                church.zone?.slug,
                                church.slug,
                            ].filter(Boolean);
                            const href = parts.length === 3 ? `${base}/${parts.join('/')}` : base;
                            return <ChurchCard key={church.id} church={church} href={href} />;
                        })}
                    </div>
                )}

                <div className="mt-10 pt-6 border-t border-border">
                    <Link
                        href={`${base}/localizacoes`}
                        className="text-sm text-brand hover:underline font-medium"
                    >
                        Ver por região e zona →
                    </Link>
                </div>
            </div>
        </ProvinceLayout>
    );
}
