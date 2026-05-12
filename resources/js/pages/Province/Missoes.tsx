import { Head } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { storageUrl } from '@/lib/utils';
import { Users, Phone, Mail, Heart } from 'lucide-react';
import type { Province, Missionary } from '@/types';

interface Props {
    province: Province;
    missionaries: Missionary[];
}

function MissionaryCard({ missionary }: { missionary: Missionary }) {
    return (
        <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-pale shrink-0 flex items-center justify-center">
                    {missionary.photo_url ? (
                        <img src={storageUrl(missionary.photo_url)} alt={missionary.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <Users size={24} className="text-brand-text" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink">{missionary.full_name}</h3>
                    {missionary.specialization && (
                        <p className="text-brand-text text-sm mt-0.5">{missionary.specialization}</p>
                    )}
                    <span className="inline-block mt-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Activo
                    </span>
                </div>
            </div>

            {missionary.bio && (
                <p className="text-ink-muted text-sm leading-relaxed line-clamp-3">{missionary.bio}</p>
            )}

            {missionary.needs && (
                <div className="bg-brand-pale rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-brand-text text-xs font-semibold mb-1">
                        <Heart size={13} /> Necessidades
                    </div>
                    <p className="text-ink text-sm">{missionary.needs}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
                {missionary.phone && (
                    <a
                        href={`tel:${missionary.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-text transition-colors"
                    >
                        <Phone size={13} /> {missionary.phone}
                    </a>
                )}
                {missionary.email && (
                    <a
                        href={`mailto:${missionary.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-text transition-colors"
                    >
                        <Mail size={13} /> {missionary.email}
                    </a>
                )}
            </div>
        </div>
    );
}

export default function ProvinceMissoes({ province, missionaries }: Props) {
    return (
        <ProvinceLayout province={province}>
            <Head title={`Missões — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Missões</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Nossos Missionários</h1>
                    <p className="text-ink-muted mt-2">{province.name} · {missionaries.length} missionário{missionaries.length !== 1 ? 's' : ''} activo{missionaries.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {missionaries.length === 0 ? (
                    <div className="text-center py-24">
                        <Users size={48} className="mx-auto text-brand-text mb-4" />
                        <p className="text-ink-muted">Nenhum missionário activo registado.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {missionaries.map(m => <MissionaryCard key={m.id} missionary={m} />)}
                    </div>
                )}
            </div>
        </ProvinceLayout>
    );
}
