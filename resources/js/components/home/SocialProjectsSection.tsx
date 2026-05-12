import { Link } from '@inertiajs/react';
import type { SocialProject } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
    education:    'Educação',
    health:       'Saúde',
    food:         'Alimentação',
    housing:      'Habitação',
    water:        'Água',
    orphans:      'Órfãos',
    elderly:      'Idosos',
    other:        'Social',
};

export default function SocialProjectsSection({ projects }: { projects: SocialProject[] }) {
    return (
        <section className="py-20 bg-brand-pale">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-text mb-3">
                        Intervenção Social
                    </p>
                    <h2 className="font-display text-4xl font-semibold text-ink mb-4">
                        Transformando Vidas em Moçambique
                    </h2>
                    <p className="text-ink-muted max-w-xl mx-auto">
                        Projetos comunitários que expressam o amor de Cristo através de ação concreta.
                    </p>
                </div>

                {projects.length === 0 ? (
                    <p className="text-center text-ink-muted">Nenhum projecto disponível de momento.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-text bg-brand-pale px-3 py-1 rounded-full">
                                        {CATEGORY_LABELS[project.category] ?? project.category}
                                    </span>
                                    <span className="text-xs text-ink-faint">{project.province.name}</span>
                                </div>
                                <h3 className="font-display text-xl font-semibold text-ink mb-2">
                                    {project.name}
                                </h3>
                                {project.description && (
                                    <p className="text-sm text-ink-muted line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link
                        href="/social"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-dark transition-colors"
                    >
                        Ver todos os projectos
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
