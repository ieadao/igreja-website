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
                    CAP. 1 — O CHÃO  (old church building, parallax)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen overflow-hidden flex items-center">
                    <div className="absolute inset-0">
                        <img src="/images/historia/image15.jpeg"
                            alt="Primeira sede da Assembleia de Deus em Lourenço Marques"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover object-center grayscale" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(105deg, rgba(16,20,61,0.93) 45%, rgba(16,20,61,0.55) 100%)' }} />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-32 grid lg:grid-cols-5 gap-16 items-center">
                        <div className="lg:col-span-3">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/30 tracking-widest">01</span>
                                <div className="hs-reveal h-px flex-1 bg-white/15" />
                                <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">Séc. XIX</span>
                            </div>
                            <div className="overflow-hidden mb-3">
                                <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                    style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)' }}>O Chão</h2>
                            </div>
                            <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-7">
                                Moçambique — terra de encontros
                            </p>
                            <p className="hs-reveal text-white/65 text-lg leading-relaxed mb-4">
                                Na ponta sudeste de África, entre o Índico e o Zambeze, Moçambique reúne mais de quarenta línguas e três mundos distintos: norte muçulmano, centro católico, sul pentecostal. Trinta e dois milhões de pessoas, quarenta e uma línguas de raiz Bantu.
                            </p>
                            <p className="hs-reveal text-white/45 text-base leading-relaxed mb-3">
                                Em 1823 há já uma pequena missão Metodista da África do Sul a operar em Lourenço Marques. Em 1842, um pastor da Igreja Reformada Holandesa chega de Amesterdão — mas o governo colonial recusa a sua instalação. Em 1875, o bispo anglicano Steere visita o território. Em 1879, a Junta Americana pede autorização para trabalhar em Gaza: negada. Em 1883, os Metodistas Episcopais chegam a Cabine; em 1885, a Missão Metodista Livre estabelece-se em Inharrime.
                            </p>
                            <p className="hs-reveal text-white/35 text-base leading-relaxed">
                                Só após a Conferência de Berlim (1884–85), que consagrou a liberdade de missionação protestante em África, as autoridades portuguesas abriram parcialmente as portas. Mas a resistência da Igreja Católica colonial nunca cessaria por completo.
                            </p>
                        </div>

                        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center gap-10 pl-8 border-l border-white/10">
                            <p className="hs-reveal text-white/20 text-[10px] tracking-[0.35em] uppercase">Moçambique em números</p>
                            {[
                                ['43', 'línguas nacionais'],
                                ['32M', 'habitantes'],
                                ['1823', 'ano da 1ª missão protestante'],
                            ].map(([val, label]) => (
                                <div key={label} className="hs-reveal">
                                    <div className="font-display font-bold text-white leading-[0.85]"
                                        style={{ fontSize: 'clamp(3rem,5.5vw,4.5rem)' }}>
                                        {val}
                                    </div>
                                    <div className="w-8 h-0.5 my-3" style={{ backgroundColor: 'rgba(255,103,0,0.55)' }} />
                                    <p className="text-white/35 text-sm">{label}</p>
                                </div>
                            ))}
                            <p className="hs-reveal text-white/15 text-[10px] tracking-wide leading-relaxed">
                                Sede da Assembleia de Deus<br/>Lourenço Marques (hoje Maputo)
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 2 — OS PIONEIROS  (sticky image + scrolling panels)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative bg-[var(--color-cream)] overflow-hidden">
                    {/* Ghost chapter number */}
                    <div className="absolute -top-8 -right-8 leading-none font-display font-bold select-none pointer-events-none"
                        style={{ fontSize: 'clamp(14rem,28vw,22rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(16,20,61,0.05)' }}>
                        02
                    </div>
                    <div className="max-w-7xl mx-auto px-6 py-28">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">02</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1911–1946</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                            {/* Sticky image column */}
                            <div className="lg:sticky lg:top-24 space-y-5">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl">
                                    <img src="/images/historia/image4.jpeg"
                                        alt="Primeiros missionários das Assembleias de Deus em Moçambique"
                                        className="w-full object-cover grayscale" />
                                </div>
                                <p className="text-[var(--color-ink-faint)] text-xs text-center tracking-wide italic">
                                    Primeiros missionários das Assembleias de Deus em Moçambique
                                </p>
                            </div>

                            {/* Scrollable text panels */}
                            <div className="space-y-20">
                                <div>
                                    <div className="overflow-hidden mb-3">
                                        <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                            style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>Os Pioneiros</h2>
                                    </div>
                                    <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-6">
                                        As primeiras sementes do Evangelho
                                    </p>
                                    <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                        A génese do trabalho Pentecostal em Moçambique não começa com missionários estrangeiros, mas com os próprios moçambicanos. Muitos trabalhavam nas minas da África do Sul, onde encontravam o Evangelho Pentecostal. <strong className="text-[var(--color-ink)]">Paulo Khosa</strong>, um jovem Tonga, foi provavelmente o primeiro a trazer a mensagem Pentecostal a Moçambique — em 1911, antes de qualquer estrutura formal de missão.
                                    </p>
                                    <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                        Nesse mesmo ano, as Assembleias de Deus chegam a Moçambique. São os missionários portugueses —
                                        <strong className="text-[var(--color-ink)]"> José Augusto Pina</strong> e
                                        <strong className="text-[var(--color-ink)]"> Joaquim do Cerro</strong> — que trazem a chama pentecostal ao território lusófono.
                                    </p>
                                </div>

                                {/* Austin Chawner */}
                                <div className="hs-reveal border-l-4 border-[var(--color-brand)]/30 pl-7">
                                    <p className="text-[var(--color-brand)] font-bold text-xs tracking-widest uppercase mb-3">O Missionário Fundador</p>
                                    <h3 className="font-display font-semibold text-[var(--color-ink)] text-2xl mb-4">Austin Chawner</h3>
                                    <p className="text-[var(--color-ink-muted)] text-base leading-relaxed mb-4">
                                        Filho de pioneiros canadianos — Charles e Emma Chawner, que chegaram à África do Sul a 12 de Fevereiro de 1908 — Austin nasceu em 1903 no Canadá e cresceu em missão. Ordenado em London, Ontário, regressou a África já como missionário das Assembleias do Canadá. Tornou-se autor, compositor, editor e linguista, dedicando décadas ao povo de Moçambique.
                                    </p>
                                    <p className="text-[var(--color-ink-muted)] text-base leading-relaxed mb-4">
                                        A 3 de Agosto de 1947, Austin Chawner foi nomeado Presidente da Assembleia de Deus de Lourenço Marques — cargo que exerceu até Abril de 1954. Em 1938, o trabalho foi legalmente reconhecido pelo governo português sob a responsabilidade da Assembleia de Deus de Lisboa. A Concordata de 1940 com a Santa Sé voltou a erguer barreiras: vistos negados, exigências absurdas, pedidos que desapareciam nos gabinetes coloniais.
                                    </p>
                                    <p className="text-[var(--color-ink-muted)] text-base leading-relaxed">
                                        Em 1950, proibido oficialmente de trabalhar no país, Austin continuou a entrar ilegalmente — mantendo a obra viva através de cartas e reuniões clandestinas com os obreiros. Ao seu lado trabalharam missionários noruegueses como <strong>Ella Nilsen</strong> e o casal <strong>Olaf e Jenny Sorensen</strong>. Faleceu a 5 de Novembro de 1964, em Durban, atropelado ao sair do seu veículo. A Revista <em>Novas de Alegria</em> escreveu: <em>«Que Deus levante um substituto que possa continuar com a Obra gigantesca que este pioneiro iniciou.»</em>
                                    </p>
                                </div>

                                {/* Austin Chawner photo */}
                                <div className="hs-reveal overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-xl">
                                    <LightboxImage
                                        src="/images/historia/image14.jpeg"
                                        alt="Missionários Austin e Ingrid Chawner, 1934"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image14.jpeg', 'Missionários Austin e Ingrid Chawner, 1934')}
                                    />
                                    <div className="bg-white px-6 py-4 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-ink-faint)] text-xs tracking-wide italic">
                                            Missionários Austin e Ingrid Chawner — 1934
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                        Em 1942, nasce a revista <em>Novas de Alegria</em> — primeiro registo regular da obra em Moçambique. Um ano depois, uma carta de Janeiro de 1943, vinda da Estação de Missão do Maxaquene em Lourenço Marques, confirma: <em className="text-[var(--color-ink)]">a semente germinou</em>.
                                    </p>
                                </div>

                                {/* Historical document: Acta Número Um */}
                                <div className="hs-reveal overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-xl">
                                    <div className="relative">
                                        <LightboxImage
                                            src="/images/historia/image7.jpeg"
                                            alt="Acta Número Um — 7 de Abril de 1946"
                                            className="w-full object-cover max-h-80 object-top"
                                            onClick={lb('/images/historia/image7.jpeg', 'Acta Número Um — 7 de Abril de 1946')}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                                            style={{ background: 'linear-gradient(to top, white, transparent)' }} />
                                    </div>
                                    <div className="bg-white px-7 py-6 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-brand-text)] font-bold text-xs tracking-widest uppercase mb-2">
                                            Acta Número Um
                                        </p>
                                        <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed italic">
                                            «Aos sete dias do mês de Abril, do ano da Graça de Nosso Senhor Jesus Cristo, de mil novecentos quarenta e seis, realizou-se a primeira Santa Ceia e culto, no salão provisório, na Av. Gomes Freire cento e cinquenta e nove…»
                                        </p>
                                        <p className="text-[var(--color-ink-faint)] text-xs mt-3 font-mono">
                                            Lourenço Marques, 7 de Abril de 1946 · <span className="text-[var(--color-brand-text)]">clique na imagem para ampliar</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 3 — A PRIMEIRA FAMÍLIA  (beach photo full-bleed)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
                    <div className="absolute inset-0">
                        <img src="/images/historia/image13.jpeg"
                            alt="Primeira congregação — 21 de Fevereiro de 1947"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover object-center grayscale" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(16,20,61,0.96) 0%, rgba(16,20,61,0.5) 55%, rgba(16,20,61,0.2) 100%)' }} />
                    </div>

                    <div className="relative z-10 flex items-end px-6 pb-20" style={{ minHeight: '85vh' }}>
                        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-end">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="hs-reveal font-mono text-[11px] font-bold text-white/30 tracking-widest">03</span>
                                    <div className="hs-reveal h-px flex-1 bg-white/15" />
                                    <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">1946–1958</span>
                                </div>
                                <div className="overflow-hidden mb-3">
                                    <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>A Primeira Família</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-5">
                                    21 de Fevereiro de 1947
                                </p>
                                <p className="hs-reveal text-white/65 text-lg leading-relaxed max-w-prose mb-5">
                                    A Igreja nasceu a 7 de Abril de 1946 com oito membros baptizados e trinta assistentes, no salão provisório da Av. Gomes Freire, 159. O irmão <strong>Faria Lopes</strong> era o obreiro mais destacado na liderança daquela pequena Igreja. A irmã <strong>Mariana Barão Medeiros</strong> foi das primeiras a abrir a sua casa, em 1947, para que o Evangelho pudesse soar sem paredes institucionais.
                                </p>
                                <p className="hs-reveal text-white/45 text-base leading-relaxed max-w-prose">
                                    No primeiro domingo de 1947, sete irmãos são baptizados. A 21 de Dezembro, mais seis descem às águas do Índico. Na Escola Dominical — a primeira feita em terras moçambicanas — os irmãos Pina e Cerro ensinam ao lado de Austin Chawner. Em Abril de 1948, Maria Ana da Costa Pires torna-se mais uma das pioneiras baptizadas nesta família que crescia.
                                </p>
                            </div>

                            {/* Group congregation inset */}
                            <div className="hidden lg:block">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                                    <LightboxImage
                                        src="/images/historia/image12.jpeg"
                                        alt="Congregação da Assembleia de Deus, anos 1950"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image12.jpeg', 'Congregação da Assembleia de Deus, anos 1950')}
                                    />
                                </div>
                                <p className="text-white/25 text-xs text-center mt-3 tracking-wide italic">
                                    Congregação da Assembleia de Deus, anos 1950
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 3.5 — ÀS MARGENS DO ÍNDICO  (baptisms & growth)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-white overflow-hidden py-28 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">03 ½</span>
                            <div className="hs-reveal h-px flex-1 bg-[var(--color-border)]" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1947–1968</span>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-start">
                            <div className="lg:col-span-3">
                                <div className="overflow-hidden mb-3">
                                    <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>Às Margens do Índico</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-7">
                                    Baptismos, crescimento e novos templos
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    As décadas seguintes são marcadas por um crescimento silencioso mas consistente. Na Praia da Polana, os baptismos tornam-se um ritual sagrado — os crentes africanos e europeus descendo juntos às mesmas águas: 1947, 1950, 1955, 1958, 1963, 1966, 1968. Cada cerimónia, um testemunho público da fé que não distinguia raças.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Em Janeiro de 1950, a missionária norueguesa <strong>Jenny Fremmersvik</strong> junta-se a José Augusto Pina na cidade da Beira. Em Inhambane, o missionário <strong>Per Knutsson</strong> reporta um avivamento extraordinário: conversões de 20 a 30 por culto, trabalho activo em cem aldeias, convenção de distrito com 200 delegados e 2000 pessoas no domingo. A obra pentecostal alastrava pelo país.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Na Páscoa de 1953, um novo templo é inaugurado em Lourenço Marques e abre-se uma missão em Salisbury, na Rodésia. A 30 de Dezembro de 1956, José Augusto Pina é nomeado Presidente da Assembleia de Deus. Em 1957, a Igreja instala-se no antigo consulado da Grécia — uma casa colonial com jardim e escadaria de pedra, que se torna o novo templo.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                    Em 1967, o crescimento é tão expressivo que um passeio da congregação necessita de sete autocarros. A 25 de Dezembro de 1968, trinta e oito irmãos descem às águas em Lourenço Marques. A Igreja já não cabe nos espaços de antes.
                                </p>
                            </div>

                            <div className="lg:col-span-2 space-y-5">
                                {/* Baptism photo */}
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-xl border border-[var(--color-border)]">
                                    <LightboxImage
                                        src="/images/historia/image22.jpeg"
                                        alt="Baptismos na Praia da Polana — Lourenço Marques, 1958"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image22.jpeg', 'Baptismos na Praia da Polana — Lourenço Marques, 1958')}
                                    />
                                    <div className="bg-[var(--color-cream)] px-5 py-4 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-ink-faint)] text-xs italic">Baptismos na Praia da Polana, 1958</p>
                                    </div>
                                </div>

                                {/* Greek consulate building photo */}
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-xl border border-[var(--color-border)]">
                                    <LightboxImage
                                        src="/images/historia/image9.jpeg"
                                        alt="Assembleia de Deus no antigo consulado da Grécia, Lourenço Marques, 1957"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image9.jpeg', 'Assembleia de Deus no antigo consulado da Grécia, Lourenço Marques, 1957')}
                                    />
                                    <div className="bg-[var(--color-cream)] px-5 py-4 border-t border-[var(--color-border)]">
                                        <p className="text-[var(--color-ink-faint)] text-xs italic">Igreja no antigo consulado da Grécia, 1957</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    HORIZONTAL TIMELINE — Marcos do crescimento
                ════════════════════════════════════════════════════════════ */}
                {/*
                    Wrapper carries the total scroll distance (height set by JS).
                    Its bg-ink background fills the space so no blank area shows.
                    The inner section uses CSS sticky — no GSAP pin spacer needed.
                */}
                <div className="hs-timeline-wrapper bg-[var(--color-ink)]">
                <section className="hs-timeline-section lg:sticky top-0 overflow-hidden bg-[var(--color-ink)]"
                    style={{ height: '100svh' }}>
                    {/* Subtle vertical grid texture */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.018) 79px,rgba(255,255,255,0.018) 80px)' }} />
                    {/* Orange radial glow */}
                    <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 0% 100%, rgba(255,103,0,0.12) 0%, transparent 60%)' }} />

                    <div className="h-full flex flex-col relative z-10">
                        {/* Header */}
                        <div className="shrink-0 border-b border-white/8"
                            style={{ padding: '3.5rem max(1.5rem, calc((100vw - 80rem)/2 + 1.5rem)) 1.75rem' }}>
                            <p className="text-[var(--color-brand-light)] text-[11px] tracking-[0.28em] uppercase mb-4">
                                1946 — 1968
                            </p>
                            <div className="flex items-end justify-between">
                                <h3 className="font-display font-semibold text-white"
                                    style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                                    Marcos do crescimento
                                </h3>
                                <span className="hidden lg:block text-white/20 text-[10px] tracking-[0.3em] uppercase select-none pb-1">
                                    scroll →
                                </span>
                            </div>
                        </div>

                        {/* Mobile: native swipe. Desktop: GSAP clips via overflow-hidden */}
                        <div className="flex-1 flex items-center overflow-x-auto lg:overflow-hidden">
                            <div className="hs-timeline-track relative flex items-start will-change-transform"
                                style={{
                                    paddingLeft:   'max(1.5rem, calc((100vw - 80rem)/2 + 1.5rem))',
                                    paddingRight:  '10rem',
                                    paddingTop:    '3rem',
                                    paddingBottom: '3rem',
                                }}>

                                {/* Continuous line behind all dots */}
                                <div className="absolute left-0 right-0 h-px pointer-events-none"
                                    style={{ top: 'calc(3rem + 7px)', backgroundColor: 'rgba(255,255,255,0.1)' }} />

                                {[
                                    ['1946', 'Acta Nº 1 — 8 membros, 30 assistentes'],
                                    ['1947', '1ª Escola Dominical em Moçambique'],
                                    ['1949', 'Expansão à Beira (Pina + Fremmersvik)'],
                                    ['1951', 'Avivamento em Inhambane (Knutsson)'],
                                    ['1953', 'Novo templo em LM + missão na Rodésia'],
                                    ['1956', 'Pina nomeado Presidente da AD'],
                                    ['1957', 'Novo templo (antigo consulado da Grécia)'],
                                    ['1967', '7 autocarros para a congregação'],
                                    ['1968', '38 baptizados no Natal'],
                                ].map(([year, event], i) => (
                                    <div key={year} className="shrink-0 w-[320px]">
                                        {/* Dot */}
                                        <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-brand)] relative z-10 mb-9"
                                            style={{ boxShadow: '0 0 0 5px rgba(255,103,0,0.15)' }} />
                                        {/* Count */}
                                        <p className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase mb-2">
                                            {String(i + 1).padStart(2, '0')}&nbsp;/&nbsp;09
                                        </p>
                                        {/* Year */}
                                        <p className="font-display font-bold text-white leading-none mb-5"
                                            style={{ fontSize: 'clamp(3rem,5vw,4.5rem)' }}>
                                            {year}
                                        </p>
                                        {/* Orange rule */}
                                        <div className="w-8 h-px mb-4"
                                            style={{ backgroundColor: 'rgba(255,103,0,0.55)' }} />
                                        {/* Event */}
                                        <p className="text-white/45 text-sm leading-relaxed"
                                            style={{ maxWidth: '240px' }}>
                                            {event}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                </div>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 4 — O AVIVAMENTO  (most dramatic section)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <img src="/images/historia/image23.jpeg"
                            alt="Concentração evangelística — Lourenço Marques 1969"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover object-center grayscale contrast-110" />
                        <div className="absolute inset-0 bg-[var(--color-ink)]/80" />
                        <div className="absolute inset-0"
                            style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(255,103,0,0.4) 0%, transparent 65%)' }} />
                    </div>

                    <div className="relative z-10 min-h-screen flex items-center px-6 py-32">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="flex items-center gap-4 mb-14">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/25 tracking-widest">04</span>
                                <div className="hs-reveal h-px flex-1 bg-white/10" />
                                <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">1969</span>
                            </div>

                            {/* Full-width counter — cinematic moment */}
                            <div className="hs-reveal text-center border-y border-white/8 py-10 mb-16">
                                <div className="font-display font-bold leading-none text-white"
                                    style={{ fontSize: 'clamp(7rem,20vw,16rem)' }}>
                                    <span className="hs-counter" data-target="10000">0</span>+
                                </div>
                                <p className="text-white/30 text-xs tracking-[0.28em] uppercase mt-4">
                                    pessoas numa única noite · Estádio Coberto do Sporting
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-16">
                                <div>
                                    <div className="overflow-hidden mb-3">
                                        <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                            style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)' }}>O Avivamento</h2>
                                    </div>
                                    <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-7">
                                        Lourenço Marques · 1969
                                    </p>
                                    <p className="hs-reveal text-white/65 text-lg leading-relaxed mb-5">
                                        A onda começou em 1968: o pastor <strong>Alfredo Machado</strong> da Assembleia de Deus de Lisboa vem a Moçambique para cultos especiais — um novo templo com capacidade para 300 pessoas é inaugurado na Beira. No Natal, 38 irmãos descem às águas. A maré subia.
                                    </p>
                                    <p className="hs-reveal text-white/60 text-lg leading-relaxed mb-5">
                                        Em João Belo (Xai-Xai), o evangelista brasileiro <strong>Dr. Luís Schiliró</strong> prega perante 400 a 500 pessoas no salão ferroviário — muitas curas, muitas conversões, autoridades governamentais presentes. Em Março de 1969, nove crentes são baptizados na Praia de Sepúlveda.
                                    </p>
                                    <p className="hs-reveal text-white/50 text-lg leading-relaxed mb-5">
                                        Em Julho, em Lourenço Marques, o Estádio Coberto do Sporting fica completamente esgotado — centenas ficam de fora sem conseguir entrar. Cegos vêem, surdos ouvem, paralíticos andam. O jornal <em>Notícias</em> dedica a manchete ao fenómeno.
                                    </p>
                                    <p className="hs-reveal text-white/40 text-base leading-relaxed">
                                        Na Páscoa de 1970, vinte e sete crentes são baptizados na Baía do Espírito Santo em Lourenço Marques. O avivamento continuava a fazer história.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Newspaper clipping */}
                                    <div className="hs-clip-reveal overflow-hidden rounded-xl shadow-2xl border border-white/10 rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <LightboxImage
                                            src="/images/historia/image21.jpeg"
                                            alt="Jornal Notícias, 15 de Julho de 1969"
                                            className="w-full object-cover"
                                            onClick={lb('/images/historia/image21.jpeg', 'Jornal Notícias, 15 de Julho de 1969 — «Dizem-se curadas dezenas de pessoas que assistiram à última pregação no Estádio Coberto do Sporting»')}
                                        />
                                    </div>
                                    <p className="text-white/25 text-xs text-center tracking-wide">
                                        Jornal Notícias · 15 de Julho de 1969 · <span className="text-[var(--color-brand-light)]/60">clique para ampliar</span>
                                    </p>
                                </div>
                            </div>

                            {/* Pull quote */}
                            <div className="hs-reveal border-l-2 border-[var(--color-brand-light)]/60 pl-8 max-w-3xl">
                                <p className="font-display text-[clamp(1.4rem,3vw,2rem)] text-white/75 italic leading-relaxed">
                                    «Dizem-se curadas dezenas de pessoas que assistiram à última pregação no Estádio Coberto do Sporting. Mais de 10 mil pessoas no recinto e centenas delas sem poder entrar.»
                                </p>
                                <p className="text-white/30 text-xs mt-4 font-mono tracking-widest">
                                    Jornal Notícias · 15 de Julho de 1969
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 5 — A PERSEVERANÇA  (dark, Dino Amade era)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-[var(--color-ink)] relative overflow-hidden py-32 px-6">
                    {/* Subtle document texture */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                        <img src="/images/historia/image8.jpeg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
                    </div>
                    <div className="absolute top-0 right-0 bottom-0 w-px bg-white/5" />

                    <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/20 tracking-widest">05</span>
                                <div className="hs-reveal h-px flex-1 bg-white/10" />
                                <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">1975–1994</span>
                            </div>
                            <div className="overflow-hidden mb-3">
                                <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                    style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>A Perseverança</h2>
                            </div>
                            <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-7">
                                Pr. Dino Amade · 1975–1995
                            </p>
                            <p className="hs-reveal text-white/60 text-lg leading-relaxed mb-5">
                                A 30 de Maio de 1975, o templo da Av. Eduardo Mondlane é inaugurado — dias antes da Independência. Logo depois, com a entrada de Samora Machel, começa a perseguição: o Pastor <strong className="text-white">Dino Amade</strong> — convertido do islamismo, primeiro Superintendente Geral formal da Convenção Nacional — assume a responsabilidade pastoral e lidera com coragem inabalável. Os pastores portugueses partem: Pina, José Carlos, Joaquim Leitão e Manuel Joaquim Fernandes vão para a África do Sul e Portugal.
                            </p>
                            <p className="hs-reveal text-white/50 text-lg leading-relaxed mb-5">
                                No tempo da ditadura marxista, vários pastores são presos e colocados em campos de reeducação. Numerosos locais de culto são encerrados. O prédio de catorze andares pertencente à Igreja é nacionalizado em 1976. Em Quelimane, a evangelista <strong className="text-white/70">Júlia Ghandi</strong> realiza um trabalho estupendo, ganhando muitas almas para Cristo. A fé não se rende.
                            </p>
                            <p className="hs-reveal text-white/45 text-lg leading-relaxed mb-5">
                                Em 1981 inicia-se a guerra civil. Cinco milhões de refugiados — entre eles muitos membros da Igreja — espalham-se pelo país. O território fica intransitável. Mas em cada campo de refugiados, a Igreja planta sementes. Em 1985, nasce a Escola Bíblica — com o apoio dos missionários canadianos <strong className="text-white/70">Bill e Linda Mercer</strong>.
                            </p>
                            <p className="hs-reveal text-white/40 text-lg leading-relaxed mb-8">
                                Em 1992, o acordo de paz é assinado. A partir dessa data, a Igreja começa novamente a desenvolver-se e a crescer. A Convenção Nacional teve como Superintendentes Gerais: Dino Amade, Henrique Mugabe, António Inguane, Fernando Bata e Tiago Manhiça. A chama jamais se apagou.
                            </p>

                            {/* Dino Amade memorial */}
                            <div className="hs-reveal border border-white/10 rounded-xl p-6 bg-white/3">
                                <p className="text-[var(--color-brand-light)] text-xs font-bold tracking-widest uppercase mb-2">In memoriam</p>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    Pastor Dino Amade faleceu em 20 de Julho de 2015. De forma ética, bíblica e exemplar, fez a passagem do ministério pastoral ao seu sucessor, ao qual deu todo o apoio como um verdadeiro pai na fé. Foi honrado e será sempre lembrado como um herói da fé — glorificou o nome do Senhor durante o seu ministério exercido em tempos muito difíceis.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="hidden lg:block">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl">
                                    <LightboxImage
                                        src="/images/historia/image38.jpeg"
                                        alt="Igreja reunida em assembleia"
                                        className="w-full object-cover"
                                        onClick={lb('/images/historia/image38.jpeg', 'Igreja reunida em assembleia')}
                                    />
                                </div>
                            </div>
                            <div className="hs-reveal hidden lg:block overflow-hidden rounded-xl border border-white/8 shadow-xl">
                                <LightboxImage
                                    src="/images/historia/image63.jpeg"
                                    alt="Missionários Bill e Linda Mercer — fundadores da Escola Bíblica, 1985"
                                    className="w-full object-cover max-h-56 object-top"
                                    onClick={lb('/images/historia/image63.jpeg', 'Missionários Bill e Linda Mercer — fundadores da Escola Bíblica, 1985')}
                                />
                                <div className="px-5 py-4 bg-white/4 border-t border-white/8">
                                    <p className="text-white/40 text-xs tracking-wide italic">
                                        Missionários canadianos, fundadores da Escola Bíblica (1985) · <span className="text-[var(--color-brand-light)]/50">clique para ampliar</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 5.5 — LAURENTINO MULUNGO  (memorial, dark)
                ════════════════════════════════════════════════════════════ */}
                <section className="bg-[var(--color-ink)] border-t border-white/8 overflow-hidden py-28 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="hs-reveal font-mono text-[11px] font-bold text-white/20 tracking-widest">05 ½</span>
                            <div className="hs-reveal h-px flex-1 bg-white/8" />
                            <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-light)] tracking-widest">1920–1975+</span>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-start">
                            {/* Photos column */}
                            <div className="lg:col-span-2 space-y-5">
                                <div className="hs-clip-reveal overflow-hidden rounded-2xl shadow-2xl">
                                    <LightboxImage
                                        src="/images/historia/image40.jpeg"
                                        alt="Pastor Laurentino Mulungo"
                                        className="w-full object-cover grayscale"
                                        onClick={lb('/images/historia/image40.jpeg', 'Pastor Laurentino Mulungo — pioneiro moçambicano')}
                                    />
                                </div>
                                <p className="text-white/25 text-xs text-center tracking-wide italic">
                                    Pr. Laurentino Tongonhane Mulungo (1920–?)
                                </p>

                                {/* The famous mango tree */}
                                <div className="hs-reveal overflow-hidden rounded-xl border border-white/8 shadow-xl">
                                    <LightboxImage
                                        src="/images/historia/image41.jpeg"
                                        alt="A famosa mangueira de Tlavane — que muitas pregações ouviu e muitas almas viu serem salvas"
                                        className="w-full object-cover grayscale max-h-52 object-center"
                                        onClick={lb('/images/historia/image41.jpeg', 'A «famosa» mangueira de Tlavane — que muitas pregações ouviu e muitas almas viu serem salvas')}
                                    />
                                    <div className="px-5 py-4 bg-white/3 border-t border-white/8">
                                        <p className="text-white/35 text-xs italic">A «famosa» mangueira de Tlavane · clique para ampliar</p>
                                    </div>
                                </div>
                            </div>

                            {/* Text column */}
                            <div className="lg:col-span-3">
                                <p className="hs-reveal text-[var(--color-brand-light)] font-bold text-xs tracking-widest uppercase mb-4">
                                    Em memória de um herói
                                </p>
                                <div className="overflow-hidden mb-3">
                                    <h2 className="hs-title-line font-display font-semibold text-white leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>Laurentino Mulungo</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-light)] font-medium text-lg mb-7">
                                    Manhiça-Calanga · 30 de Abril de 1920
                                </p>

                                <p className="hs-reveal text-white/60 text-lg leading-relaxed mb-5">
                                    Laurentino Tongonhane Mulungo nasceu na localidade de Chipugue-Mahila, na Manhiça-Calanga. Convertido, tornou-se um dos maiores pilares da Igreja Pentecostal em Moçambique. Pastoreou a congregação de Tlavane (Aeroporto) — onde a sua pregação debaixo da <em className="text-white/80">«famosa mangueira»</em> ganhava almas semana após semana.
                                </p>
                                <p className="hs-reveal text-white/50 text-lg leading-relaxed mb-5">
                                    Com a independência em 1975, foi preso e enviado para os campos de reeducação do regime marxista. Mas o cárcere não o silenciou — dentro do próprio campo, continuou a baptizar crentes. A prisão tornou-se missão.
                                </p>
                                <p className="hs-reveal text-white/45 text-lg leading-relaxed mb-8">
                                    Ordenado ao ministério evangélico em 1956, o seu legado estende-se por décadas de serviço em tempos de guerra, perseguição e calamidade. A obra de Deus, dizia ele, nunca tem fim — só o terá no dia grandioso da Vinda de Jesus Cristo.
                                </p>

                                {/* Quote block */}
                                <div className="hs-reveal border-l-2 border-[var(--color-brand-light)]/40 pl-7 mb-10">
                                    <p className="font-display text-xl text-white/60 italic leading-relaxed">
                                        «A obra de e para Deus nunca tem fim, só o terá no dia grandioso da Vinda de Jesus Cristo nosso Salvador.»
                                    </p>
                                    <p className="text-white/25 text-xs mt-3 font-mono tracking-widest">Pr. Laurentino Mulungo</p>
                                </div>

                                {/* Photo row */}
                                <div className="hs-reveal grid grid-cols-3 gap-3">
                                    {[
                                        ['/images/historia/image42.jpeg', 'Culto com missionários em Moçambique'],
                                        ['/images/historia/image43.jpeg', 'Pr. Laurentino Mulungo com a congregação'],
                                        ['/images/historia/image44.jpeg', 'Outro culto em Tlavane'],
                                    ].map(([src, alt]) => (
                                        <div key={src} className="overflow-hidden rounded-xl border border-white/8 shadow-lg">
                                            <LightboxImage
                                                src={src}
                                                alt={alt}
                                                className="w-full h-28 object-cover grayscale"
                                                onClick={lb(src, alt)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 6 — O NASCIMENTO  (1995 — cream + split image)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-white min-h-screen flex items-center">
                    {/* Right half image */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden lg:block">
                        <img src="/images/historia/image39.jpeg"
                            alt="Igreja cheia"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to right, white 0%, rgba(255,255,255,0.1) 40%, transparent 100%)' }} />
                    </div>

                    <div className="relative z-10 w-full px-6 py-32">
                        <div className="max-w-7xl mx-auto">
                            <div className="lg:max-w-[52%]">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-ink-faint)] tracking-widest">06</span>
                                    <div className="hs-reveal h-px flex-1 max-w-[120px] bg-[var(--color-border)]" />
                                    <span className="hs-reveal font-mono text-[11px] font-bold text-[var(--color-brand-text)] tracking-widest">1995</span>
                                </div>

                                {/* Ghost year */}
                                <div className="hs-reveal mb-4 leading-none select-none font-display font-bold"
                                    style={{ fontSize: 'clamp(5rem,14vw,11rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(255,103,0,0.18)', letterSpacing: '-0.02em' }}>
                                    1995
                                </div>

                                <div className="overflow-hidden mb-4">
                                    <h2 className="hs-title-line font-display font-semibold text-[var(--color-ink)] leading-tight"
                                        style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>O Nascimento</h2>
                                </div>
                                <p className="hs-reveal text-[var(--color-brand-text)] font-medium text-lg mb-7">
                                    Ministério Alfa e Ômega — MAO
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Da visão do Pastor <strong className="text-[var(--color-ink)]">Luis Manuel de Sousa Jerónimo</strong>, que assume em 1995 a liderança pastoral da obra, nasce o Ministério Alfa e Ômega. Nascido no norte do país — Mueda, Cabo Delgado — convertido em 1966 de família católica, cresceu servindo ao Senhor desde a infância e a juventude. Concluiu o curso Ministerial da Escola Bíblica e o curso Sepoangol, além de formação autodidáctica em Teologia e formação secular em Construção Civil.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed mb-5">
                                    Ordenado ao pastorado em Novembro de 1988, recebeu a responsabilidade pastoral das mãos do Pastor Dino Amade como um filho na fé. Foi Vice-Presidente do Executivo da Convenção Nacional por mais de cinco anos, Director do Departamento de Doutrina, e Vice-Superintendente Nacional durante dez anos (2000–2010). É professor nos cursos Ministerial e Pastoral, e faz parte do Departamento de Mediação de Conflitos da Convenção.
                                </p>
                                <p className="hs-reveal text-[var(--color-ink-muted)] text-lg leading-relaxed">
                                    Da primeira congregação, um país inteiro espera. Cada aldeia, cada cidade, cada província — o mapa de Moçambique é o mapa da nossa missão.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════════════════
                    CAP. 7 — HOJE  (packed church + stats)
                ════════════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <img src="/images/historia/image60.jpeg"
                            alt="Igreja cheia — Convenção Nacional MAO"
                            className="hs-parallax-img absolute w-full h-[124%] -top-[12%] object-cover object-center" />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(16,20,61,0.97) 0%, rgba(16,20,61,0.65) 50%, rgba(16,20,61,0.35) 100%)' }} />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-32">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="hs-reveal font-mono text-[11px] font-bold text-white/25 tracking-widest">07</span>
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
                                        <p className="text-white/40 text-sm mt-3 leading-tight">{label}</p>
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
                                            <p className="text-white/35 text-xs leading-snug">{desc}</p>
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
                                    <p className="text-white/30 text-sm leading-relaxed mt-3">
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
                                    ['/images/historia/image1.jpeg',  'Congregação — arquivo histórico',        'h-56'],
                                    ['/images/historia/image5.jpeg',  'Primeiros anos da Igreja',               'h-36'],
                                    ['/images/historia/image11.jpeg', 'Culto histórico',                        'h-48'],
                                    ['/images/historia/image17.jpeg', 'Baptismos históricos',                   'h-64'],
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
                                    ['/images/historia/image2.jpeg',  'Missionários pioneiros',                 'h-36'],
                                    ['/images/historia/image6.jpeg',  'Assembleia histórica',                   'h-64'],
                                    ['/images/historia/image16.png',  'Imagem de arquivo — MAO',                'h-36'],
                                    ['/images/historia/image18.jpeg', 'Assembleia da Igreja',                   'h-56'],
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
                                    ['/images/historia/image3.jpeg',  'Culto em Moçambique',                   'h-40'],
                                    ['/images/historia/image10.jpeg', 'Congregação de Lourenço Marques',        'h-52'],
                                    ['/images/historia/image25.jpeg', 'Convenção Nacional',                    'h-36'],
                                    ['/images/historia/image26.jpeg', 'Liderança da Igreja',                   'h-60'],
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
                                ['/images/historia/image1.jpeg', 'Congregação — arquivo histórico'],
                                ['/images/historia/image2.jpeg', 'Missionários pioneiros'],
                                ['/images/historia/image3.jpeg', 'Culto em Moçambique'],
                                ['/images/historia/image5.jpeg', 'Primeiros anos da Igreja'],
                                ['/images/historia/image6.jpeg', 'Assembleia histórica'],
                                ['/images/historia/image10.jpeg', 'Congregação de Lourenço Marques'],
                                ['/images/historia/image11.jpeg', 'Culto histórico'],
                                ['/images/historia/image16.png', 'Imagem de arquivo — MAO'],
                                ['/images/historia/image17.jpeg', 'Baptismos históricos'],
                                ['/images/historia/image18.jpeg', 'Assembleia da Igreja'],
                                ['/images/historia/image25.jpeg', 'Convenção Nacional'],
                                ['/images/historia/image26.jpeg', 'Liderança da Igreja'],
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
                        ['/images/historia/image39.jpeg', 'Culto na sede central'],
                        ['/images/historia/image62.jpeg', 'Liderança na Convenção Nacional'],
                        ['/images/historia/image24.jpeg', 'Oração colectiva'],
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
