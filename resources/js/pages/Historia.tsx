import { useRef, useState, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import GlobalLayout from '@/layouts/GlobalLayout';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-[999] bg-black/92 flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <button
                className="absolute top-5 right-6 text-white/50 hover:text-white text-4xl leading-none transition-colors"
                onClick={onClose}
                aria-label="Fechar"
            >
                ×
            </button>
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()}
            />
            {alt && (
                <p className="mt-5 text-center text-white/40 text-sm max-w-xl px-4 italic">{alt}</p>
            )}
        </div>
    );
}

// Wrapper that adds cursor-zoom-in + lightbox trigger for any image
function LightboxImage({
    src,
    alt,
    className,
    style,
    onClick,
}: {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}) {
    return (
        <div className="relative group cursor-zoom-in" onClick={onClick} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}>
            <img src={src} alt={alt} className={className} style={style} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl backdrop-blur-sm">
                    ⤢
                </div>
            </div>
        </div>
    );
}

export default function Historia() {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

    const lb = useCallback((src: string, alt: string) => () => setLightbox({ src, alt }), []);
    const closeLb = useCallback(() => setLightbox(null), []);

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

        // ── Progress bar ───────────────────────────────────────────────────────
        if (barRef.current) {
            gsap.fromTo(barRef.current,
                { scaleX: 0 },
                { scaleX: 1, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom bottom', scrub: true } }
            );
        }

        // ── Hero lines ─────────────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-hero-line').forEach((el, i) => {
            gsap.from(el, { yPercent: 110, opacity: 0, duration: 1.3, delay: 0.15 + i * 0.13, ease: 'expo.out' });
        });

        // ── Scroll cue fade ────────────────────────────────────────────────────
        gsap.to('.hs-scroll-cue', {
            opacity: 0,
            scrollTrigger: { trigger: containerRef.current, start: 'top+=80 top', end: 'top+=260 top', scrub: true },
        });

        // ── Parallax images ────────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-parallax-img').forEach((img) => {
            const section = img.closest('section') ?? img.parentElement;
            gsap.fromTo(img, { yPercent: -12 }, {
                yPercent: 12, ease: 'none',
                scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });

        // ── Clip-path image curtain reveals ────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-clip-reveal').forEach((el) => {
            gsap.fromTo(el,
                { clipPath: 'inset(100% 0 0 0)' },
                { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out',
                  scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' } }
            );
        });

        // ── Title lines (clip upward) ──────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-title-line').forEach((el) => {
            gsap.from(el, { yPercent: 115, duration: 1.1, ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });

        // ── General fade + rise ────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-reveal').forEach((el) => {
            gsap.from(el, { opacity: 0, y: 36, duration: 0.85, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });

        // ── Counters ───────────────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-counter').forEach((el) => {
            const target = parseInt(el.getAttribute('data-target') ?? '0', 10);
            const counter = { val: 0 };
            gsap.to(counter, {
                val: target, duration: 2.5, ease: 'power2.out',
                onUpdate: () => { el.textContent = Math.round(counter.val).toLocaleString('pt-PT'); },
                scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
            });
        });

        // ── Photo strip scale ──────────────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>('.hs-strip-img').forEach((el) => {
            gsap.fromTo(el, { scale: 1.12 }, {
                scale: 1, duration: 1.2, ease: 'expo.out',
                scrollTrigger: { trigger: el.parentElement, start: 'top 85%', toggleActions: 'play none none reverse' },
            });
        });

        // ── Horizontal timeline (CSS sticky + scrub, desktop only) ───────────
        // On mobile we skip GSAP entirely and rely on native overflow-x scroll
        // so the first card always starts at position zero.
        const wrapper = containerRef.current?.querySelector<HTMLElement>('.hs-timeline-wrapper');
        const track   = containerRef.current?.querySelector<HTMLElement>('.hs-timeline-track');
        if (wrapper && track && window.innerWidth >= 1024) {
            const setHeight = () => {
                const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
                wrapper.style.height = `${window.innerHeight + overflow}px`;
            };
            setHeight();
            gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onRefresh: setHeight,
                },
            });
        }

        return () => {
            lenis.destroy();
            gsap.ticker.remove(ticker);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: containerRef });

    return (
        <GlobalLayout heroTransparent>
            <Head title="A Nossa História — MAO Moçambique" />

            {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLb} />}

            {/* Progress bar */}
            <div ref={barRef} className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-brand origin-left" style={{ transform: 'scaleX(0)' }} />

            <div ref={containerRef}>

                {/* ════════════════════════════════════════════════════════════
                    HERO
                ════════════════════════════════════════════════════════════ */}
                <section className="relative h-screen bg-[var(--color-ink)] flex flex-col justify-end pb-24 px-6 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,0.018) 60px,rgba(255,255,255,0.018) 61px)' }} />
                    <div className="absolute top-[15%] right-[-8%] w-[55vw] h-[55vw] rounded-full blur-3xl pointer-events-none"
                        style={{ background: 'radial-gradient(circle,rgba(255,103,0,0.45) 0%,transparent 65%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(16,20,61,1) 0%, transparent 100%)' }} />

                    <div className="relative max-w-7xl mx-auto w-full">
                        <div className="overflow-hidden mb-5">
                            <p className="hs-hero-line text-[var(--color-brand-light)] text-xs font-semibold tracking-[0.3em] uppercase">
                                Ministério Alfa e Ômega · Fundado em 1995
                            </p>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="hs-hero-line font-display font-semibold leading-[0.88] text-white"
                                style={{ fontSize: 'clamp(4.5rem,12vw,10rem)' }}>
                                A Nossa
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="hs-hero-line font-display font-semibold leading-[0.88] text-[var(--color-brand-light)]"
                                style={{ fontSize: 'clamp(4.5rem,12vw,10rem)' }}>
                                História
                            </h1>
                        </div>
                        <div className="overflow-hidden mt-8 max-w-xl">
                            <p className="hs-hero-line text-white/45 text-lg leading-relaxed">
                                Em memória de todos os pioneiros do Evangelho que deram as suas vidas neste país imenso.
                            </p>
                        </div>
                    </div>

                    <div className="hs-scroll-cue absolute bottom-10 right-8 flex flex-col items-center gap-2 text-white/25 select-none">
                        <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
                        <div className="w-px h-14 bg-white/15 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50"
                                style={{ animation: 'hsCue 1.6s ease-in-out infinite' }} />
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 1 — O CHÃO  (roots and early missions)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen overflow-hidden flex items-center">
                    <div className="absolute inset-0">
                        <img src="/images/historia/image15.jpeg"
                            alt="Antigo Consulado da Grécia, sede em 1957"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover object-center grayscale" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(105deg, rgba(16,20,61,0.93) 45%, rgba(16,20,61,0.55) 100%)' }} />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-32 grid lg:grid-cols-5 gap-16 items-center">
                        <div className="lg:col-span-3">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/30 tracking-widest">01</span>
                                <div className="hs-reveal h-px flex-1 bg-white/15" />
                                <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">Séc. XVIII – 1911</span>
                            </div>
                            <div className="overflow-hidden mb-3">
                                <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                    style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)' }}>O Chão</h2>
                            </div>
                            <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-7">
                                Do Protestantismo à Génese Pentecostal
                            </p>
                            <p className="hs-reveal text-white/65 text-lg leading-relaxed mb-4">
                                As raízes evangélicas em Moçambique remontam a 1742, mas a chama pentecostal foi acesa por moçambicanos que regressavam das minas da África do Sul. Em 1911, o jovem <strong>Paulo Khosa</strong> trouxe a mensagem, dando origem às primeiras congregações que seriam o alicerce das Assembleias de Deus.
                            </p>
                            <p className="hs-reveal text-white/45 text-base leading-relaxed mb-3">
                                Antes disso, missões Metodistas (1823), Anglicanas (1875) e Reformadas enfrentaram a resistência do governo colonial. A liberdade de missionação só se consolidaria após a Conferência de Berlim em 1885.
                            </p>
                            <p className="hs-reveal text-white/50 text-base leading-relaxed">
                                Em 1958, Lourenço Marques já era um mosaico de fé, com missões de todo o mundo cooperando para espalhar o Evangelho em solo moçambicano.
                            </p>
                        </div>

                        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center gap-10 pl-8 border-l border-white/10">
                            <p className="hs-reveal text-white/20 text-[10px] tracking-[0.35em] uppercase">Marcos Históricos</p>
                            {[
                                ['1911', 'Paulo Khosa traz a chama pentecostal'],
                                ['1823', 'Início da Missão Metodista em LM'],
                                ['1885', 'Liberdade de missionação (Berlim)'],
                            ].map(([val, label]) => (
                                <div key={label} className="hs-reveal">
                                    <div className="font-display font-bold text-white leading-[0.85]"
                                        style={{ fontSize: 'clamp(3rem,5.5vw,4.5rem)' }}>
                                        {val}
                                    </div>
                                    <div className="w-8 h-0.5 my-3" style={{ backgroundColor: 'rgba(255,103,0,0.55)' }} />
                                    <p className="text-white/50 text-sm">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 2 — A CHAMA  (Origins in PT and arrival in MZ)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative bg-[var(--color-cream)] overflow-hidden">
                    <div className="absolute -top-8 -right-8 leading-none font-display font-bold select-none pointer-events-none"
                        style={{ fontSize: 'clamp(14rem,28vw,22rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(16,20,61,0.05)' }}>
                        02
                    </div>
                    <div className="max-w-7xl mx-auto px-6 py-28">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">02</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1908–1946</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                            <div className="lg:sticky lg:top-24 space-y-5">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl">
                                    <img src="/images/historia/image4.jpeg"
                                        alt="Família Chawner em 1927"
                                        className="w-full object-cover grayscale" />
                                </div>
                                <p className="text-[var(--color-ink-faint)] text-xs text-center tracking-wide italic">
                                    Charles e Emma Chawner à direita e Austin e Carrie à esquerda (1927)
                                </p>
                            </div>

                            <div className="space-y-20">
                                <div>
                                    <div className="overflow-hidden mb-3">
                                        <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                            style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>A Chama</h2>
                                    </div>
                                    <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-6">
                                        Austin Chawner e os Primeiros Passos
                                    </p>
                                    <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                        A família Chawner chegou à África do Sul em 1908, focando-se inicialmente no povo Zulu. <strong>Austin Chawner</strong>, que tinha apenas seis anos à chegada, cresceria para se tornar o grande obreiro em Moçambique. Em 1926, obteve residência temporária e iniciou o estudo do Português em Lourenço Marques.
                                    </p>
                                    <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                        Casou-se com <strong>Ingrid Lokken</strong> em 1934, uma norueguesa corajosa que já trabalhava no país desde 1929 e tinha conseguido o reconhecimento oficial da missão Pentecostal. Juntos, enfrentaram a Concordata de 1940 e as proibições coloniais, estabelecendo igrejas dirigidas por nacionais.
                                    </p>
                                </div>

                                <div className="hs-reveal border-l-4 border-[var(--color-brand)]/30 pl-7">
                                    <p className="text-[var(--color-brand)] font-bold text-xs tracking-widest uppercase mb-3">O Nascimento da Igreja</p>
                                    <h3 className="font-display font-semibold text-[var(--color-ink)] text-2xl mb-4">7 de Abril de 1946</h3>
                                    <p className="text-[var(--color-ink-muted)] text-base leading-relaxed mb-4">
                                        A primeira Acta registra o nascimento oficial da Assembleia de Deus em Lourenço Marques para língua portuguesa na Av. Gomes Freire, 159. O que começou com oito membros e trinta assistentes sob a liderança de <strong>Faria Lopes</strong>, logo floresceria com a chegada dos primeiros missionários portugueses.
                                    </p>
                                </div>

                                <div className="hs-reveal overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-xl">
                                    <LightboxImage
                                        src="/images/historia/image5.jpeg"
                                        alt="Missionários Austin e Ingrid Chawner, 1934"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image5.jpeg', 'Missionários Austin e Ingrid Chawner no dia do casamento, 31 de Dezembro de 1934')}
                                    />
                                    <div className="bg-white px-6 py-4 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-ink-faint)] text-xs tracking-wide italic">
                                            Austin e Ingrid Chawner — 1934
                                        </p>
                                    </div>
                                </div>

                                <div className="hs-reveal overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-xl">
                                    <div className="relative">
                                        <LightboxImage
                                            src="/images/historia/image7.jpeg"
                                            alt="Acta Número Um — 7 de Abril de 1946"
                                            className="w-full object-cover max-h-80 object-top"
                                            onClick={lb('/images/historia/image7.jpeg', 'Livro de Actas n.1 — Registro do primeiro culto da Assembleia de Deus em LM')}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                                            style={{ background: 'linear-gradient(to top, white, transparent)' }} />
                                    </div>
                                    <div className="bg-white px-7 py-6 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-brand-text)] font-bold text-xs tracking-widest uppercase mb-2">
                                            Documento Histórico
                                        </p>
                                        <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed italic">
                                            «Aos sete dias do mês de Abril, de mil novecentos quarenta e seis, realizou-se a primeira Santa Ceia e culto...»
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 3 — CRESCIMENTO E AVIVAMENTO  (50s - 70s)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-white overflow-hidden py-28 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">03</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1947–1970</span>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-start">
                            <div className="lg:col-span-3">
                                <div className="overflow-hidden mb-3">
                                    <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>Crescimento e Avivamento</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-7">
                                    De Lourenço Marques ao Estádio do Sporting
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Em Maio de 1947, após 34 dias de viagem no navio «Niassa», chegaram <strong>José Augusto Pina</strong> e <strong>Joaquim do Cerro</strong>. A chegada destes missionários portugueses impulsionou o trabalho em língua portuguesa, estabelecendo a Escola Dominical e os primeiros baptismos na Praia da Polana.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Em 1969, o país viveu um avivamento sem precedentes. No Estádio Coberto do Sporting, mais de 10.000 pessoas reuniram-se numa única noite sob a pregação do evangelista <strong>Dr. Luís Schiliró</strong>. Relatos de curas de cegos, surdos e paralíticos ocuparam as manchetes dos principais jornais coloniais.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                    A Igreja instalou-se no antigo consulado da Grécia em 1957, transformando uma mansão colonial no seu principal templo, símbolo da fé que já não cabia nos salões provisórios.
                                </p>
                            </div>

                            <div className="lg:col-span-2 space-y-5">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-xl border border-[var(--color-border)]">
                                    <LightboxImage
                                        src="/images/historia/image16.png"
                                        alt="Baptismos na Praia da Polana, 1958"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image16.png', 'Baptismos na Praia da Polana — Lourenço Marques, 1958')}
                                    />
                                    <div className="bg-[var(--color-cream)] px-5 py-4 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-ink-faint)] text-xs italic">Baptismos na Praia da Polana, 1958</p>
                                    </div>
                                </div>
                                <div className="hs-clip-reveal overflow-hidden rounded-xl shadow-2xl border border-white/10">
                                    <LightboxImage
                                        src="/images/historia/image21.jpeg"
                                        alt="Jornal Notícias, Julho de 1969"
                                        className="w-full object-cover"
                                        onClick={lb('/images/historia/image21.jpeg', 'Jornal Notícias, 15 de Julho de 1969 — Relato de curas no Estádio do Sporting')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 4 — UM HERÓI MOÇAMBICANO  (Laurentino Mulungo)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-[var(--color-ink)] relative overflow-hidden py-32 px-6">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <img src="/images/historia/image38.jpeg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 lg:gap-24 items-start">
                        <div className="lg:col-span-2 space-y-5">
                            <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl">
                                <LightboxImage
                                    src="/images/historia/image38.jpeg"
                                    alt="Pastor Laurentino Mulungo"
                                    className="w-full object-cover grayscale"
                                    onClick={lb('/images/historia/image38.jpeg', 'Pastor Laurentino Mulungo — pioneiro e herói da fé')}
                                />
                            </div>
                            <div className="hs-reveal overflow-hidden rounded-xl border border-white/8 shadow-xl">
                                <LightboxImage
                                    src="/images/historia/image34.jpeg"
                                    alt="A famosa mangueira de Tlavane"
                                    className="w-full object-cover grayscale max-h-52 object-center"
                                    onClick={lb('/images/historia/image34.jpeg', 'A «famosa» mangueira de Tlavane — onde a pregação de Mulungo ganhava almas')}
                                />
                                <div className="px-5 py-4 bg-white/3 border-t border-white/8">
                                    <p className="text-white/35 text-xs italic">A «famosa» mangueira de Tlavane</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/20 tracking-widest">04</span>
                                <div className="hs-reveal h-px flex-1 bg-white/10" />
                                <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">1920–2006</span>
                            </div>
                            <div className="overflow-hidden mb-3">
                                <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                    style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>Um Herói Moçambicano</h2>
                            </div>
                            <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-7">
                                Laurentino Mulungo — O Pescador de Homens
                            </p>
                            <p className="hs-reveal text-white/60 text-lg leading-relaxed mb-5">
                                Nascido na Manhiça-Calanga em 1920, Laurentino Mulungo trocou o ofício de pescador de peixe pelo de «pescador de homens» em 1939. Enfrentou oposição familiar severa e a perseguição colonial, sendo chicoteado e preso por pregar na zona da «Tourada».
                            </p>
                            <p className="hs-reveal text-white/50 text-lg leading-relaxed mb-5">
                                Em 1955, fundou a igreja no Bairro do Aeroporto, conhecida como <strong>Tlavane</strong>. Sem templo oficial, os cultos eram realizados debaixo de uma mangueira — hoje um local histórico. Laurentino foi um dos principais rostos da expansão missionária nacional, organizando a juventude e as ligas femininas.
                            </p>
                            <p className="hs-reveal text-white/45 text-lg leading-relaxed mb-8">
                                Em 1975, foi deportado para campos de reeducação em Nampula e Niassa. Lá, transformou a prisão em púlpito, fundando congregações entre os prisioneiros. «Eu não podia passar horas sem testemunhar de Jesus», dizia ele, um homem cuja vida foi marcada por milagres e perseverança inabalável.
                            </p>
                            <div className="hs-reveal grid grid-cols-3 gap-3">
                                {[33, 35, 36, 37].map((n) => (
                                    <div key={n} className="overflow-hidden rounded-xl border border-white/8 shadow-lg">
                                        <LightboxImage
                                            src={`/images/historia/image${n}.jpeg`}
                                            alt="Laurentino Mulungo em ministério"
                                            className="w-full h-28 object-cover grayscale"
                                            onClick={lb(`/images/historia/image${n}.jpeg`, 'Laurentino Mulungo em diferentes momentos do seu ministério')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 5 — FOGO SOB PROVA  (Independence and Persecution)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-[var(--color-cream)] py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">05</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1975–1992</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                            <div>
                                <div className="overflow-hidden mb-3">
                                    <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>Fogo sob Prova</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-7">
                                    Independência e a Travessia do Deserto
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    O templo da Av. Eduardo Mondlane foi inaugurado em 30 de Maio de 1975, poucos dias antes da independência. Com a ascensão do regime marxista, a Igreja enfrentou tempos de hostilidade: numerosos locais de culto foram encerrados e o prédio de 14 andares, património da Igreja, foi nacionalizado em 1976.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Sob a liderança do Pastor <strong>Dino Amade</strong> (1976–2015), herói da fé e visionário, a Igreja resistiu à perseguição. Mesmo durante a guerra civil (1981–1992), o Evangelho avançou nos campos de reeducação e entre os refugiados, consolidando a identidade resiliente das Assembleias de Deus.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                    Em 1985, com a vinda dos missionários canadianos <strong>Bill e Linda Mercer</strong>, foi implantada a Escola Bíblica, garantindo que o fogo ministerial permanecesse aceso para as gerações futuras.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl border border-[var(--color-border)]">
                                    <LightboxImage
                                        src="/images/historia/image30.jpeg"
                                        alt="Pastor Dino Amade"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image30.jpeg', 'Pastor Muhibo Dino Mussá Amade — Superintendente Geral e visionário da Escola Bíblica')}
                                    />
                                </div>
                                <div className="hs-reveal overflow-hidden rounded-xl border border-[var(--color-border)] shadow-xl">
                                    <div className="p-8 bg-white">
                                        <p className="text-[var(--color-brand-text)] font-bold text-xs tracking-widest uppercase mb-4">Legado Ministerial</p>
                                        <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed italic">
                                            «O pr. Dino Amade foi honrado e será sempre lembrado como um herói da fé, pois glorificou o nome do Senhor em tempos de perseguição.»
                                        </p>
                                        <p className="text-[var(--color-ink-faint)] text-[10px] mt-4 font-mono">1920–2015</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 6 — A ÚLTIMA VIAGEM  (Mulungo's death)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-white overflow-hidden py-28 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">06</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">2006</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl border border-[var(--color-border)]">
                                    <img src="/images/historia/image26.jpeg"
                                        alt="Igreja de Tlavane"
                                        className="w-full object-cover grayscale" />
                                </div>
                                <p className="text-[var(--color-ink-faint)] text-xs text-center mt-4 italic">
                                    A Igreja de Tlavane — onde Laurentino Mulungo serviu fielmente até à sua partida
                                </p>
                            </div>

                            <div className="order-1 lg:order-2">
                                <div className="overflow-hidden mb-3">
                                    <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>A Última Viagem</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-6">
                                    10 de Maio de 2006
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    O dia 10 de Maio de 2006 reservava a despedida de um patriarca. O Pastor Mulungo partiu de Maputo para uma viagem missionária ao Chimoio. Na madrugada do dia seguinte, em Muxungwé, um trágico acidente roubou a vida do grande líder e do Pastor Sebastião Livombo.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                    O seu funeral, a 15 de Maio de 2006, foi uma das maiores manifestações de fé do país. Como diz o apóstolo Paulo: <em className="text-[var(--color-ink)]">«Combati o bom combate, acabei a carreira, guardei a fé.»</em> O legado de Mulungo permanece vivo em cada congregação e no coração de milhares de moçambicanos.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 7 — O NASCIMENTO  (MAO and present)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-[var(--color-cream)] min-h-screen flex items-center">
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden lg:block">
                        <img src="/images/historia/image31.jpeg"
                            alt="Pastor Luis Manuel de Sousa Jerónimo"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to right, #f8f6f2 0%, rgba(248,246,242,0.1) 40%, transparent 100%)' }} />
                    </div>

                    <div className="relative z-10 w-full px-6 py-32">
                        <div className="max-w-7xl mx-auto">
                            <div className="lg:max-w-[52%]">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">07</span>
                                    <div className="hs-reveal h-px flex-1 max-w-[120px] bg-[var(--color-border)]" />
                                    <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1995–Hoje</span>
                                </div>

                                <div className="overflow-hidden mb-4">
                                    <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>O Nascimento</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-7">
                                    Ministério Alfa e Ômega — MAO
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Nascido da visão do Pastor <strong>Luis Manuel de Sousa Jerónimo</strong>, que assumiu em 1995 a liderança pastoral, o Ministério Alfa e Ômega é um dos pilares da IEADM. Luis Jerónimo conduziu a Igreja num período de reconstrução nacional, alcançando todas as províncias e distritos de Moçambique.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Hoje, coexistem 12 Ministérios em comunhão Convencional, servindo mais de um milhão de crentes. A semente plantada pelos pioneiros em 1911 floresceu em 3000 lugares de culto, onde a educação teológica continua sob a direcção do <strong>Pr. Pedro Muianga</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 8 — PATRIMÓNIO  (Temple gallery)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-white py-28 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">08</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">Património Histórico</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            <div>
                                <h2 className="hs-reveal font-display font-semibold text-[var(--color-ink)] text-4xl mb-6">Identidade e Legado</h2>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                    O templo sede na Av. Eduardo Mondlane é um testemunho vivo de décadas de oração. Das fachadas históricas ao prédio de 14 andares, cada detalhe conta a história de uma comunidade que construiu a sua casa sobre a rocha, resistindo ao tempo e às marés da história.
                                </p>
                            </div>
                            <div className="hs-reveal grid grid-cols-2 gap-4">
                                <div className="rounded-xl overflow-hidden shadow-lg h-64 border border-[var(--color-border)]">
                                    <LightboxImage src="/images/historia/image43.jpeg" alt="Prédio de 14 andares" className="w-full h-full object-cover grayscale" onClick={lb('/images/historia/image43.jpeg', 'O Prédio de 14 andares pertença da Igreja nacionalizado pelo Governo em 1976')} />
                                </div>
                                <div className="rounded-xl overflow-hidden shadow-lg h-64 mt-8 border border-[var(--color-border)]">
                                    <LightboxImage src="/images/historia/image44.jpeg" alt="Porta Principal" className="w-full h-full object-cover grayscale" onClick={lb('/images/historia/image44.jpeg', 'Porta Principal do Templo na Av. Eduardo Mondlane')} />
                                </div>
                            </div>
                        </div>

                        <div className="hs-reveal grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {[45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].map((n) => (
                                <div key={n} className="aspect-square rounded-lg overflow-hidden border border-[var(--color-border)] group">
                                    <LightboxImage
                                        src={`/images/historia/image${n}.jpeg`}
                                        alt={`Detalhe Histórico ${n}`}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        onClick={lb(`/images/historia/image${n}.jpeg`, 'Detalhe histórico do património e infraestrutura do Templo')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 9 — HOJE  (packed church + stats)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <img src="/images/historia/image60.jpeg"
                            alt="90º Aniversário da IEADM — Convenção de 2015"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover object-center" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(16,20,61,0.97) 0%, rgba(16,20,61,0.65) 50%, rgba(16,20,61,0.35) 100%)' }} />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-32">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/25 tracking-widest">09</span>
                                <div className="hs-reveal h-px flex-1 bg-white/10" />
                                <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">Hoje</span>
                            </div>
                            <div className="overflow-hidden mb-3">
                                <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                    style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)' }}>A Missão Continua</h2>
                            </div>
                            <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-10">
                                Trinta anos de fé — de Maputo a Niassa
                            </p>

                            <p className="hs-reveal text-white/50 text-lg leading-relaxed mb-16 max-w-2xl">
                                Com mais de 3000 lugares de culto em todas as províncias e nos 152 distritos de Moçambique, a IEADM conta hoje com mais de um milhão de congregados. Doze ministérios coexistem em comunhão convencional. Cooperam missionários de Portugal, Canadá, Suécia, Brasil e Estados Unidos da América.
                            </p>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 border-t border-white/10 pt-12">
                                {[
                                    { label: 'Anos de ministério', target: 30, suffix: '' },
                                    { label: 'Lugares de culto', target: 3000, suffix: '+' },
                                    { label: 'Distritos alcançados', target: 152, suffix: '' },
                                    { label: 'Pastores ordenados', target: 1000, suffix: '+' },
                                ].map(({ label, target, suffix }) => (
                                    <div key={label} className="hs-reveal">
                                        <div className="font-display font-bold text-white leading-none"
                                            style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)' }}>
                                            <span className="hs-counter" data-target={target}>0</span>
                                            <span>{suffix}</span>
                                        </div>
                                        <p className="text-white/55 text-sm mt-3 leading-tight">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Social work */}
                            <div className="hs-reveal mt-16 pt-12 border-t border-white/8">
                                <p className="text-white/30 text-[11px] tracking-[0.25em] uppercase mb-6">Obra social e educacional</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        ['36', 'crianças em regime de internato no Centro de Acolhimento'],
                                        ['4', 'Centros Educacionais — Catembe, Chokwé, Gorongosa, Pemba'],
                                        ['2000+', 'alunos nas escolas da Igreja (primária + secundária nocturna)'],
                                        ['12', 'ministérios em comunhão convencional'],
                                    ].map(([val, desc]) => (
                                        <div key={val} className="bg-white/5 border border-white/8 rounded-xl p-5">
                                            <p className="font-display font-bold text-white text-3xl mb-2">{val}</p>
                                            <p className="text-white/55 text-xs leading-snug">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Escola Bíblica directors + Convention HQ */}
                            <div className="hs-reveal mt-12 pt-10 border-t border-white/8 grid md:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-white/30 text-[11px] tracking-[0.25em] uppercase mb-4">Escola Bíblica — directores desde 1985</p>
                                    <div className="space-y-2">
                                        {[
                                            ['1985', 'Bill e Linda Mercer (Canadá)'],
                                            ['—', 'Donald Khron (Canadá)'],
                                            ['—', 'Mathias (Alemanha)'],
                                            ['—', 'Steven Chaloner (Canadá)'],
                                            ['Actual', 'Pr. Pedro Muianga (Mestrado)'],
                                        ].map(([year, name]) => (
                                            <div key={name} className="flex items-center gap-3">
                                                <span className="font-mono text-[10px] text-[var(--color-brand-light)]/60 w-10 shrink-0">{year}</span>
                                                <span className="text-white/45 text-sm">{name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/30 text-[11px] tracking-[0.25em] uppercase mb-4">Missão em construção</p>
                                    <p className="text-white/45 text-sm leading-relaxed">
                                        A nova Sede da Convenção Nacional está em construção a 50 km de Maputo — o coração administrativo e espiritual da IEADM para as décadas que vêm. A Igreja também exerce trabalho activo nas prisões e mantém quatro Escolas Ministeriais e cursos pastorais em Maputo, Gaza e Inhambane.
                                    </p>
                                    <p className="text-white/45 text-sm leading-relaxed mt-3">
                                        Cooperam missionários de Portugal, Canadá, Suécia, Brasil e Estados Unidos da América — na área do ensino, da construção de tabernáculos e da obra social.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    PHOTO GALLERY
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-[var(--color-ink)] py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <p className="hs-reveal text-white/25 text-[11px] tracking-[0.28em] uppercase mb-10">Galeria histórica</p>

                        {/* Desktop masonry: 3 independent columns */}
                        <div className="hidden md:grid md:grid-cols-3 gap-3">
                            {/* Col 1 */}
                            <div className="flex flex-col gap-3">
                                {([
                                    ['/images/historia/image1.jpeg',  'Dedicatória — registro histórico',      'h-56'],
                                    ['/images/historia/image4.jpeg',  'Família Chawner em 1927',               'h-36'],
                                    ['/images/historia/image10.jpeg', 'Nomeação da Presidência em 1947',       'h-48'],
                                    ['/images/historia/image13.jpeg', 'Baptismos na Praia da Polana, 1947',    'h-64'],
                                ] as const).map(([src, alt, h]) => (
                                    <div key={src} className="hs-reveal overflow-hidden rounded-xl border border-white/8 group">
                                        <LightboxImage src={src} alt={alt}
                                            className={`w-full ${h} object-cover grayscale group-hover:grayscale-0 transition-all duration-700`}
                                            onClick={lb(src, alt)} />
                                    </div>
                                ))}
                            </div>
                            {/* Col 2 */}
                            <div className="flex flex-col gap-3 mt-10">
                                {([
                                    ['/images/historia/image7.jpeg',  'Acta Número Um — 1946',                 'h-36'],
                                    ['/images/historia/image11.jpeg', 'Livro de Actas n.78 — 1956',            'h-64'],
                                    ['/images/historia/image19.jpeg', 'Passeio histórico em 1967',             'h-36'],
                                    ['/images/historia/image63.jpeg', 'Superintendentes Gerais da IEADM',      'h-56'],
                                ] as const).map(([src, alt, h]) => (
                                    <div key={src} className="hs-reveal overflow-hidden rounded-xl border border-white/8 group">
                                        <LightboxImage src={src} alt={alt}
                                            className={`w-full ${h} object-cover grayscale group-hover:grayscale-0 transition-all duration-700`}
                                            onClick={lb(src, alt)} />
                                    </div>
                                ))}
                            </div>
                            {/* Col 3 */}
                            <div className="flex flex-col gap-3">
                                {([
                                    ['/images/historia/image2.jpeg',  'Início do Protestantismo',              'h-40'],
                                    ['/images/historia/image12.jpeg', 'Primeira Escola Dominical',             'h-52'],
                                    ['/images/historia/image20.jpeg', 'Chegada do Pr. Machado em 1968',        'h-36'],
                                    ['/images/historia/image28.jpeg', 'Convite para o novo Templo — 1975',     'h-60'],
                                ] as const).map(([src, alt, h]) => (
                                    <div key={src} className="hs-reveal overflow-hidden rounded-xl border border-white/8 group">
                                        <LightboxImage src={src} alt={alt}
                                            className={`w-full ${h} object-cover grayscale group-hover:grayscale-0 transition-all duration-700`}
                                            onClick={lb(src, alt)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile: simple 2-col grid */}
                        <div className="md:hidden grid grid-cols-2 gap-3">
                            {([
                                ['/images/historia/image1.jpeg', 'Dedicatória — registro histórico'],
                                ['/images/historia/image4.jpeg', 'Família Chawner em 1927'],
                                ['/images/historia/image10.jpeg', 'Nomeação da Presidência em 1947'],
                                ['/images/historia/image13.jpeg', 'Baptismos na Praia da Polana, 1947'],
                                ['/images/historia/image7.jpeg', 'Acta Número Um — 1946'],
                                ['/images/historia/image11.jpeg', 'Livro de Actas n.78 — 1956'],
                                ['/images/historia/image19.jpeg', 'Passeio histórico em 1967'],
                                ['/images/historia/image63.jpeg', 'Superintendentes Gerais'],
                                ['/images/historia/image2.jpeg', 'Início do Protestantismo'],
                                ['/images/historia/image12.jpeg', 'Primeira Escola Dominical'],
                                ['/images/historia/image20.jpeg', 'Chegada do Pr. Machado em 1968'],
                                ['/images/historia/image28.jpeg', 'Convite para o novo Templo — 1975'],
                            ] as const).map(([src, alt]) => (
                                <div key={src} className="hs-reveal overflow-hidden rounded-xl border border-white/8 group">
                                    <LightboxImage src={src} alt={alt}
                                        className="w-full h-36 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        onClick={lb(src, alt)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    PHOTO STRIP
                ════════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-3 h-72 overflow-hidden">
                    {([
                        ['/images/historia/image39.jpeg', 'Vista parcial da congregação'],
                        ['/images/historia/image62.jpeg', 'Pastor António Inguane'],
                        ['/images/historia/image25.jpeg', 'Culto na Missão Suiça'],
                    ] as const).map(([src, alt], i) => (
                        <div key={i} className="relative overflow-hidden group cursor-zoom-in" onClick={lb(src, alt)}
                            role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') lb(src, alt)(); }}>
                            <img src={src} alt={alt}
                                className="hs-strip-img absolute w-full h-[140%] -top-[20%] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out" />
                            <div className="absolute inset-0 bg-[var(--color-brand-dark)]/40 group-hover:bg-[var(--color-brand-dark)]/20 transition-colors duration-700" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-white/80 text-xs tracking-wide truncate">{alt}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ════════════════════════════════════════════════════════════
                    OUTRO CTA
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-[var(--color-brand-dark)] text-white py-32 px-6 text-center relative overflow-hidden">
                    {/* Orange accent top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-brand)]" />
                    {/* Subtle orange glow */}
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full blur-3xl pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(255,103,0,0.25) 0%, transparent 65%)' }} />
                    <div className="relative z-10">
                        <p className="hs-reveal text-white/50 text-xs font-semibold uppercase tracking-[0.28em] mb-6">
                            E a história continua
                        </p>
                        <div className="overflow-hidden mb-6">
                            <h2 className="hs-title-line font-display font-semibold"
                                style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
                                Faz Parte Desta História
                            </h2>
                        </div>
                        <p className="hs-reveal text-white/55 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                            Encontra uma congregação perto de ti e junta-te à família MAO em todo Moçambique.
                        </p>
                        <div className="hs-reveal flex flex-wrap items-center justify-center gap-4">
                            <a href="/igrejas"
                                className="inline-block px-8 py-4 bg-[var(--color-brand)] text-white font-semibold rounded-lg transition-colors hover:bg-[var(--color-brand-light)]">
                                Encontrar uma Igreja
                            </a>
                            <Link href="/sobre"
                                className="inline-block px-8 py-4 border border-white/25 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                                Quem Somos
                            </Link>
                        </div>
                    </div>
                </section>

            </div>

            <style>{`
                @keyframes hsCue {
                    0%   { transform: translateY(-100%); }
                    100% { transform: translateY(300%); }
                }
            `}</style>
        </GlobalLayout>
    );
}
