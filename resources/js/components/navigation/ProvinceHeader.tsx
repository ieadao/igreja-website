import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import OffCanvas from './OffCanvas';
import type { Province, SharedProps } from '@/types';

const DESKTOP_LINKS = [
    { label: 'Eventos', suffix: '/eventos' },
    { label: 'Ministérios', suffix: '/ministerios' },
    { label: 'Missões', suffix: '/missoes' },
    { label: 'Notícias', suffix: '/noticias' },
];

interface Props {
    province: Province;
    transparent?: boolean;
}

export default function ProvinceHeader({ province, transparent = false }: Props) {
    const { provinces } = usePage<SharedProps>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [provincesOpen, setProvincesOpen] = useState(false);
    const base = `/provincia/${province.slug}`;
    const otherProvinces = provinces.filter((p) => p.slug !== province.slug);

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-80 transition-colors duration-300',
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

                        {otherProvinces.length > 0 && (
                            <div
                                className="relative"
                                onMouseEnter={() => setProvincesOpen(true)}
                                onMouseLeave={() => setProvincesOpen(false)}
                            >
                                <button
                                    className={cn(
                                        'text-sm font-medium tracking-wide hover:text-brand-text transition-colors flex items-center gap-1',
                                        transparent ? 'text-black/85 hover:text-brand' : 'text-ink-muted',
                                    )}
                                    aria-haspopup="true"
                                    aria-expanded={provincesOpen}
                                >
                                    Províncias
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <AnimatePresence>
                                    {provincesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-border py-2 z-50"
                                        >
                                            <Link
                                                href="/"
                                                className="block px-4 py-2.5 text-sm font-medium text-ink-muted hover:text-brand-text hover:bg-brand-pale transition-colors border-b border-border mb-1 pb-3"
                                            >
                                                ← Site Nacional
                                            </Link>
                                            {otherProvinces.map((p) => (
                                                <Link
                                                    key={p.id}
                                                    href={`/provincia/${p.slug}`}
                                                    className="block px-4 py-2.5 text-sm text-ink-muted hover:text-brand-text hover:bg-brand-pale transition-colors"
                                                >
                                                    {p.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
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
