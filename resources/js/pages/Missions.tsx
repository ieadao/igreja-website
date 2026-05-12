import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import { storageUrl } from '@/lib/utils';
import type { Missionary } from '@/types';

interface Stats {
    missionaries: number;
    provinces: number;
    churches: number;
}

interface Props {
    missionaries: Missionary[];
    stats: Stats;
}

export default function Missions({ missionaries, stats }: Props) {
    return (
        <GlobalLayout>
            <Head title="Missões" />

            {/* Hero */}
            <section className="bg-[var(--color-ink)] text-white py-28 px-6 text-center">
                <p className="text-[var(--color-brand-light)] text-sm font-semibold uppercase tracking-widest mb-4">
                    Até aos confins da terra
                </p>
                <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Missões
                </h1>
                <p className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed italic mb-2">
                    «Mas recebereis poder quando o Espírito Santo vier sobre vós; e sereis minhas testemunhas
                    em Jerusalém, e em toda a Judéia e Samaria, e até ao fim da terra.»
                </p>
                <p className="text-white/60 text-sm">Actos 1:8</p>
            </section>

            {/* Stats */}
            <section className="bg-[var(--color-brand-dark)] py-14 px-6">
                <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center text-white">
                    <div>
                        <div className="font-display text-5xl font-bold">{stats.missionaries}</div>
                        <div className="text-[var(--color-brand-light)] text-sm mt-2">Missionários</div>
                    </div>
                    <div>
                        <div className="font-display text-5xl font-bold">{stats.provinces}</div>
                        <div className="text-[var(--color-brand-light)] text-sm mt-2">Províncias</div>
                    </div>
                    <div>
                        <div className="font-display text-5xl font-bold">{stats.churches}</div>
                        <div className="text-[var(--color-brand-light)] text-sm mt-2">Igrejas</div>
                    </div>
                </div>
            </section>

            {/* Mission statement */}
            <section className="bg-[var(--color-cream)] py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] mb-4">
                        A Nossa Visão Missionária
                    </h2>
                    <p className="text-[var(--color-ink-muted)] leading-relaxed text-lg">
                        O Ministério Alfa e Ômega está comprometido em levar o Evangelho a cada distrito de Moçambique.
                        Os nossos missionários servem nas zonas mais remotas do país, plantando igrejas,
                        discipulando crentes e transformando comunidades inteiras para Cristo.
                    </p>
                </div>
            </section>

            {/* Missionaries grid */}
            <section className="py-20 px-6 bg-[var(--color-brand-pale)]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] text-center mb-12">
                        Os Nossos Missionários
                    </h2>

                    {missionaries.length === 0 ? (
                        <p className="text-center text-[var(--color-ink-muted)] py-12">
                            Nenhum missionário disponível de momento.
                        </p>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {missionaries.map((m) => (
                                <article
                                    key={m.id}
                                    className="bg-white rounded-xl shadow-sm border border-[var(--color-brand)]/10 p-5"
                                >
                                    <div className="w-14 h-14 rounded-full bg-[var(--color-brand-pale)] flex items-center justify-center mb-4 overflow-hidden">
                                        {m.photo_url ? (
                                            <img
                                                src={storageUrl(m.photo_url)}
                                                alt={m.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-display text-xl text-[var(--color-brand-text)] font-bold">
                                                {m.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-[var(--color-ink)] mb-1 leading-snug">
                                        {m.full_name}
                                    </h3>
                                    {m.specialization && (
                                        <p className="text-xs text-[var(--color-brand-text)] font-medium mb-1">
                                            {m.specialization}
                                        </p>
                                    )}
                                    {m.province && (
                                        <p className="text-xs text-[var(--color-ink-muted)]">
                                            📍 {m.province.name}
                                        </p>
                                    )}
                                    {m.needs && (
                                        <p className="text-xs text-[var(--color-ink-muted)] mt-2 leading-snug line-clamp-2">
                                            {m.needs}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Values */}
            <section className="bg-[var(--color-cream)] py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-display text-4xl font-semibold text-[var(--color-ink)] text-center mb-12">
                        Como Apoiar as Missões
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🙏',
                                title: 'Orar',
                                desc: 'O apoio em oração é o alicerce de toda a obra missionária. Ora regularmente pelos nossos missionários.',
                            },
                            {
                                icon: '💰',
                                title: 'Dar',
                                desc: 'O teu donativo sustenta missionários no campo, cobre despesas de viagem e planta novas igrejas.',
                            },
                            {
                                icon: '✈️',
                                title: 'Ir',
                                desc: 'Sentes o chamado? Junta-te à equipa de missões e serve em curto ou longo prazo no interior do país.',
                            },
                        ].map(item => (
                            <div key={item.title} className="text-center">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)] mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[var(--color-brand-dark)] text-white py-20 px-6 text-center">
                <h2 className="font-display text-4xl font-bold mb-4">Responde ao Chamado</h2>
                <p className="text-white/70 max-w-xl mx-auto mb-8">
                    Sentes o chamado de Deus para as missões? Estamos à procura de pessoas comprometidas
                    para servir em todo o país.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="/contacto"
                        className="px-8 py-4 bg-brand text-brand-dark font-bold rounded-lg hover:bg-brand-light transition-colors"
                    >
                        Torna-te Missionário
                    </a>
                    <a
                        href="/dar"
                        className="px-8 py-4 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Apoiar Financeiramente
                    </a>
                </div>
            </section>
        </GlobalLayout>
    );
}
