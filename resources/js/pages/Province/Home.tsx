import { Head, Link } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { storageUrl, formatDate } from '@/lib/utils';
import { MapPin, Calendar, ArrowRight, Users, BookOpen } from 'lucide-react';
import type { Province, Region, Event, NewsItem, Missionary } from '@/types';

interface Props {
    province: Province & { regions: Region[] };
    events: Event[];
    news: NewsItem[];
    missionaries: Missionary[];
}

function ProvinceHero({ province }: { province: Province & { regions: Region[] } }) {
    const base = `/provincia/${province.slug}`;
    const hasHero = !!province.hero_image;

    return (
        <section className="relative min-h-[85vh] flex items-end pb-16 overflow-hidden">
            {hasHero ? (
                <img
                    src={storageUrl(province.hero_image)}
                    alt={province.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">
                    Ministério Alfa e Ômega
                </p>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    {province.name}
                </h1>
                {province.tagline && (
                    <p className="text-white/80 text-lg sm:text-xl max-w-xl mb-8">{province.tagline}</p>
                )}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`${base}/localizacoes`}
                        className="px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
                    >
                        Encontrar Igreja
                    </Link>
                    <Link
                        href={`${base}/eventos`}
                        className="px-6 py-3 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-lg font-medium hover:bg-white/25 transition-colors"
                    >
                        Ver Eventos
                    </Link>
                </div>
            </div>
        </section>
    );
}

function LocationGrid({ province }: { province: Province & { regions: Region[] } }) {
    const base = `/provincia/${province.slug}`;
    if (!province.regions?.length) return null;

    return (
        <section className="py-16 bg-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Localizações</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">Regiões da Província</h2>
                    </div>
                    <Link
                        href={`${base}/localizacoes`}
                        className="hidden sm:flex items-center gap-1 text-brand font-medium hover:text-brand-dark transition-colors text-sm"
                    >
                        Ver todas <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {province.regions.map(region => (
                        <Link
                            key={region.id}
                            href={`${base}/localizacoes`}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-brand-pale hover:shadow-lg transition-shadow"
                        >
                            {region.cover_image ? (
                                <img
                                    src={storageUrl(region.cover_image)}
                                    alt={region.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand/40" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <p className="text-white font-semibold text-sm leading-tight">{region.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6 sm:hidden text-center">
                    <Link href={`${base}/localizacoes`} className="inline-flex items-center gap-1 text-brand font-medium text-sm">
                        Ver todas as regiões <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function EventsSection({ province, events }: { province: Province; events: Event[] }) {
    const base = `/provincia/${province.slug}`;
    if (!events.length) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Agenda</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">Próximos Eventos</h2>
                    </div>
                    <Link
                        href={`${base}/eventos`}
                        className="hidden sm:flex items-center gap-1 text-brand font-medium hover:text-brand-dark text-sm transition-colors"
                    >
                        Ver todos <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {events.map(event => (
                        <div key={event.id} className="bg-cream rounded-xl p-5 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-brand">
                                <Calendar size={16} />
                                <span className="text-xs font-medium">{formatDate(event.starts_at)}</span>
                            </div>
                            <h3 className="font-semibold text-ink leading-snug line-clamp-2">{event.title}</h3>
                            {event.location && (
                                <div className="flex items-center gap-1 text-ink-muted text-xs">
                                    <MapPin size={13} />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            )}
                            <span className="text-xs text-brand-dark font-medium capitalize bg-brand-pale px-2 py-0.5 rounded-full self-start">
                                {event.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function NewsSection({ province, news }: { province: Province; news: NewsItem[] }) {
    const base = `/provincia/${province.slug}`;
    if (!news.length) return null;

    return (
        <section className="py-16 bg-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Notícias</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">Últimas Notícias</h2>
                    </div>
                    <Link
                        href={`${base}/noticias`}
                        className="hidden sm:flex items-center gap-1 text-brand font-medium hover:text-brand-dark text-sm transition-colors"
                    >
                        Ver todas <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {news.map(item => (
                        <Link
                            key={item.id}
                            href={`${base}/noticias/${item.slug}`}
                            className="group bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="aspect-video bg-brand-pale overflow-hidden">
                                {item.cover_image ? (
                                    <img
                                        src={storageUrl(item.cover_image)}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen size={32} className="text-brand-light" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <p className="text-xs text-ink-muted mb-2">{formatDate(item.published_at)}</p>
                                <h3 className="font-semibold text-ink leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                                    {item.title}
                                </h3>
                                {item.excerpt && (
                                    <p className="text-ink-muted text-sm mt-2 line-clamp-2">{item.excerpt}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MissionariesSection({ province, missionaries }: { province: Province; missionaries: Missionary[] }) {
    const base = `/provincia/${province.slug}`;
    if (!missionaries.length) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Missões</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">Nossos Missionários</h2>
                    </div>
                    <Link
                        href={`${base}/missoes`}
                        className="hidden sm:flex items-center gap-1 text-brand font-medium hover:text-brand-dark text-sm transition-colors"
                    >
                        Ver todos <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {missionaries.map(m => (
                        <div key={m.id} className="text-center p-4 rounded-xl bg-cream">
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-brand-pale flex items-center justify-center">
                                {m.photo_url ? (
                                    <img src={storageUrl(m.photo_url)} alt={m.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={28} className="text-brand-light" />
                                )}
                            </div>
                            <p className="font-semibold text-ink text-sm leading-tight">{m.full_name}</p>
                            {m.specialization && (
                                <p className="text-ink-muted text-xs mt-1">{m.specialization}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DarCTA({ province }: { province: Province }) {
    const base = `/provincia/${province.slug}`;
    return (
        <section className="py-16 bg-brand text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Parceria</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                    Apoie a Obra em {province.name}
                </h2>
                <p className="text-white/80 max-w-lg mx-auto mb-8">
                    A sua oferta permite alcançar mais comunidades, enviar missionários e transformar vidas.
                </p>
                <Link
                    href={`${base}/dar`}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-brand-pale transition-colors"
                >
                    Contribuir Agora <ArrowRight size={18} />
                </Link>
            </div>
        </section>
    );
}

export default function ProvinceHome({ province, events, news, missionaries }: Props) {
    return (
        <ProvinceLayout province={province} heroTransparent>
            <Head title={province.name} />
            <ProvinceHero province={province} />
            <LocationGrid province={province} />
            <EventsSection province={province} events={events} />
            <NewsSection province={province} news={news} />
            <MissionariesSection province={province} missionaries={missionaries} />
            <DarCTA province={province} />
        </ProvinceLayout>
    );
}
