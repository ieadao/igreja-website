import { Head, Link } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import ProgramsByType from '@/components/church/ProgramsByType';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Users } from 'lucide-react';
import type { Province, Church, ChurchProgram } from '@/types';

interface ChurchWithPrograms extends Omit<Church, 'programs'> {
    programs: ChurchProgram[];
}

interface Props {
    province: Province;
    churches: ChurchWithPrograms[];
}

const TYPE_LABEL: Record<string, string> = {
    church:       'Igreja',
    congregation: 'Congregação',
};

export default function Ministerios({ province, churches }: Props) {
    const base = `/provincia/${province.slug}`;

    return (
        <ProvinceLayout province={province}>
            <Head title={`Grupos e Ministérios — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Ministérios</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Grupos e Ministérios</h1>
                    <p className="text-ink-muted mt-2">{province.name}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {churches.length === 0 ? (
                    <div className="text-center py-24">
                        <Users size={48} className="mx-auto text-brand-text mb-4" />
                        <p className="text-ink-muted">Nenhum grupo registado nesta província ainda.</p>
                    </div>
                ) : (
                    churches.map(church => {
                        const parts = [church.region?.slug, church.zone?.slug, church.slug].filter(Boolean);
                        const churchHref = parts.length === 3 ? `${base}/${parts.join('/')}` : base;

                        return (
                            <section key={church.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                                {/* Church header */}
                                <div className="flex items-start justify-between gap-4 p-6 border-b border-border bg-cream/40">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                href={churchHref}
                                                className="font-display text-xl font-semibold text-ink hover:text-brand-text transition-colors"
                                            >
                                                {church.name}
                                            </Link>
                                            <Badge variant="outline" className="text-xs shrink-0">
                                                {TYPE_LABEL[church.type] ?? church.type}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-ink-muted mt-1">
                                            {church.pastor_name && (
                                                <span className="flex items-center gap-1.5">
                                                    <User size={13} className="text-brand-text shrink-0" />
                                                    {church.pastor_name}
                                                </span>
                                            )}
                                            {church.address && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={13} className="text-brand-text shrink-0" />
                                                    {church.address}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link
                                        href={churchHref}
                                        className="shrink-0 text-xs text-brand-text font-medium hover:underline"
                                    >
                                        Ver igreja →
                                    </Link>
                                </div>

                                {/* Programs by group type */}
                                <div className="p-6">
                                    <ProgramsByType programs={church.programs} />
                                </div>
                            </section>
                        );
                    })
                )}
            </div>
        </ProvinceLayout>
    );
}
