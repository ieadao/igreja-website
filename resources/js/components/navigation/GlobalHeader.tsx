import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import OffCanvas from './OffCanvas';
import type { SharedProps } from '@/types';

export default function GlobalHeader({ transparent = false }: { transparent?: boolean }) {
    const { provinces, mainMenu } = usePage<SharedProps>().props;
    const [menuOpen, setMenuOpen]           = useState(false);
    const [provincesOpen, setProvincesOpen] = useState(false);
    const [openDropdown, setOpenDropdown]   = useState<number | null>(null);

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
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <img
                            src="/images/logo.png"
                            alt="IEADAO"
                            className="w-25 h-25 object-contain"
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-7">
                        {mainMenu.map((item) =>
                            item.children && item.children.length > 0 ? (
                                <div
                                    key={item.id}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(item.id)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button
                                        className={cn(
                                            'text-sm font-medium tracking-wide hover:text-brand-text transition-colors flex items-center gap-1',
                                            transparent ? 'text-black/85 hover:text-brand' : 'text-ink-muted',
                                        )}
                                    >
                                        {item.href ? (
                                            <Link href={item.href} className="hover:text-brand-text transition-colors">
                                                {item.label}
                                            </Link>
                                        ) : (
                                            item.label
                                        )}
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    <AnimatePresence>
                                        {openDropdown === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-border py-2 z-50"
                                            >
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={child.href ?? '#'}
                                                        className="block px-4 py-2.5 text-sm text-ink-muted hover:text-brand-text hover:bg-brand-pale transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    key={item.id}
                                    href={item.href ?? '#'}
                                    className={cn(
                                        'text-sm font-medium tracking-wide hover:text-brand-text transition-colors',
                                        transparent ? 'text-black/85 hover:text-brand' : 'text-ink-muted',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}

                        {/* Provinces dropdown (dynamic, always shown) */}
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
                                                className="block px-4 py-2.5 text-sm text-ink-muted hover:text-brand-text hover:bg-brand-pale transition-colors"
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
                mode="global"
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                provinces={provinces}
            />
        </>
    );
}
