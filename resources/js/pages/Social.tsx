import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import type { SocialProject } from '@/types';

const CATEGORY_MAP: Record<string, { label: string; bg: string; text: string }> = {
    education: { label: 'Educação',   bg: 'bg-blue-100',   text: 'text-blue-800' },
    health:    { label: 'Saúde',      bg: 'bg-green-100',  text: 'text-green-800' },
    nutrition: { label: 'Nutrição',   bg: 'bg-yellow-100', text: 'text-yellow-800' },
    emergency: { label: 'Emergência', bg: 'bg-red-100',    text: 'text-red-800' },
    housing:   { label: 'Habitação',  bg: 'bg-purple-100', text: 'text-purple-800' },
    other:     { label: 'Outro',      bg: 'bg-gray-100',   text: 'text-gray-800' },
};

interface Props {
    projects: SocialProject[];
}

export default function Social({ projects }: Props) {
    const totalImpacted = projects.reduce((sum, p) => {
        const latest = p.impacts?.[p.impacts.length - 1];
        return sum + (latest?.metric_value ?? 0);
    }, 0);

    const activeProvinces = new Set(projects.map(p => p.province?.slug).filter(Boolean)).size;

    return (
        <GlobalLayout>
            <Head title="Intervenção Social" />

            {/* Hero */}
            <section className="bg-[var(--color-ink)] text-white py-24 px-6 text-center">
                <p className="text-[var(--color-brand-light)] text-sm font-semibold uppercase tracking-widest mb-4">
                    Transformar Vidas
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Intervenção Social
                </h1>
                <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
                    O amor de Cristo compele-nos a servir os mais necessitados. Através dos nossos
                    projectos sociais, levamos esperança, dignidade e transformação às comunidades mais vulneráveis de Moçambique.
                </p>
            </section>

            {/* Stats bar */}
            <section className="bg-[var(--color-brand-dark)] py-12 px-6">
                <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center text-white">
                    <div>
                        <div className="font-display text-4xl md:text-5xl font-bold">{projects.length}</div>
                        <div className="text-[var(--color-brand-light)] text-sm mt-1">Projectos Activos</div>
                    </div>
                    <div>
                        <div className="font-display text-4xl md:text-5xl font-bold">{activeProvinces}</div>
                        <div className="text-[var(--color-brand-light)] text-sm mt-1">Províncias</div>
                    </div>
                    <div>
                        <div className="font-display text-4xl md:text-5xl font-bold">
                            {totalImpacted > 0 ? totalImpacted.toLocaleString('pt-MZ') : '—'}
                        </div>
                        <div className="text-[var(--color-brand-light)] text-sm mt-1">Vidas Impactadas</div>
                    </div>
                </div>
            </section>

            {/* Projects grid */}
            <section className="py-20 px-6 bg-[var(--color-cream)]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] text-center mb-12">
                        Os Nossos Projectos
                    </h2>

                    {projects.length === 0 ? (
                        <p className="text-center text-[var(--color-ink-muted)] py-12">
                            Nenhum projecto disponível de momento.
                        </p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => {
                                const cat = CATEGORY_MAP[project.category] ?? CATEGORY_MAP.other;
                                return (
                                    <article
                                        key={project.id}
                                        className="bg-white rounded-2xl shadow-sm border border-[var(--color-brand)]/10 overflow-hidden flex flex-col"
                                    >
                                        <div className="p-6 flex-1">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <h3 className="font-display text-xl font-semibold text-[var(--color-ink)] leading-snug">
                                                    {project.name}
                                                </h3>
                                                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
                                                    {cat.label}
                                                </span>
                                            </div>
                                            {project.description && (
                                                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed mb-4 line-clamp-3">
                                                    {project.description}
                                                </p>
                                            )}
                                            {project.province && (
                                                <p className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1">
                                                    <span>📍</span>
                                                    <span>{project.province.name}</span>
                                                </p>
                                            )}
                                        </div>

                                        {project.impacts && project.impacts.length > 0 && (
                                            <div className="bg-[var(--color-brand-pale)] px-6 py-4 border-t border-[var(--color-brand)]/10">
                                                <div className={`grid gap-3 ${project.impacts.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                    {project.impacts.slice(0, 2).map((impact, i) => (
                                                        <div key={i} className="text-center">
                                                            <div className="font-display text-2xl font-bold text-[var(--color-brand)]">
                                                                {impact.metric_value.toLocaleString('pt-MZ')}
                                                            </div>
                                                            <div className="text-xs text-[var(--color-ink-muted)] mt-0.5 leading-snug">
                                                                {impact.metric_name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Scripture */}
            <section className="bg-[var(--color-brand-pale)] py-16 px-6 text-center">
                <blockquote className="max-w-2xl mx-auto">
                    <p className="font-display text-2xl md:text-3xl text-[var(--color-ink)] italic leading-relaxed mb-3">
                        «Aprende a fazer o bem, procura o direito, corrige o opressor, faz justiça ao órfão, pleiteia a causa da viúva.»
                    </p>
                    <cite className="text-[var(--color-ink-muted)] text-sm not-italic">Isaías 1:17</cite>
                </blockquote>
            </section>

            {/* CTA */}
            <section className="bg-[var(--color-brand-dark)] text-white py-20 px-6 text-center">
                <h2 className="font-display text-4xl font-bold mb-4">Faz Parte Desta Missão</h2>
                <p className="text-white/70 max-w-xl mx-auto mb-8">
                    Juntos podemos fazer mais. Seja através de donativos, voluntariado ou parcerias.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="/dar"
                        className="px-8 py-3 bg-brand text-brand-dark font-semibold rounded-lg hover:bg-brand-light transition-colors"
                    >
                        Apoiar Financeiramente
                    </a>
                    <a
                        href="/contacto"
                        className="px-8 py-3 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Ser Voluntário
                    </a>
                </div>
            </section>
        </GlobalLayout>
    );
}
