const YOUTUBE_ID_PATTERNS = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
];

export function extractYouTubeId(url: string | null): string | null {
    if (!url) return null;
    for (const pattern of YOUTUBE_ID_PATTERNS) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function getYouTubeThumbnail(
    url: string | null,
    quality: 'hqdefault' | 'maxresdefault' = 'hqdefault',
): string | null {
    const id = extractYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
}

export function getYouTubeEmbedUrl(url: string | null): string | null {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}
