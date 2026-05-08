import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import OffCanvas from './OffCanvas';
import type { SharedProps } from '@/types';

const NAV_LINKS = [
    { label: 'Sobre',      href: '/sobre' },
    { label: 'Igrejas',    href: '/igrejas' },
    { label: 'Agenda',     href: '/eventos' },
    { label: 'Pregações',  href: '/pregacoes' },
    { label: 'Notícias',   href: '/noticias' },
    { label: 'Dar',        href: '/dar' },
];

export default function GlobalHeader({ transparent = false }: { transparent?: boolean }) {
    const { provinces } = usePage<SharedProps>().props;
    const [menuOpen, setMenuOpen]         = useState(false);
    const [provincesOpen, setProvincesOpen] = useState(false);

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-40 transition-colors duration-300',
                    transparent
                        ? 'bg-transparent text-white'
                        : 'bg-cream/95 backdrop-blur-sm border-b border-border text-ink shadow-sm',
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                transparent ? 'bg-white text-brand' : 'bg-brand text-white',
                            )}
                        >
                            M
                        </div>
                        <span className="font-display text-xl font-semibold tracking-wide">
                            MAO Moçambique
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-7">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium tracking-wide hover:text-brand transition-colors',
                                    transparent ? 'text-white/85 hover:text-white' : 'text-ink-muted',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Provinces dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setProvincesOpen(true)}
                            onMouseLeave={() => setProvincesOpen(false)}
                        >
                            <button
                                className={cn(
                                    'text-sm font-medium tracking-wide hover:text-brand transition-colors flex items-center gap-1',
                                    transparent ? 'text-white/85 hover:text-white' : 'text-ink-muted',
                                )}
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
                                        {provinces.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/provincia/${p.slug}`}
                                                className="block px-4 py-2.5 text-sm text-ink-muted hover:text-brand hover:bg-brand-pale transition-colors"
                                            >
                                                {p.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Menu button */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            transparent
                                ? 'text-white/85 hover:text-white hover:bg-white/10'
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
                mode="global"
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                provinces={provinces}
            />
        </>
    );
}
