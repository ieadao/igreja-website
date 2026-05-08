import { Head, usePage } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import type { SharedProps } from '@/types';

export default function Home() {
    return (
        <GlobalLayout heroTransparent>
            <Head title="Início" />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center bg-brand-dark overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
                />
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-6">
                        Ministério Alfa e Ômega — Moçambique
                    </p>
                    <h1 className="font-display text-5xl sm:text-7xl font-semibold leading-tight mb-8">
                        Firmes na Fé.<br />
                        Unidos em Cristo.
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Levando o Evangelho a todo Moçambique desde 1996.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/igrejas"
                            className="px-8 py-4 bg-brand text-white font-medium rounded-lg hover:bg-brand-light transition-colors"
                        >
                            Encontrar uma Igreja
                        </a>
                        <a
                            href="/sobre"
                            className="px-8 py-4 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Saber Mais
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* Provinces strip */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">Presença Nacional</p>
                    <h2 className="font-display text-4xl font-semibold text-ink mb-4">
                        Estamos em todo Moçambique
                    </h2>
                    <p className="text-ink-muted max-w-xl mx-auto mb-12">
                        Igrejas locais, eventos regionais e conteúdo pastoral em todas as províncias do país.
                    </p>
                    <ProvinceCards />
                </div>
            </section>
        </GlobalLayout>
    );
}

function ProvinceCards() {
    const { provinces } = usePage<SharedProps>().props;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {provinces.map((p) => (
                <a
                    key={p.id}
                    href={`/provincia/${p.slug}`}
                    className="group block p-6 rounded-xl border border-border hover:border-brand hover:bg-brand-pale transition-all text-center"
                >
                    <span className="block font-display text-lg font-medium text-ink group-hover:text-brand transition-colors">
                        {p.name}
                    </span>
                </a>
            ))}
        </div>
    );
}
