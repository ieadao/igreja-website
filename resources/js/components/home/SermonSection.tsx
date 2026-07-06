import { Link } from '@inertiajs/react';
import { BookOpen, Download, Headphones, PlayCircle } from 'lucide-react';
import { formatDate, storageUrl } from '@/lib/utils';
import type { Sermon } from '@/types';

function extractYouTubeId(url: string | null): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/);
    return match ? match[1] : null;
}

export default function SermonSection({ sermon }: { sermon: Sermon | null }) {
    if (!sermon) return null;

    const youtubeId = extractYouTubeId(sermon.video_url);
    const thumbnail = youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : storageUrl(sermon.cover_image);

    return (
        <section className="py-20 bg-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-light mb-3">
                        Última Pregação
                    </p>
                    <h2 className="font-display text-4xl font-semibold text-white">
                        Palavra de Deus
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Thumbnail / Video link */}
                    <div className="relative group rounded-2xl overflow-hidden bg-brand-dark aspect-video">
                        {thumbnail && (
                            <img
                                src={thumbnail}
                                alt={sermon.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {sermon.video_url ? (
                                <a
                                    href={sermon.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-16 h-16 rounded-full bg-brand/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                    aria-label="Ver pregação"
                                >
                                    <PlayCircle className="w-8 h-8 text-white fill-white" />
                                </a>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                    <BookOpen className="w-7 h-7 text-white/60" />
                                </div>
                            )}
                        </div>
                        {!thumbnail && (
                            <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/60">
                                <BookOpen className="w-16 h-16 text-white/20" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        {sermon.series && (
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light mb-3">
                                Série: {sermon.series}
                            </p>
                        )}
                        <h3 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3 leading-snug">
                            {sermon.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-1">
                            {sermon.speaker_name}
                            {sermon.duration_minutes ? ` · ${sermon.duration_minutes} min` : ''}
                        </p>
                        <p className="text-white/60 text-xs mb-6">
                            {formatDate(sermon.preached_at)}
                        </p>

                        {sermon.description && (
                            <p className="text-white/70 text-sm leading-relaxed mb-8 line-clamp-3">
                                {sermon.description}
                            </p>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3">
                            {sermon.video_url && (
                                <a
                                    href={sermon.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-brand-dark text-sm font-medium rounded-lg hover:bg-brand-light transition-colors"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    Assistir
                                </a>
                            )}
                            {sermon.audio_url && (
                                <a
                                    href={sermon.audio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <Headphones className="w-4 h-4" />
                                    Ouvir
                                </a>
                            )}
                            {sermon.pdf_url && (
                                <a
                                    href={sermon.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    PDF
                                </a>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <Link
                                href="/midia"
                                className="text-sm font-semibold text-brand-light hover:text-white transition-colors"
                            >
                                Ver todas as pregações →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
