import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Province } from '@/types';

// ── Global nav structure ──────────────────────────────────────────────────────

const GLOBAL_SECTIONS = [
    {
        label: 'Explorar',
        links: [
            { label: 'Quem Somos',          href: '/sobre' },
            { label: 'Intervenção Social',   href: '/social' },
            { label: 'Missões',              href: '/missoes' },
            { label: 'Média',                href: '/media' },
            { label: 'Agenda',               href: '/agenda' },
            { label: 'Notícias',             href: '/noticias' },
        ],
    },
    {
        label: 'Estrutura',
        links: [
            { label: 'Igrejas & Províncias', href: '/igrejas' },
            { label: 'Documentos',           href: '/documentos' },
            { label: 'Parceiros',            href: '/parceiros' },
        ],
    },
    {
        label: 'Apoiar',
        links: [
            { label: 'Dar',                  href: '/dar' },
            { label: 'Oração',               href: '/oracao' },
            { label: 'Contacto',             href: '/contacto' },
        ],
    },
];

const PROVINCE_MAIN = [
    { label: 'Início',       suffix: '' },
    { label: 'Localizações', suffix: '/localizacoes' },
    { label: 'Eventos',      suffix: '/eventos' },
    { label: 'Ministérios',  suffix: '/ministerios' },
    { label: 'Missões',      suffix: '/missoes' },
    { label: 'Notícias',     suffix: '/noticias' },
    { label: 'Dar',          suffix: '/dar' },
];

const MINISTERIOS = [
    { label: 'Jovens',    suffix: '/ministerios#jovens' },
    { label: 'Mulheres',  suffix: '/ministerios#mulheres' },
    { label: 'Homens',    suffix: '/ministerios#homens' },
    { label: 'Crianças',  suffix: '/ministerios#criancas' },
    { label: 'Seniores',  suffix: '/ministerios#seniores' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface GlobalProps {
    mode: 'global';
    isOpen: boolean;
    onClose: () => void;
    provinces: Pick<Province, 'id' | 'name' | 'slug' | 'code'>[];
}

interface ProvinceProps {
    mode: 'province';
    isOpen: boolean;
    onClose: () => void;
    province: Province;
}

type Props = GlobalProps | ProvinceProps;

// ── Component ─────────────────────────────────────────────────────────────────

export default function OffCanvas(props: Props) {
    const { isOpen, onClose } = props;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/55 z-40"
                        onClick={onClose}
                        aria-hidden
                    />

                    {/* Panel */}
                    <motion.nav
                        key="panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu de navegação"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 w-96 max-w-[90vw] bg-ink z-50 overflow-y-auto flex flex-col shadow-2xl"
                        onKeyDown={(e) => e.key === 'Escape' && onClose()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                            <span className="font-display text-xl font-semibold text-white">
                                {props.mode === 'province' ? props.province.name : 'MAO Moçambique'}
                            </span>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Fechar menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {props.mode === 'global' ? (
                                <GlobalNav provinces={props.provinces} onClose={onClose} />
                            ) : (
                                <ProvinceNav province={props.province} onClose={onClose} />
                            )}
                        </div>

                        {/* Footer CTA */}
                        <div className="px-6 pb-8 pt-4 border-t border-white/10">
                            {props.mode === 'province' ? (
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                                >
                                    ← MAO Nacional
                                </Link>
                            ) : (
                                <a
                                    href="https://wa.me/258840000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 transition-colors"
                                >
                                    <span className="text-[#25D366] text-lg">💬</span>
                                    <span className="text-sm text-white/80 font-medium">Atendimento via WhatsApp</span>
                                </a>
                            )}
                        </div>
                    </motion.nav>
                </>
            )}
        </AnimatePresence>
    );
}

// ── Global nav content ────────────────────────────────────────────────────────

function GlobalNav({
    provinces,
    onClose,
}: {
    provinces: Pick<Province, 'id' | 'name' | 'slug' | 'code'>[];
    onClose: () => void;
}) {
    return (
        <div className="space-y-8">
            {GLOBAL_SECTIONS.map((section) => (
                <div key={section.label}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                        {section.label}
                    </p>
                    <ul className="space-y-0.5">
                        {section.links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="block px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 transition-colors font-medium"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* Provinces list */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                    Províncias
                </p>
                <ul className="space-y-0.5">
                    {provinces.map((p) => (
                        <li key={p.id}>
                            <Link
                                href={`/provincia/${p.slug}`}
                                onClick={onClose}
                                className="block px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 transition-colors"
                            >
                                {p.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// ── Province nav content ──────────────────────────────────────────────────────

function ProvinceNav({ province, onClose }: { province: Province; onClose: () => void }) {
    const base = `/provincia/${province.slug}`;

    return (
        <div className="space-y-8">
            {/* Main links */}
            <ul className="space-y-0.5">
                {PROVINCE_MAIN.map((item) => (
                    <li key={item.suffix}>
                        <Link
                            href={`${base}${item.suffix}`}
                            onClick={onClose}
                            className="block px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Ministérios */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                    Ministérios
                </p>
                <ul className="space-y-0.5">
                    {MINISTERIOS.map((item) => (
                        <li key={item.suffix}>
                            <Link
                                href={`${base}${item.suffix}`}
                                onClick={onClose}
                                className="block px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 transition-colors"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
