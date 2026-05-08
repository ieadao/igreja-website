import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function storageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    const defaults: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-MZ', options ?? defaults);
}

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-MZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
