import { Head, Link } from '@inertiajs/react';
import { Download, Share2, ChevronLeft, Clock, BookOpen } from 'lucide-react';
import GlobalLayout from '@/layouts/GlobalLayout';
import SermonCard from '@/components/cards/SermonCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, storageUrl } from '@/lib/utils';
import type { Sermon } from '@/types';

function getYouTubeEmbedUrl(url: string): string | null {
    const patterns = [
        /youtu\.be\/([^?&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtube\.com\/embed\/([^?]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`;
    }
    return null;
}

interface Props {
    sermon: Sermon;
    related: Sermon[];
}

export default function SermonDetail({ sermon, related }: Props) {
    const embedUrl = sermon.video_url ? getYouTubeEmbedUrl(sermon.video_url) : null;
    const coverUrl = storageUrl(sermon.cover_image);

    function shareWhatsApp() {
        const text = `${sermon.title} — ${sermon.speaker_name}\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
    }

    return (
        <GlobalLayout>
            <Head title={`${sermon.title} — Pregações`} />

            <div className="bg-cream">
                {/* Back link */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <Link
                        href="/media"
                        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-text transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> Voltar às pregações
                    </Link>
                </div>

                <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Video embed */}
                    {embedUrl ? (
                        <div className="rounded-2xl overflow-hidden shadow-xl bg-black aspect-video mb-8">
                            <iframe
                                src={embedUrl}
                                title={sermon.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    ) : coverUrl ? (
                        <div className="rounded-2xl overflow-hidden shadow-xl mb-8 aspect-video bg-ink">
                            <img src={coverUrl} alt={sermon.title} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-brand-pale mb-8 aspect-video flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-brand-text/30" />
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {sermon.series && (
                            <Badge variant="outline" className="text-brand-text border-brand/40 text-sm">
                                {sermon.series}
                            </Badge>
                        )}
                        <span className="text-sm text-ink-muted">
                            {formatDate(sermon.preached_at)}
                        </span>
                        {sermon.duration_minutes && (
                            <span className="flex items-center gap-1 text-sm text-ink-muted">
                                <Clock className="w-3.5 h-3.5" />
                                {sermon.duration_minutes} min
                            </span>
                        )}
                    </div>

                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink leading-tight mb-2">
                        {sermon.title}
                    </h1>
                    <p className="text-ink-muted text-lg mb-6">{sermon.speaker_name}</p>

                    {sermon.description && (
                        <p className="text-ink-muted leading-relaxed mb-8 max-w-3xl">{sermon.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pb-8 border-b border-border">
                        {sermon.pdf_url && (
                            <a href={storageUrl(sermon.pdf_url)} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="gap-2 border-brand text-brand-text hover:bg-brand hover:text-brand-dark">
                                    <Download className="w-4 h-4" /> Baixar esboço (PDF)
                                </Button>
                            </a>
                        )}
                        {sermon.audio_url && (
                            <a href={storageUrl(sermon.audio_url)} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="gap-2">
                                    Ouvir áudio
                                </Button>
                            </a>
                        )}
                        <Button variant="outline" onClick={shareWhatsApp} className="gap-2">
                            <Share2 className="w-4 h-4" /> Partilhar no WhatsApp
                        </Button>
                        <Button variant="ghost" onClick={copyLink} className="gap-2 text-ink-muted">
                            Copiar link
                        </Button>
                    </div>
                </article>

                {/* Related */}
                {related.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                        <h2 className="font-display text-2xl font-bold text-ink mb-6">
                            {sermon.series ? `Mais de "${sermon.series}"` : 'Mais pregações'}
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {related.map(s => (
                                <SermonCard key={s.id} sermon={s} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </GlobalLayout>
    );
}
