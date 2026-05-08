import { Link } from '@inertiajs/react';
import type { Province } from '@/types';

export default function ProvinceFooter({ province }: { province: Province }) {
    const base = `/provincia/${province.slug}`;

    return (
        <footer className="bg-ink text-white/70 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <h3 className="font-display text-2xl text-white font-semibold mb-2">{province.name}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            {province.tagline ?? `Fazendo discípulos em ${province.name}.`}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Esta Província</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                ['Início',     ''],
                                ['Igrejas',    '/igrejas'],
                                ['Eventos',    '/eventos'],
                                ['Pregações',  '/pregacoes'],
                                ['Notícias',   '/noticias'],
                                ['Contacto',   '/contacto'],
                            ].map(([label, suffix]) => (
                                <li key={suffix as string}>
                                    <Link href={`${base}${suffix}`} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">MAO Nacional</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                ['Site Nacional',       '/'],
                                ['Eventos Nacionais',   '/eventos'],
                                ['Documentos',          '/documentos'],
                                ['Dar',                 '/dar'],
                            ].map(([label, href]) => (
                                <li key={href as string}>
                                    <Link href={href as string} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-white/30">
                    © {new Date().getFullYear()} Ministério Alfa e Ômega — {province.name}
                </div>
            </div>
        </footer>
    );
}
