import { Link } from '@inertiajs/react';

export default function GlobalFooter() {
    return (
        <footer className="bg-ink text-white/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1  items-center md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="IEADAO"
                                className="w-40 h-40 object-contain brightness-0 invert"
                            />
                            {/* <span className="font-display text-xl font-semibold text-white">MAO</span> */}
                        </div>
                        <p className="text-sm leading-relaxed text-white/70">
                            Ministério Alfa e Ômega — levando o Evangelho a todo Moçambique desde 1996.
                        </p>
                    </div>

                    {/* Ministério */}
                    <div>
                        <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Ministério</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                ['Quem Somos', '/sobre'],
                                ['A Nossa História', '/historia'],
                                ['Estrutura da Igreja', '/estrutura-da-igreja'],
                                ['Grupos Homogéneos', '/grupos-homogeneos'],
                                ['Documentos', '/documentos'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Conteúdo */}
                    <div>
                        <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Conteúdo</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                ['Agenda', '/agenda'],
                                ['Mídia', '/midia'],
                                ['Notícias', '/noticias'],
                                ['Acção Social', '/social'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Conectar */}
                    <div>
                        <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Conectar</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                ['Encontrar uma Igreja', '/igrejas'],
                                ['Missões', '/missoes'],
                                ['Oração', '/oracao'],
                                ['Dar', '/dar'],
                                ['Contacto', '/contacto'],
                            ].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
                    <span>© {new Date().getFullYear()} Ministério Alfa e Ômega. Todos os direitos reservados.</span>
                    <div className="flex gap-6">
                        <Link href="/privacidade" className="hover:text-white/90 transition-colors">Privacidade</Link>
                        <Link href="/termos" className="hover:text-white/90 transition-colors">Termos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
