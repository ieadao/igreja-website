import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ContactForm from '@/components/forms/ContactForm';
import type { SharedProps } from '@/types';

export default function Contact() {
    const { flash } = usePage<SharedProps>().props;

    return (
        <GlobalLayout>
            <Head title="Contacto" />

            {/* Page header */}
            <section className="bg-[var(--color-brand-dark)] text-white py-20 px-6 text-center">
                <p className="text-[var(--color-brand-light)] text-sm font-semibold uppercase tracking-widest mb-4">
                    Estamos Aqui
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                    Contacto
                </h1>
            </section>

            <section className="bg-[var(--color-brand-pale)] py-16 px-6 min-h-[60vh]">
                <div className="max-w-5xl mx-auto">

                    {flash?.success && (
                        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                            <p className="text-green-800 font-medium">{flash.success}</p>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                            <p className="text-red-800 font-medium">{flash.error}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-5 gap-12 items-start">
                        {/* Form */}
                        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-[var(--color-brand)]/10 p-8">
                            <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)] mb-6">
                                Enviar Mensagem
                            </h2>
                            <ContactForm />
                        </div>

                        {/* Contact info */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl p-6 border border-[var(--color-brand)]/10">
                                <h3 className="font-semibold text-[var(--color-ink)] mb-3">Sede Nacional</h3>
                                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                                    Av. 24 de Julho, nº 1234<br />
                                    Maputo, Moçambique
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-[var(--color-brand)]/10">
                                <h3 className="font-semibold text-[var(--color-ink)] mb-3">Horário de Atendimento</h3>
                                <p className="text-[var(--color-ink-muted)] text-sm">
                                    Segunda a Sexta<br />
                                    08:00 – 17:00
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-[var(--color-brand)]/10 space-y-3">
                                <h3 className="font-semibold text-[var(--color-ink)] mb-1">Contactos</h3>
                                <p className="text-sm">
                                    <span className="text-[var(--color-ink-muted)]">Email: </span>
                                    <a
                                        href="mailto:geral@alfaomega.org.mz"
                                        className="text-[var(--color-brand-text)] hover:underline"
                                    >
                                        geral@alfaomega.org.mz
                                    </a>
                                </p>
                                <p className="text-sm">
                                    <span className="text-[var(--color-ink-muted)]">WhatsApp: </span>
                                    <a
                                        href="https://wa.me/258840000000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--color-brand-text)] hover:underline"
                                    >
                                        +258 84 000 0000
                                    </a>
                                </p>
                            </div>

                            <div className="bg-[var(--color-brand-dark)] rounded-xl p-6 text-white">
                                <p className="text-sm font-semibold mb-1">Resposta Rápida</p>
                                <p className="text-white/70 text-xs leading-relaxed mb-3">
                                    Para uma resposta mais rápida, contacte-nos diretamente via WhatsApp.
                                </p>
                                <a
                                    href="https://wa.me/258840000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <span>💬</span>
                                    Abrir WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GlobalLayout>
    );
}
