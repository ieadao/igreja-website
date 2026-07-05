import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { storageUrl } from '@/lib/utils';
import type { SitePage, SitePageRelatedData } from '@/types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
    page: SitePage;
    relatedData: SitePageRelatedData;
}

export default function ChurchStructurePageTemplate({ page }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const section = page.sections.church_structure ?? {};
    const heroImage = page.hero_image ? storageUrl(page.hero_image) : null;

    useGSAP(() => {
        // ── Smooth scroll ──────────────────────────────────────────────────────
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenis.on('scroll', ScrollTrigger.update);
        const ticker = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        // ── Hero reveals ───────────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-reveal').forEach((el, i) => {
            gsap.from(el, {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: i * 0.15,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                }
            });
        });

        // ── Block reveals ──────────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-block-reveal').forEach((el) => {
            gsap.from(el, {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });
        });

        return () => {
            lenis.destroy();
            gsap.ticker.remove(ticker);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-brand-dark text-white">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,40,0.15),rgba(7,11,40,0.82))]" />
                {heroImage ? (
                    <img src={heroImage} alt={page.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,140,58,0.30),transparent_28%),linear-gradient(135deg,#10143D,#1c245f)]" />
                )}

                <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
                    <div className="max-w-4xl">
                        <div className="hs-reveal">
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-light backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-brand" />
                                Organização e liderança
                            </p>
                        </div>
                        
                        <h1 className="hs-reveal mt-8 font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.95]">
                            {page.title}
                        </h1>
                        
                        {page.excerpt && (
                            <div className="hs-reveal">
                                <p className="mt-6 max-w-3xl text-lg md:text-xl text-white/78 leading-relaxed">
                                    {page.excerpt}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Overlapping Intro Section */}
            {(section.intro_title || section.intro_body || page.content) && (
                <section className="relative z-10 -mt-10 px-6 mb-12">
                    <div className="hs-block-reveal max-w-5xl mx-auto rounded-2xl border border-brand/10 bg-white p-8 lg:p-12 shadow-[0_18px_40px_rgba(16,20,61,0.08)]">
                        {section.intro_title && (
                            <h2 className="font-display text-3xl md:text-4xl text-ink font-semibold mb-6">
                                {section.intro_title}
                            </h2>
                        )}
                        {section.intro_body && (
                            <p className="text-lg text-ink-muted leading-relaxed mb-8">
                                {section.intro_body}
                            </p>
                        )}
                        {page.content && (
                            <div
                                className="prose prose-lg prose-p:text-ink-muted prose-headings:text-ink max-w-none"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* Structure Blocks */}
            <section className="px-6 pb-32">
                <div className="max-w-5xl mx-auto space-y-8">
                    {(section.blocks ?? []).map((block, index) => (
                        <article 
                            key={`${block.title}-${index}`} 
                            className="hs-block-reveal group bg-white rounded-2xl border border-brand/10 p-8 lg:p-12 shadow-[0_18px_40px_rgba(16,20,61,0.08)]"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-pale text-brand-text font-bold text-sm">
                                    {index + 1}
                                </span>
                                <h3 className="font-display text-3xl md:text-4xl text-ink font-semibold">
                                    {block.title}
                                </h3>
                            </div>

                            {block.type === 'image' && block.image ? (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
                                        <img 
                                            src={storageUrl(block.image)} 
                                            alt={block.title} 
                                            className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700" 
                                        />
                                    </div>
                                    {block.caption && (
                                        <p className="text-sm text-ink-faint italic text-center">
                                            — {block.caption}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="prose prose-lg prose-p:text-ink-muted prose-headings:text-ink max-w-none prose-strong:text-brand-text"
                                    dangerouslySetInnerHTML={{ __html: block.body ?? '' }}
                                />
                            )}
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-brand-dark text-white py-24 px-6 text-center overflow-hidden">
                <div className="hs-block-reveal max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Faz Parte da Família</h2>
                    <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
                        Estamos presentes em todo o país, prontos para te acolher. Encontra a igreja mais próxima de ti.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/igrejas"
                            className="px-10 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-light transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-brand/20"
                        >
                            Encontrar uma Igreja
                        </a>
                        <a
                            href="/contacto"
                            className="px-10 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
                        >
                            Falar Connosco
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
