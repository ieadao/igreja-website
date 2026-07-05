import { Link } from '@inertiajs/react';
import { storageUrl } from '@/lib/utils';
import type { Document, SitePage, SitePageRelatedData } from '@/types';

interface Props {
    page: SitePage;
    relatedData: SitePageRelatedData;
}

const CATEGORY_LABELS: Record<string, string> = {
    statute: 'Estatutos',
    regulation: 'Regulamentos',
    report: 'Relatórios',
    other: 'Outros',
};

export default function AboutPageTemplate({ page, relatedData }: Props) {
    const about = page.sections.about ?? {};
    const leadership = relatedData.leadership ?? [];
    const documents = relatedData.documents ?? [];

    const grouped = documents.reduce<Record<string, Document[]>>((acc, doc) => {
        const cat = CATEGORY_LABELS[doc.category] ?? 'Outros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(doc);
        return acc;
    }, {});

    return (
        <>
            <section className="bg-[var(--color-brand-dark)] text-white py-24 px-6 text-center">
                <p className="text-[var(--color-brand-light)] text-sm font-semibold uppercase tracking-widest mb-4">
                    Ministério Alfa e Ômega
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    {page.title}
                </h1>
                {about.hero_quote && (
                    <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed italic">
                        {about.hero_quote}
                    </p>
                )}
                {about.hero_reference && (
                    <p className="text-white/60 text-sm mt-2">{about.hero_reference}</p>
                )}
                {!about.hero_quote && page.excerpt && (
                    <p className="text-white/75 max-w-2xl mx-auto text-lg leading-relaxed">
                        {page.excerpt}
                    </p>
                )}
            </section>

            <section className="py-20 px-6 bg-[var(--color-cream)]">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-text)] mb-3 block">
                            Missão
                        </span>
                        <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)] mb-4">
                            A Nossa Missão
                        </h2>
                        <p className="text-[var(--color-ink-muted)] leading-relaxed">
                            {about.mission ?? page.excerpt ?? 'Conteúdo em actualização.'}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-text)] mb-3 block">
                            Visão
                        </span>
                        <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)] mb-4">
                            A Nossa Visão
                        </h2>
                        <p className="text-[var(--color-ink-muted)] leading-relaxed">
                            {about.vision ?? 'Conteúdo em actualização.'}
                        </p>
                    </div>
                </div>
            </section>

            {(about.timeline?.length ?? 0) > 0 && (
                <section className="bg-[var(--color-brand-pale)] py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] text-center mb-4">
                            A Nossa História
                        </h2>
                        <p className="text-center text-[var(--color-ink-muted)] mb-14 max-w-xl mx-auto">
                            Uma jornada de fé, serviço e transformação que continua a crescer.
                        </p>
                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--color-brand)]/20 md:left-1/2" />
                            <div className="space-y-8">
                                {about.timeline?.map((event, index) => (
                                    <div
                                        key={`${event.year}-${event.label}`}
                                        className={`relative flex gap-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                    >
                                        <div className="flex-1 pl-14 md:pl-0">
                                            <div className={`bg-white rounded-xl p-6 shadow-sm border border-[var(--color-brand)]/10 ${index % 2 === 0 ? 'md:mr-10' : 'md:ml-10'}`}>
                                                <span className="text-xs font-bold text-[var(--color-brand-text)] uppercase tracking-widest">
                                                    {event.year}
                                                </span>
                                                <h3 className="font-display text-xl font-semibold text-[var(--color-ink)] mt-1 mb-2">
                                                    {event.label}
                                                </h3>
                                                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                                                    {event.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[var(--color-brand)] border-2 border-white shadow top-6" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-14 text-center">
                            <Link
                                href="/historia"
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-brand)] text-white font-semibold rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
                            >
                                Ver a história completa
                                <span aria-hidden>→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {page.content && (
                <section className="bg-white py-16 px-6">
                    <div
                        className="max-w-3xl mx-auto prose prose-lg prose-p:text-ink-muted prose-headings:text-ink prose-a:text-brand-text"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </section>
            )}

            {/* {leadership.length > 0 && (
                <section id="lideranca" className="py-20 px-6 bg-[var(--color-cream)]">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] text-center mb-12">
                            Liderança Nacional
                        </h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {leadership.map((leader) => (
                                <div
                                    key={leader.id}
                                    className="bg-white rounded-xl p-6 text-center shadow-sm border border-[var(--color-brand)]/10"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-brand-pale)] flex items-center justify-center mx-auto mb-4">
                                        <span className="font-display text-2xl text-[var(--color-brand)] font-bold">
                                            {leader.name.split(' ').map((name) => name[0]).slice(0, 2).join('')}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-[var(--color-ink)]">{leader.name}</h3>
                                    <p className="text-sm text-[var(--color-ink-muted)] mt-1">{leader.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )} */}

            {/* {documents.length > 0 && (
                <section className="bg-[var(--color-brand-pale)] py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] text-center mb-12">
                            Documentos
                        </h2>
                        {Object.entries(grouped).map(([category, docs]) => (
                            <div key={category} className="mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-3">
                                    {category}
                                </h3>
                                <div className="space-y-2">
                                    {docs.map((doc) => (
                                        <a
                                            key={doc.id}
                                            href={storageUrl(doc.file_url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-[var(--color-brand)]/10 hover:border-[var(--color-brand)]/30 transition-colors group"
                                        >
                                            <span className="font-medium text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors">
                                                {doc.title}
                                            </span>
                                            <span className="shrink-0 flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
                                                {doc.file_size_kb != null && <span>{(doc.file_size_kb / 1024).toFixed(1)} MB</span>}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )} */}

            <section className="bg-[var(--color-brand-dark)] text-white py-16 px-6 text-center">
                <h2 className="font-display text-3xl font-bold mb-4">
                    {about.cta_heading ?? 'Faz Parte da Família'}
                </h2>
                <p className="text-white/70 max-w-lg mx-auto mb-8">
                    {about.cta_body ?? 'Estamos presentes em todo o país. Encontra uma igreja perto de ti.'}
                </p>
                <a
                    href={about.cta_button_href ?? '/igrejas'}
                    className="inline-block px-8 py-3 bg-brand text-brand-dark font-semibold rounded-lg hover:bg-brand-light transition-colors"
                >
                    {about.cta_button_label ?? 'Encontrar uma Igreja'}
                </a>
            </section>
        </>
    );
}
