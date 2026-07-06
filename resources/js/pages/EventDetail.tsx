import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, MapPin, Wifi, Clock, ChevronLeft, Users, ExternalLink } from 'lucide-react';
import GlobalLayout from '@/layouts/GlobalLayout';
import EventRegistrationForm from '@/components/forms/EventRegistrationForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDateTime, formatDate } from '@/lib/utils';
import type { Event, SharedProps } from '@/types';

const TYPE_LABELS: Record<string, string> = {
    service:    'Culto',
    conference: 'Conferência',
    retreat:    'Retiro',
    seminar:    'Seminário',
    other:      'Evento',
};

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
    published:  { label: 'Confirmado',  class: 'bg-green-100 text-green-800' },
    cancelled:  { label: 'Cancelado',   class: 'bg-red-100 text-red-800' },
    completed:  { label: 'Realizado',   class: 'bg-gray-100 text-gray-700' },
};

function getYouTubeEmbedUrl(url: string): string | null {
    const patterns = [
        /youtu\.be\/([^?&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtube\.com\/embed\/([^?]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`;
    }
    return null;
}

interface Props {
    event: Event;
    isRegistered: boolean;
}

export default function EventDetail({ event, isRegistered }: Props) {
    const [registrationOpen, setRegistrationOpen] = useState(false);
    const { flash } = usePage<SharedProps>().props;

    const statusInfo = STATUS_LABELS[event.status];
    const isPast     = new Date(event.starts_at) < new Date();
    const isCancelled = event.status === 'cancelled';
    const embedUrl   = event.is_online && event.stream_url ? getYouTubeEmbedUrl(event.stream_url) : null;

    return (
        <GlobalLayout>
            <Head title={`${event.title} — Agenda`} />

            <div className="bg-cream">
                {/* Back link */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <Link
                        href="/agenda"
                        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-text transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> Voltar à agenda
                    </Link>
                </div>

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Flash success */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
                            {flash.success}
                        </div>
                    )}

                    {/* Hero card */}
                    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
                        <div className="bg-brand-dark px-6 py-8 text-white">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge className="bg-white/20 text-white border-transparent text-sm">
                                    {TYPE_LABELS[event.type] ?? 'Evento'}
                                </Badge>
                                {statusInfo && (
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                                        {statusInfo.label}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display text-3xl lg:text-4xl font-bold leading-tight">
                                {event.title}
                            </h1>
                        </div>

                        <div className="px-6 py-6 grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-brand-text mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-0.5">Data e hora</p>
                                    <p className="text-ink font-medium">{formatDateTime(event.starts_at)}</p>
                                    {event.ends_at && (
                                        <p className="text-ink-muted text-sm">até {formatDateTime(event.ends_at)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                {event.is_online ? (
                                    <Wifi className="w-5 h-5 text-brand-text mt-0.5 shrink-0" />
                                ) : (
                                    <MapPin className="w-5 h-5 text-brand-text mt-0.5 shrink-0" />
                                )}
                                <div>
                                    <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-0.5">
                                        {event.is_online ? 'Formato' : 'Local'}
                                    </p>
                                    {event.is_online ? (
                                        <p className="text-ink font-medium">Online / Transmissão ao vivo</p>
                                    ) : event.church ? (
                                        <>
                                            <p className="text-ink font-medium">{event.church.name}</p>
                                            {event.church.address && (
                                                <p className="text-ink-muted text-sm mt-0.5">{event.church.address}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-ink font-medium">{event.location ?? 'A definir'}</p>
                                    )}
                                </div>
                            </div>

                            {event.max_capacity && (
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-brand-text mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-0.5">Capacidade</p>
                                        <p className="text-ink font-medium">{event.max_capacity} lugares</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Live stream embed */}
                    {embedUrl && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-black aspect-video">
                            <iframe
                                src={embedUrl}
                                title={event.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-8">
                            <h2 className="font-display text-xl font-bold text-ink mb-4">Sobre o evento</h2>
                            <p className="text-ink-muted leading-relaxed whitespace-pre-line">{event.description}</p>
                        </div>
                    )}

                    {/* Live stream link (fallback or secondary) */}
                    {event.is_online && event.stream_url && !embedUrl && (
                        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-8">
                            <h2 className="font-display text-xl font-bold text-ink mb-4">Transmissão ao vivo</h2>
                            <a
                                href={event.stream_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-brand-text hover:underline font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Assistir transmissão
                            </a>
                        </div>
                    )}

                    {/* Registration CTA */}
                    {!isCancelled && !isPast && event.registration_required && !isRegistered && (
                        event.registrations_open ? (
                            <div className="bg-brand-pale rounded-2xl border border-brand/20 p-6 text-center">
                                <h2 className="font-display text-xl font-bold text-ink mb-2">Inscrição necessária</h2>
                                <p className="text-ink-muted text-sm mb-4">
                                    {event.is_paid
                                        ? 'Este evento é pago e requer inscrição prévia com comprovativo de pagamento.'
                                        : 'Este evento requer inscrição prévia. Garanta já o seu lugar.'}
                                </p>
                                <Button
                                    onClick={() => setRegistrationOpen(true)}
                                    className="bg-brand hover:bg-brand-dark text-brand-dark hover:text-white px-8"
                                >
                                    Inscrever-me
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-border rounded-2xl p-6 text-center">
                                <h2 className="font-display text-xl font-bold text-ink mb-1">Inscrições encerradas</h2>
                                <p className="text-ink-muted text-sm">
                                    As inscrições para este evento já não estão disponíveis.
                                </p>
                            </div>
                        )
                    )}

                    {isRegistered && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                            <p className="text-green-800 font-semibold">Está inscrito neste evento!</p>
                            <p className="text-green-700 text-sm mt-1">Aguardamos pela sua presença.</p>
                        </div>
                    )}
                </article>
            </div>

            {/* Registration modal */}
            <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl">Inscrição — {event.title}</DialogTitle>
                    </DialogHeader>
                    <EventRegistrationForm
                        eventSlug={event.slug}
                        isPaid={event.is_paid}
                        onSuccess={() => setRegistrationOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </GlobalLayout>
    );
}
