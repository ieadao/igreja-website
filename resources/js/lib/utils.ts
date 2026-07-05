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

const DAY_NAMES: Record<string, string> = {
    // full English
    monday: 'Segunda-feira', tuesday: 'Terça-feira', wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira', friday: 'Sexta-feira', saturday: 'Sábado', sunday: 'Domingo',
    // short English (3-letter)
    mon: 'Segunda-feira', tue: 'Terça-feira', wed: 'Quarta-feira',
    thu: 'Quinta-feira', fri: 'Sexta-feira', sat: 'Sábado', sun: 'Domingo',
    // numeric (JS getDay style: 0 = Sunday)
    '0': 'Domingo', '1': 'Segunda-feira', '2': 'Terça-feira', '3': 'Quarta-feira',
    '4': 'Quinta-feira', '5': 'Sexta-feira', '6': 'Sábado',
};

export function formatDay(value: string | null | undefined): string {
    if (!value) return '';
    return DAY_NAMES[value.toLowerCase()] ?? DAY_NAMES[value] ?? value;
}
