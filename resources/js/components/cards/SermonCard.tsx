import { Link } from '@inertiajs/react';
import { Play, Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, storageUrl } from '@/lib/utils';
import type { Sermon } from '@/types';

function getYouTubeThumbnail(url: string | null): string | null {
    if (!url) return null;
    const patterns = [
        /youtu\.be\/([^?&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtube\.com\/embed\/([^?]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
}

export default function SermonCard({ sermon }: { sermon: Sermon }) {
    const thumbnail = getYouTubeThumbnail(sermon.video_url) ?? storageUrl(sermon.cover_image);

    return (
        <Link
            href={`/midia/${sermon.id}`}
            className="group block bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="relative aspect-video bg-ink/10 overflow-hidden">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-pale">
                        <BookOpen className="w-12 h-12 text-brand-text/40" />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-brand-text fill-brand ml-0.5" />
                    </div>
                </div>
            </div>

            <div className="p-4">
                {sermon.series && (
                    <Badge variant="outline" className="text-xs text-brand-text border-brand/40 mb-2">
                        {sermon.series}
                    </Badge>
                )}
                <h3 className="font-semibold text-ink leading-snug group-hover:text-brand-text transition-colors line-clamp-2">
                    {sermon.title}
                </h3>
                <p className="text-ink-muted text-sm mt-1">{sermon.speaker_name}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-ink-muted">
                    <span>{formatDate(sermon.preached_at, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {sermon.duration_minutes && (
                        <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {sermon.duration_minutes} min
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
