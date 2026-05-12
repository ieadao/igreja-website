import { Link } from '@inertiajs/react';
import { Heart, Handshake, HandHelping } from 'lucide-react';

const PILLARS = [
    {
        icon: Heart,
        title: 'Apoio Financeiro',
        description:
            'Contribua para o avanço do Evangelho em Moçambique. O seu donativo apoia igrejas locais, missionários e projectos sociais.',
        cta: 'Dar agora',
        href: '/dar',
    },
    {
        icon: Handshake,
        title: 'Parceria Ministerial',
        description:
            'Organizações e igrejas podem propor parcerias estratégicas para multiplicar o impacto do Reino de Deus.',
        cta: 'Propor Parceria',
        href: '/contacto',
    },
    {
        icon: HandHelping,
        title: 'Voluntariado',
        description:
            'Junte-se às nossas equipas de voluntários em projectos sociais, missões nacionais e eventos de evangelização.',
        cta: 'Quero servir',
        href: '/contacto',
    },
] as const;

export default function SupportCTASection() {
    return (
        <section className="py-20 bg-brand-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-light mb-3">
                        Faça a Diferença
                    </p>
                    <h2 className="font-display text-4xl font-semibold text-white mb-4">
                        Participe no Avanço do Reino
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Existem várias formas de contribuir para a missão do Ministério Alfa e Ômega.
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {PILLARS.map(({ icon: Icon, title, description, cta, href }) => (
                        <div
                            key={title}
                            className="flex flex-col p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand/30 flex items-center justify-center mb-6">
                                <Icon className="w-6 h-6 text-brand-light" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-white mb-3">
                                {title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed flex-1">
                                {description}
                            </p>
                            <Link
                                href={href}
                                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-brand-dark text-sm font-medium rounded-lg hover:bg-brand-light transition-colors self-start"
                            >
                                {cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
