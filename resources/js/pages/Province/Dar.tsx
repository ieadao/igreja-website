import { Head, Link } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { Smartphone, Building2, CreditCard, Heart } from 'lucide-react';
import type { Province } from '@/types';

interface Props {
    province: Province;
}

const METHODS = [
    {
        id: 'mpesa',
        icon: Smartphone,
        title: 'M-Pesa',
        description: 'Transfira via Vodacom M-Pesa para o número da província.',
        steps: [
            'Abra o menu M-Pesa no seu telemóvel Vodacom',
            'Seleccione "Enviar Dinheiro"',
            'Insira o número da igreja da sua província',
            'Confirme com o seu PIN e guarde o recibo',
        ],
        color: 'bg-red-50 border-red-100',
        iconColor: 'text-red-600',
    },
    {
        id: 'banco',
        icon: Building2,
        title: 'Transferência Bancária',
        description: 'Depósito ou transferência para a conta bancária da província.',
        steps: [
            'Utilize o NIB/IBAN da conta da província',
            'Indique "Dízimo", "Oferta" ou "Missões" na referência',
            'Envie o comprovativo para o responsável da sua igreja',
        ],
        color: 'bg-blue-50 border-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        id: 'mpago',
        icon: CreditCard,
        title: 'Mpago (Emola)',
        description: 'Transfira via Emola/Mpago para o número da província.',
        steps: [
            'Abra a aplicação Emola ou Mpago',
            'Seleccione "Transferir"',
            'Insira o número da igreja da sua província',
            'Confirme e guarde o comprovativo',
        ],
        color: 'bg-green-50 border-green-100',
        iconColor: 'text-green-600',
    },
];

const GIVING_TYPES = [
    { label: 'Dízimo', description: '10% dos rendimentos — base bíblica do sustento da obra' },
    { label: 'Oferta', description: 'Contribuição livre de adoração e gratidão' },
    { label: 'Missões', description: 'Apoia directamente os missionários em campo' },
    { label: 'Intervenção Social', description: 'Financia projectos de impacto comunitário' },
];

export default function ProvinceDar({ province }: Props) {
    return (
        <ProvinceLayout province={province}>
            <Head title={`Dar — ${province.name}`} />

            {/* Hero */}
            <div className="bg-brand-dark text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Heart size={40} className="mx-auto mb-4 text-brand-light" />
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Parceria</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                        Contribuir para a Obra em {province.name}
                    </h1>
                    <p className="text-white/80 max-w-xl mx-auto">
                        Cada oferta sustenta pastores, envia missionários, e transforma comunidades.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Types of giving */}
                <div className="mb-16">
                    <h2 className="font-display text-2xl font-semibold text-ink mb-6">Formas de Dar</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {GIVING_TYPES.map(t => (
                            <div key={t.label} className="bg-cream rounded-xl p-5">
                                <p className="font-semibold text-ink mb-1">{t.label}</p>
                                <p className="text-ink-muted text-sm">{t.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment methods */}
                <h2 className="font-display text-2xl font-semibold text-ink mb-6">Métodos de Pagamento</h2>
                <div className="grid sm:grid-cols-3 gap-6 mb-16">
                    {METHODS.map(method => {
                        const Icon = method.icon;
                        return (
                            <div key={method.id} className={`rounded-xl border p-6 ${method.color}`}>
                                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm`}>
                                    <Icon size={24} className={method.iconColor} />
                                </div>
                                <h3 className="font-semibold text-ink text-lg mb-2">{method.title}</h3>
                                <p className="text-ink-muted text-sm mb-4">{method.description}</p>
                                <ol className="space-y-2">
                                    {method.steps.map((step, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-ink">
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold text-brand-text shadow-sm">
                                                {i + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                                <div className="mt-5 p-3 bg-white/70 rounded-lg text-center">
                                    <p className="text-xs text-ink-muted">Contacte a sua igreja local</p>
                                    <p className="text-sm font-semibold text-ink mt-0.5">para obter o número/conta</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <div className="bg-cream rounded-xl p-8 text-center">
                    <p className="font-display text-xl font-semibold text-ink mb-2">Tem dúvidas?</p>
                    <p className="text-ink-muted mb-4">
                        O responsável financeiro da sua igreja está disponível para ajudar.
                    </p>
                    <Link
                        href={`/provincia/${province.slug}/contacto`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-brand-dark rounded-lg font-medium hover:bg-brand-dark hover:text-white transition-colors text-sm"
                    >
                        Contactar a Província
                    </Link>
                </div>
            </div>
        </ProvinceLayout>
    );
}
