import { Head, Link } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import { storageUrl, formatDate } from '@/lib/utils';
import { ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import type { NewsItem } from '@/types';

interface Props {
    article: NewsItem & { body: string };
    related: NewsItem[];
}

export default function NewsDetail({ article, related }: Props) {
    function shareArticle() {
        if (navigator.share) {
            navigator.share({ title: article.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    }

    return (
        <GlobalLayout>
            <Head title={`${article.title} — MAO`} />

            <div className="pt-16 lg:pt-20">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-1 text-brand-text text-sm font-medium mb-8 hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={16} /> Voltar às Notícias
                    </Link>

                    <header className="mb-8">
                        <p className="text-xs text-ink-muted mb-3">{formatDate(article.published_at)}</p>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-4">
                            {article.title}
                        </h1>
                        {article.excerpt && (
                            <p className="text-lg text-ink-muted leading-relaxed">{article.excerpt}</p>
                        )}

                        <button
                            onClick={shareArticle}
                            className="mt-4 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand-text transition-colors"
                        >
                            <Share2 size={15} /> Partilhar
                        </button>
                    </header>

                    {article.cover_image && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-brand-pale mb-8">
                            <img
                                src={storageUrl(article.cover_image)}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted prose-a:text-brand-text"
                        dangerouslySetInnerHTML={{ __html: article.body }}
                    />
                </article>
            </div>

            {related.length > 0 && (
                <section className="bg-cream border-t border-border py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-display text-2xl font-semibold text-ink mb-6">Mais Notícias</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {related.map(item => (
                                <Link
                                    key={item.id}
                                    href={`/noticias/${item.slug}`}
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
                                                <BookOpen size={28} className="text-brand-text" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-ink-muted mb-1">{formatDate(item.published_at)}</p>
                                        <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-2 group-hover:text-brand-text transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </GlobalLayout>
    );
}
