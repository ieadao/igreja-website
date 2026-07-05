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

export default function HomogeneousGroupPageTemplate({ page, relatedData }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroImgRef    = useRef<HTMLImageElement>(null);

    const section            = page.sections.homogeneous_group ?? {};
    const groupType          = relatedData.groupType ?? page.group_type ?? null;
    const heroImage          = page.hero_image ? storageUrl(page.hero_image) : null;
    const whatsappNumber     = page.whatsapp_number ?? groupType?.whatsapp_number ?? null;
    const whatsappHref       = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : null;
    const scriptureHighlights =
        section.scripture_highlights?.length
            ? section.scripture_highlights
            : section.scripture_badge
              ? [{ label: section.scripture_badge, url: null }]
              : [];
    const keyPoints  = section.key_points ?? [];
    const accentLetter = groupType?.acronym?.substring(0, 1) ?? 'G';

    useGSAP(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // hero parallax — kept subtle (yPercent 12) so scale-[1.15] buffer covers the gap
        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: { trigger: heroImgRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
        }

        // generic fade-up reveals
        // immediateRender: false — don't set opacity:0 until the trigger fires,
        // so elements already in the viewport on load are never invisible.
        gsap.utils.toArray<HTMLElement>('.hg-reveal').forEach((el, i) => {
            gsap.from(el, {
                y: 28,
                opacity: 0,
                duration: 0.9,
                delay: i * 0.07,
                ease: 'expo.out',
                immediateRender: false,
                scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            });
        });

        // staggered key-point cards
        const cards = gsap.utils.toArray<HTMLElement>('.hg-card');
        if (cards.length) {
            gsap.from(cards, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'expo.out',
                immediateRender: false,
                scrollTrigger: { trigger: cards[0], start: 'top 90%', once: true },
            });
        }

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tick);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-white">

            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-brand-dark">
                {/* background */}
                {heroImage ? (
                    <img
                        ref={heroImgRef}
                        src={heroImage}
                        alt={page.title}
                        className="absolute inset-0 h-full w-full object-cover scale-[1.18] origin-center"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,140,58,0.25),transparent_45%),linear-gradient(145deg,#10143D_0%,#1c245f_60%,#0a0d28_100%)]" />
                )}

                {/* overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-brand-dark/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />

                {/* large accent letter */}
                <span
                    aria-hidden
                    className="absolute right-0 bottom-0 font-display font-bold text-[28vw] leading-none text-white/[0.04] select-none pointer-events-none translate-x-6 translate-y-4"
                >
                    {accentLetter}
                </span>

                {/* content */}
                <div className="relative w-full max-w-7xl mx-auto px-6 pb-20 pt-40 lg:pb-28">
                    <div className="hg-reveal max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-light backdrop-blur mb-8">
                            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                            {groupType?.acronym ?? 'Grupo Homogéneo'}
                        </p>

                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.92] tracking-tight text-white mb-8">
                            {page.title}
                        </h1>

                        {page.excerpt && (
                            <p className="text-xl md:text-2xl text-white/68 font-light leading-relaxed max-w-2xl">
                                {page.excerpt}
                            </p>
                        )}

                        {whatsappHref && (
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-brand text-brand-dark font-medium rounded-lg hover:bg-brand-light transition-colors"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.528 5.862L0 24l6.335-1.648A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.366l-.359-.213-3.762.977.997-3.65-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                                </svg>
                                {section.cta_button_label ?? 'Falar com a liderança'}
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Key points ────────────────────────────────────────────────────── */}
            {keyPoints.length > 0 && (
                <section className="relative z-10 -mt-12 px-6 pb-4">
                    <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {keyPoints.map((point, i) => (
                            <article
                                key={`${point.title}-${i}`}
                                className="hg-card group bg-white rounded-[2rem] border border-brand/10 p-8 shadow-[0_20px_50px_rgba(16,20,61,0.07)] hover:shadow-[0_28px_64px_rgba(16,20,61,0.13)] transition-all hover:-translate-y-1"
                            >
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white text-lg font-bold font-display shadow-lg shadow-brand/30 group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>
                                <h2 className="font-display text-xl text-ink font-semibold mb-3 leading-tight">
                                    {point.title}
                                </h2>
                                <p className="text-ink-muted text-sm leading-relaxed">
                                    {point.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Scripture band ─────────────────────────────────────────────────── */}
            {scriptureHighlights.length > 0 && (
                <section className="hg-reveal bg-brand-pale border-y border-brand/10 py-14 px-6 my-12">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <p className="shrink-0 text-xs font-bold uppercase tracking-[0.28em] text-brand-text">
                            Base e orientação
                        </p>
                        <div className="h-px md:h-10 w-full md:w-px bg-brand/20 shrink-0" />
                        <div className="flex flex-wrap gap-3">
                            {scriptureHighlights.map((h, i) =>
                                h.url ? (
                                    <a
                                        key={`${h.label}-${i}`}
                                        href={h.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-2xl bg-brand px-5 py-2.5 text-base font-display font-semibold text-white hover:bg-brand-light transition-colors shadow-sm"
                                    >
                                        {h.label}
                                    </a>
                                ) : (
                                    <span
                                        key={`${h.label}-${i}`}
                                        className="rounded-2xl bg-brand px-5 py-2.5 text-base font-display font-semibold text-white"
                                    >
                                        {h.label}
                                    </span>
                                ),
                            )}
                        </div>
                        {groupType?.description && (
                            <p className="text-sm text-ink-muted leading-relaxed max-w-sm md:ml-auto">
                                {groupType.description}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* ── Main content ───────────────────────────────────────────────────── */}
            {(page.content || section.cta_heading || section.cta_body || groupType?.description) && (
                <section className="px-6 py-16 lg:py-24">
                    <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr_380px] items-start">

                        {/* editorial content */}
                        <div className="space-y-10">
                            {page.content && (
                                <div
                                    className="hg-reveal prose prose-lg prose-headings:font-display prose-headings:text-ink prose-headings:font-semibold prose-p:text-ink-muted prose-p:leading-relaxed prose-strong:text-ink prose-a:text-brand hover:prose-a:text-brand-light max-w-none"
                                    dangerouslySetInnerHTML={{ __html: page.content }}
                                />
                            )}

                            {(section.cta_heading || section.cta_body) && (
                                <div className="hg-reveal rounded-[2rem] border border-brand/15 bg-brand-pale p-8 lg:p-10">
                                    {section.cta_heading && (
                                        <h3 className="font-display text-3xl text-ink font-semibold mb-3 leading-tight">
                                            {section.cta_heading}
                                        </h3>
                                    )}
                                    {section.cta_body && (
                                        <p className="text-ink-muted leading-relaxed mb-8">
                                            {section.cta_body}
                                        </p>
                                    )}
                                    {whatsappHref && (
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-brand-dark text-sm font-medium rounded-lg hover:bg-brand-light transition-colors"
                                        >
                                            {section.cta_button_label ?? 'Contactar liderança'}
                                            <span aria-hidden>→</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* identity sidebar */}
                        <aside className="hg-reveal lg:sticky lg:top-28 rounded-[2rem] bg-brand-dark text-white overflow-hidden shadow-2xl shadow-brand-dark/30">
                            {/* accent strip */}
                            <div className="h-2 bg-gradient-to-r from-brand to-brand-light" />

                            <div className="p-8 space-y-8">
                                {/* acronym badge */}
                                <div className="flex items-center gap-4">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-2xl font-bold font-display text-brand-light">
                                        {groupType?.acronym ?? accentLetter}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50 mb-0.5">Grupo</p>
                                        <p className="font-display font-semibold text-white leading-tight">
                                            {groupType?.name ?? page.title}
                                        </p>
                                    </div>
                                </div>

                                {groupType?.description && scriptureHighlights.length === 0 && (
                                    <p className="text-white/60 leading-relaxed text-sm border-t border-white/10 pt-6">
                                        {groupType.description}
                                    </p>
                                )}

                                {scriptureHighlights.length > 0 && (
                                    <div className="border-t border-white/10 pt-6 space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                                            Referências bíblicas
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {scriptureHighlights.map((h, i) =>
                                                h.url ? (
                                                    <a
                                                        key={`sb-${h.label}-${i}`}
                                                        href={h.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-xl bg-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand/60 transition-colors"
                                                    >
                                                        {h.label}
                                                    </a>
                                                ) : (
                                                    <span
                                                        key={`sb-${h.label}-${i}`}
                                                        className="rounded-xl bg-white/10 px-4 py-1.5 text-sm font-semibold text-white"
                                                    >
                                                        {h.label}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {whatsappHref && (
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-3 px-6 py-4 bg-brand text-brand-dark text-sm font-medium rounded-lg hover:bg-brand-light transition-colors"
                                    >
                                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden>
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.528 5.862L0 24l6.335-1.648A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.366l-.359-.213-3.762.977.997-3.65-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                                        </svg>
                                        {section.cta_button_label ?? 'Falar no WhatsApp'}
                                    </a>
                                )}
                            </div>
                        </aside>
                    </div>
                </section>
            )}

            {/* ── Closing CTA band ───────────────────────────────────────────────── */}
            <section className="bg-brand-dark text-white py-24 px-6 relative">
                {/* overflow-hidden only on the decorative gradient, not the section, so animated children aren't clipped */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,103,0,0.18),transparent_55%)]" />
                </div>
                <div className="hg-reveal relative max-w-3xl mx-auto text-center">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-light backdrop-blur mb-8">
                        <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                        Faz parte da comunidade
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
                        Há um lugar para ti<br className="hidden sm:block" /> no{' '}
                        <span className="text-brand">{groupType?.acronym ?? 'grupo'}</span>
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto font-light">
                        Junta-te a nós e encontra acompanhamento, crescimento e comunhão na tua etapa de vida.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {whatsappHref && (
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-brand-dark font-medium rounded-lg hover:bg-brand-light transition-colors"
                            >
                                {section.cta_button_label ?? 'Entrar em contacto'}
                            </a>
                        )}
                        <a
                            href="/igrejas"
                            className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Encontrar uma Igreja
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
