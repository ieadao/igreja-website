import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

interface Stats {
    churches: number;
    provinces: number;
    missionaries: number;
    years: number;
}

function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const tick = (now: number) => {
                        const elapsed = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - elapsed, 3);
                        setCount(Math.round(eased * target));
                        if (elapsed < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.2 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

function KpiCounter({ value, label }: { value: number; label: string }) {
    const { count, ref } = useCountUp(value);
    return (
        <div className="text-center">
            <span
                ref={ref as React.RefObject<HTMLSpanElement>}
                className="block font-display text-4xl sm:text-5xl font-semibold text-white tabular-nums"
            >
                {count.toLocaleString('pt-MZ')}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-widest text-white/70 mt-1">
                {label}
            </span>
        </div>
    );
}

export default function HeroSection({ stats }: { stats: Stats }) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#10143D' }}>
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(16,20,61,0.7) 0%, rgba(16,20,61,0.3) 50%, rgba(16,20,61,0.85) 100%)' }} />

            {/* Orange accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#FF6700' }} />

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-32">
                {/* Logo */}
                <img
                    src="/images/logo.png"
                    alt="IEADAO"
                    className="w-24 h-24 object-contain mb-8 drop-shadow-xl brightness-0 invert opacity-90"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-6">
                    Ministério Alfa e Ômega — Moçambique
                </p>
                <h1 className="font-display text-5xl sm:text-7xl font-semibold leading-tight text-white mb-6">
                    Firmes na Fé.<br />
                    Unidos em Cristo.
                </h1>
                <blockquote className="text-white/60 text-base sm:text-lg italic font-display mb-10 max-w-xl">
                    "Eu sou o Alfa e o Ômega, o primeiro e o último, o princípio e o fim."
                    <cite className="block not-italic text-xs font-sans tracking-widest uppercase text-white/60 mt-2">
                        Apocalipse 22:13
                    </cite>
                </blockquote>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/igrejas"
                        className="px-8 py-4 text-brand-dark font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#FF6700' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FF8C3A')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6700')}
                    >
                        Encontrar uma Igreja
                    </Link>
                    <Link
                        href="/sobre"
                        className="px-8 py-4 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Saber Mais
                    </Link>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* KPI strip */}
            <div className="relative z-10 w-full border-t border-white/10 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
                <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    <KpiCounter value={stats.churches} label="Igrejas" />
                    <KpiCounter value={stats.provinces} label="Províncias" />
                    <KpiCounter value={stats.missionaries} label="Missionários" />
                    <KpiCounter value={stats.years} label="Anos de Ministério" />
                </div>
            </div>
        </section>
    );
}
