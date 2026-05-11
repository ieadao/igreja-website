import { useState } from 'react';
import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import DonationForm from '@/components/forms/DonationForm';
import PartnershipForm from '@/components/forms/PartnershipForm';
import ContactForm from '@/components/forms/ContactForm';

type Modal = 'donation' | 'partnership' | 'volunteer' | null;

const PAYMENT_METHODS = [
    {
        icon: '📱',
        title: 'M-Pesa',
        detail: '84 000 0000',
        note: 'Envie o valor e inclua o seu nome como referência.',
    },
    {
        icon: '🏦',
        title: 'Banco Millennium BIM',
        detail: 'NIB: 0000 0000 0000 000',
        note: 'Transferência bancária — indicar "Doativo MAO" na descrição.',
    },
    {
        icon: '📲',
        title: 'e-Mola',
        detail: '86 000 0000',
        note: 'Envie o valor com referência "MAO".',
    },
];

export default function Give() {
    const [modal, setModal] = useState<Modal>(null);

    return (
        <GlobalLayout>
            <Head title="Apoiar" />

            {/* Hero */}
            <section className="bg-[var(--color-brand)] text-white py-24 px-6 text-center">
                <p className="text-[var(--color-brand-light)] text-sm font-semibold uppercase tracking-widest mb-4">
                    Juntos Fazemos Mais
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Apoiar o Ministério
                </h1>
                <p className="text-white/80 max-w-xl mx-auto text-lg leading-relaxed italic mb-2">
                    «Cada um contribua segundo propôs no seu coração; não com tristeza, nem por necessidade;
                    porque Deus ama ao que dá com alegria.»
                </p>
                <p className="text-white/50 text-sm">2 Coríntios 9:7</p>
            </section>

            {/* 3-column CTAs */}
            <section className="py-20 px-6 bg-[var(--color-cream)]">
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                    <button
                        onClick={() => setModal('donation')}
                        className="group bg-white rounded-2xl shadow-sm border border-[var(--color-brand)]/10 p-8 text-left hover:border-[var(--color-brand)]/40 hover:shadow-md transition-all"
                    >
                        <div className="w-14 h-14 rounded-xl bg-[var(--color-brand-pale)] flex items-center justify-center mb-5 text-2xl group-hover:bg-[var(--color-brand)] transition-colors">
                            💰
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)] mb-3">
                            Apoiar Financeiramente
                        </h3>
                        <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                            Contribui para o crescimento do ministério através de dízimos, ofertas ou donativos
                            para missões e projectos sociais.
                        </p>
                        <span className="inline-block mt-5 text-[var(--color-brand)] font-semibold text-sm">
                            Dar agora →
                        </span>
                    </button>

                    <button
                        onClick={() => setModal('partnership')}
                        className="group bg-white rounded-2xl shadow-sm border border-[var(--color-brand)]/10 p-8 text-left hover:border-[var(--color-brand)]/40 hover:shadow-md transition-all"
                    >
                        <div className="w-14 h-14 rounded-xl bg-[var(--color-brand-pale)] flex items-center justify-center mb-5 text-2xl group-hover:bg-[var(--color-brand)] transition-colors">
                            🤝
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)] mb-3">
                            Propor Parceria
                        </h3>
                        <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                            A tua organização ou empresa pode tornar-se parceira no desenvolvimento de projectos
                            sociais e missionários.
                        </p>
                        <span className="inline-block mt-5 text-[var(--color-brand)] font-semibold text-sm">
                            Propor →
                        </span>
                    </button>

                    <button
                        onClick={() => setModal('volunteer')}
                        className="group bg-white rounded-2xl shadow-sm border border-[var(--color-brand)]/10 p-8 text-left hover:border-[var(--color-brand)]/40 hover:shadow-md transition-all"
                    >
                        <div className="w-14 h-14 rounded-xl bg-[var(--color-brand-pale)] flex items-center justify-center mb-5 text-2xl group-hover:bg-[var(--color-brand)] transition-colors">
                            🙋
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)] mb-3">
                            Voluntariar
                        </h3>
                        <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                            O teu tempo e talento são preciosos. Junta-te à equipa de voluntários e serve
                            a comunidade ao teu redor.
                        </p>
                        <span className="inline-block mt-5 text-[var(--color-brand)] font-semibold text-sm">
                            Inscrever →
                        </span>
                    </button>
                </div>
            </section>

            {/* Payment methods */}
            <section className="bg-[var(--color-brand-pale)] py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)] text-center mb-8">
                        Métodos de Pagamento
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {PAYMENT_METHODS.map(method => (
                            <div
                                key={method.title}
                                className="bg-white rounded-xl p-5 border border-[var(--color-brand)]/10"
                            >
                                <div className="text-2xl mb-3">{method.icon}</div>
                                <h3 className="font-semibold text-[var(--color-ink)] mb-1">{method.title}</h3>
                                <p className="text-sm font-mono text-[var(--color-brand)] mb-1">{method.detail}</p>
                                <p className="text-xs text-[var(--color-ink-muted)] leading-snug">{method.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scripture CTA */}
            <section className="bg-[var(--color-ink)] text-white py-16 px-6 text-center">
                <blockquote className="max-w-2xl mx-auto">
                    <p className="font-display text-2xl md:text-3xl italic leading-relaxed mb-3">
                        «O que semeia com parcimónia com parcimónia também ceifará;
                        e o que semeia com largueza com largueza também ceifará.»
                    </p>
                    <cite className="text-white/50 text-sm not-italic">2 Coríntios 9:6</cite>
                </blockquote>
            </section>

            {/* Modals */}
            <Dialog open={modal === 'donation'} onOpenChange={open => !open && setModal(null)}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Apoiar Financeiramente</DialogTitle>
                    </DialogHeader>
                    <DonationForm onSuccess={() => setModal(null)} />
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'partnership'} onOpenChange={open => !open && setModal(null)}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Propor Parceria</DialogTitle>
                    </DialogHeader>
                    <PartnershipForm onSuccess={() => setModal(null)} />
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'volunteer'} onOpenChange={open => !open && setModal(null)}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Voluntariar</DialogTitle>
                    </DialogHeader>
                    <ContactForm type="volunteer" onSuccess={() => setModal(null)} />
                </DialogContent>
            </Dialog>
        </GlobalLayout>
    );
}
