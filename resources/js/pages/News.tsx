import { Head, Link } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import { storageUrl, formatDate } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import type { NewsItem, PaginatedData } from '@/types';

interface Props {
    news: PaginatedData<NewsItem>;
}

export default function News({ news }: Props) {
    return (
        <GlobalLayout>
            <Head title="Notícias — MAO" />

            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Comunicação</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Notícias</h1>
                    <p className="text-white/65 mt-3 max-w-2xl text-lg">
                        Acompanhe as novidades e acontecimentos do Ministério Alfa e Ômega.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {news.data.length === 0 ? (
                    <div className="text-center py-24">
                        <BookOpen size={48} className="mx-auto text-brand-text mb-4" />
                        <p className="text-ink-muted">Nenhuma notícia publicada ainda.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.data.map(item => (
                                <Link
                                    key={item.id}
                                    href={`/noticias/${item.slug}`}
                                    className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow"
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
                                                <BookOpen size={32} className="text-brand-text" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs text-ink-muted mb-2">{formatDate(item.published_at)}</p>
                                        <h2 className="font-semibold text-ink leading-snug line-clamp-2 group-hover:text-brand-text transition-colors">
                                            {item.title}
                                        </h2>
                                        {item.excerpt && (
                                            <p className="text-ink-muted text-sm mt-2 line-clamp-2">{item.excerpt}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {news.last_page > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                {news.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-brand-dark text-white'
                                                : link.url
                                                ? 'text-ink hover:bg-cream'
                                                : 'text-ink-muted opacity-40 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </GlobalLayout>
    );
}
