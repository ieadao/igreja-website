import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import OffCanvas from './OffCanvas';
import type { Province } from '@/types';

const DESKTOP_LINKS = [
    { label: 'Eventos', suffix: '/eventos' },
    { label: 'Ministérios', suffix: '/ministerios' },
    { label: 'Missões', suffix: '/missoes' },
    { label: 'Notícias', suffix: '/noticias' },
    { label: 'Dar', suffix: '/dar' },
];

interface Props {
    province: Province;
    transparent?: boolean;
}

export default function ProvinceHeader({ province, transparent = false }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const base = `/provincia/${province.slug}`;

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-90 transition-colors duration-300',
                    transparent
                        ? 'bg-white text-black'
                        : 'bg-cream/95 backdrop-blur-sm border-b border-border text-ink shadow-sm',
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
                    {/* Identity */}
                    <div className="flex items-center gap-4 min-w-0">
                        <Link
                            href="/"
                            className={cn(
                                'text-xs font-medium shrink-0 transition-opacity',
                                transparent ? 'text-white/50 hover:text-white/90' : 'text-ink-faint hover:text-ink-muted',
                            )}
                        >
                            <img
                                src="/images/logo.png"
                                alt="IEADAO"
                                className="w-25 h-25 object-contain"
                            />
                        </Link>
                        <span className={transparent ? 'text-black/20' : 'text-ink-faint'}>|</span>
                        <Link
                            href={base}
                            className="font-display text-xl font-semibold tracking-wide truncate"
                        >
                            {province.name}
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-7">
                        {DESKTOP_LINKS.map((link) => (
                            <Link
                                key={link.suffix}
                                href={`${base}${link.suffix}`}
                                className={cn(
                                    'text-sm font-medium tracking-wide hover:text-brand-text transition-colors',
                                    transparent ? 'text-black/85 hover:text-brand' : 'text-ink-muted',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Menu button */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            transparent
                                ? 'text-black/85 hover:text-brand hover:bg-white/10'
                                : 'text-ink-muted hover:text-ink hover:bg-brand-pale',
                        )}
                        aria-label="Abrir menu"
                    >
                        <Menu className="w-5 h-5" />
                        <span className="hidden sm:inline">Menu</span>
                    </button>
                </div>
            </header>

            <OffCanvas
                mode="province"
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                province={province}
            />
        </>
    );
}
