import { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import GlobalLayout from '@/layouts/GlobalLayout';
import { storageUrl } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Group {
    id: number;
    name: string;
    acronym: string | null;
    slug: string;
    icon: string;
    description: string | null;
    page_slug: string | null;
    hero_image: string | null;
    excerpt: string | null;
}

interface Props {
    groups: Group[];
}

// Zero-padded index: 1 → "01"
function pad(n: number) {
    return String(n).padStart(2, '0');
}

export default function HomogeneousGroups({ groups }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef       = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // ── Smooth scroll ──────────────────────────────────────────────────────
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // ── Scroll progress bar ────────────────────────────────────────────────
        if (barRef.current && containerRef.current) {
            gsap.fromTo(
                barRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                    },
                },
            );
        }

        // ── Hero headline lines ────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hg-hero-line').forEach((el, i) => {
            gsap.from(el, {
                yPercent: 110,
                opacity: 0,
                duration: 1.3,
                delay: 0.1 + i * 0.14,
                ease: 'expo.out',
            });
        });

        // ── Hero meta fade-in ──────────────────────────────────────────────────
        gsap.from('.hg-hero-meta', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.6,
            ease: 'expo.out',
            immediateRender: false,
        });

        // ── Scroll cue arrow fade out ──────────────────────────────────────────
        gsap.to('.hg-scroll-cue', {
            opacity: 0,
            y: -16,
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top+=60 top',
                end: 'top+=200 top',
                scrub: true,
            },
        });

        // ── Intro strip reveal ─────────────────────────────────────────────────
        // Intro strip is below the fold — default immediateRender:true so lines
        // start at scaleX:0 on page load and animate in when scrolled to.
        gsap.from('.hg-intro-line', {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.hg-intro-strip', start: 'top 86%', once: true },
        });
        gsap.from('.hg-intro-text', {
            opacity: 0,
            y: 24,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.hg-intro-strip', start: 'top 86%', once: true },
        });

        // ── Group row animations ───────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hg-visual').forEach((panel) => {
            // Clip-path curtain reveal.
            // fromTo default is immediateRender:true — FROM state (fully clipped) is
            // applied immediately on load while panels are off-screen, so no flash.
            gsap.fromTo(
                panel,
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2,
                    ease: 'expo.inOut',
                    scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
                },
            );

            // parallax on inner image / acronym
            const inner = panel.querySelector<HTMLElement>('.hg-visual-inner');
            if (inner) {
                gsap.fromTo(
                    inner,
                    { yPercent: -8 },
                    {
                        yPercent: 8,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: panel,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    },
                );
            }
        });

        // title lines per row
        gsap.utils.toArray<HTMLElement>('.hg-title-line').forEach((el) => {
            gsap.from(el, {
                yPercent: 115,
                duration: 1.1,
                ease: 'expo.out',
                immediateRender: false,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            });
        });

        // body / meta reveals
        gsap.utils.toArray<HTMLElement>('.hg-reveal').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 28,
                duration: 0.9,
                ease: 'power2.out',
                immediateRender: false,
                scrollTrigger: { trigger: el, start: 'top 91%', once: true },
            });
        });

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tick);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: containerRef });

    return (
        <GlobalLayout heroTransparent>
            <Head title="Grupos Homogéneos" />

            <div ref={containerRef} className="bg-cream overflow-x-hidden">

                {/* ── Scroll progress bar ─────────────────────────────────────── */}
                <div className="fixed top-0 left-0 right-0 z-[200] h-0.5 bg-border origin-left" aria-hidden>
                    <div ref={barRef} className="h-full bg-brand origin-left scale-x-0" />
                </div>

                {/* ── Hero ─────────────────────────────────────────────────────── */}
                <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-brand-dark text-white">
                    {/* Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,103,0,0.18),transparent_50%),linear-gradient(160deg,#10143D_0%,#1c245f_55%,#080a1f_100%)]" />

                    {/* Giant background word */}
                    <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 text-center font-display font-bold text-[22vw] leading-none text-white/[0.03] select-none pointer-events-none whitespace-nowrap"
                    >
                        COMUNHÃO
                    </span>

                    {/* Content */}
                    <div className="relative w-full max-w-7xl mx-auto px-6 pb-20 pt-36 lg:pb-28 lg:pt-44">

                        {/* Pill */}
                        <div className="hg-hero-meta mb-10">
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-light backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                                {groups.length} Áreas de serviço e comunhão
                            </p>
                        </div>

                        {/* Headline — each word is an individual clipped line */}
                        <h1 className="font-display font-semibold leading-[0.9] tracking-tight overflow-hidden">
                            <div className="overflow-hidden">
                                <span className="hg-hero-line block text-[clamp(3.5rem,10vw,8rem)]">
                                    Grupos
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="hg-hero-line block text-[clamp(3.5rem,10vw,8rem)] text-brand">
                                    Homogéneos
                                </span>
                            </div>
                        </h1>

                        {/* Subtitle + scroll cue */}
                        <div className="hg-hero-meta mt-10 flex flex-col sm:flex-row sm:items-end gap-8 justify-between max-w-5xl">
                            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-lg">
                                Estruturas dedicadas ao acompanhamento, discipulado e fortalecimento da fé em cada etapa da vida.
                            </p>

                            {/* Scroll cue */}
                            <div className="hg-scroll-cue flex items-center gap-3 text-white/40 text-sm font-medium shrink-0 self-end sm:self-auto">
                                <span className="uppercase tracking-widest text-[10px]">Scroll</span>
                                <span className="inline-flex flex-col gap-0.5">
                                    <span className="w-px h-8 bg-white/20 mx-auto" />
                                    <span className="text-xs">↓</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Intro strip ──────────────────────────────────────────────── */}
                <div className="hg-intro-strip bg-cream border-b border-border py-10 px-6">
                    <div className="max-w-7xl mx-auto flex items-center gap-6">
                        <div className="hg-intro-line h-px flex-1 bg-border-strong origin-left" />
                        <p className="hg-intro-text font-display text-sm font-semibold uppercase tracking-[0.28em] text-ink-faint whitespace-nowrap">
                            {groups.length} grupos · uma comunidade
                        </p>
                        <div className="hg-intro-line h-px flex-1 bg-border-strong origin-left" />
                    </div>
                </div>

                {/* ── Group rows ───────────────────────────────────────────────── */}
                {groups.map((group, i) => {
                    const isEven   = i % 2 === 1;
                    const href     = group.page_slug ? `/grupos-homogeneos/${group.page_slug}` : null;
                    const acronym  = group.acronym ?? group.slug.slice(0, 3).toUpperCase();
                    const excerpt  = group.excerpt ?? group.description ?? 'Uma área dedicada ao crescimento espiritual e comunhão entre os membros.';

                    return (
                        <article
                            key={group.id}
                            className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[70vh] border-b border-border`}
                        >
                            {/* ── Visual panel ──────────────────────────────────── */}
                            <div className="hg-visual relative lg:w-1/2 min-h-[50vw] lg:min-h-0 overflow-hidden bg-brand-dark">
                                {group.hero_image ? (
                                    <img
                                        src={storageUrl(group.hero_image)}
                                        alt={group.name}
                                        className="hg-visual-inner absolute inset-0 h-[115%] w-full object-cover -top-[7%]"
                                    />
                                ) : (
                                    <div className="hg-visual-inner absolute inset-0 h-[115%] -top-[7%] bg-[radial-gradient(circle_at_35%_45%,rgba(255,103,0,0.20),transparent_55%),linear-gradient(135deg,#10143D,#1c245f)]" />
                                )}

                                {/* overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />

                                {/* Giant acronym watermark */}
                                <span
                                    aria-hidden
                                    className="absolute inset-0 flex items-center justify-center font-display font-bold text-[clamp(6rem,18vw,14rem)] text-white/[0.07] select-none pointer-events-none leading-none"
                                >
                                    {acronym}
                                </span>

                                {/* Index badge */}
                                <span className="absolute top-8 left-8 font-display text-xs font-bold text-white/40 tracking-[0.3em] uppercase">
                                    {pad(i + 1)} / {pad(groups.length)}
                                </span>
                            </div>

                            {/* ── Content panel ─────────────────────────────────── */}
                            <div className={`relative lg:w-1/2 flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 bg-cream ${isEven ? 'lg:border-r border-border' : 'lg:border-l border-border'}`}>

                                {/* Index + acronym row */}
                                <div className="hg-reveal flex items-center gap-4 mb-8">
                                    <span className="font-display text-[clamp(3rem,6vw,5rem)] font-bold text-brand/15 leading-none select-none">
                                        {pad(i + 1)}
                                    </span>
                                    <div className="h-px flex-1 bg-border" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text bg-brand-pale px-3 py-1.5 rounded-full">
                                        {acronym}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="overflow-hidden mb-6">
                                    <h2 className="hg-title-line font-display font-semibold leading-[1.0] text-ink text-[clamp(2rem,4vw,3.25rem)]">
                                        {group.name}
                                    </h2>
                                </div>

                                {/* Divider */}
                                <div className="hg-reveal w-12 h-0.5 bg-brand mb-6" />

                                {/* Excerpt */}
                                <p className="hg-reveal text-ink-faint leading-relaxed text-base lg:text-lg max-w-md mb-10">
                                    {excerpt}
                                </p>

                                {/* CTA */}
                                <div className="hg-reveal">
                                    {href ? (
                                        <Link
                                            href={href}
                                            className="group/link inline-flex items-center gap-3 text-sm font-bold text-ink hover:text-brand transition-colors"
                                        >
                                            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all group-hover/link:after:w-full">
                                                Explorar grupo
                                            </span>
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand group-hover/link:bg-brand group-hover/link:text-white transition-all">
                                                →
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-faint">
                                            <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
                                            Em breve
                                        </span>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}

                {/* ── CTA band ─────────────────────────────────────────────────── */}
                <section className="relative bg-brand-dark text-white py-28 px-6 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,103,0,0.16),transparent_50%)]" />
                    </div>
                    <div className="hg-reveal relative max-w-4xl mx-auto text-center">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-light backdrop-blur mb-10">
                            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                            Faz parte da comunidade
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-8">
                            Há sempre um lugar<br className="hidden sm:block" /> para ti aqui
                        </h2>
                        <p className="text-white/55 text-lg leading-relaxed mb-12 max-w-xl mx-auto font-light">
                            Encontra o teu grupo e começa a caminhar connosco na fé, no serviço e na comunhão.
                        </p>
                        <a
                            href="/igrejas"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-brand text-brand-dark font-medium rounded-lg hover:bg-brand-light transition-colors"
                        >
                            Encontrar uma Igreja
                            <span>→</span>
                        </a>
                    </div>
                </section>
            </div>
        </GlobalLayout>
    );
}
