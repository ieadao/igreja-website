import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Province } from '@/types';

interface Props {
    province: Province;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    type: string;
    message: string;
    province_id: number | '';
}

const TYPES = [
    { value: 'general',     label: 'Assunto Geral' },
    { value: 'prayer',      label: 'Pedido de Oração' },
    { value: 'volunteer',   label: 'Voluntariado' },
    { value: 'partnership', label: 'Parceria' },
    { value: 'other',       label: 'Outro' },
];

export default function ProvinceContact({ province }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<FormData>({
        name:        '',
        email:       '',
        phone:       '',
        type:        'general',
        message:     '',
        province_id: province.id,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/contacto', { onSuccess: () => reset() });
    }

    return (
        <ProvinceLayout province={province}>
            <Head title={`Contacto — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-2">Contacto</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Fale Connosco</h1>
                    <p className="text-ink-muted mt-2">{province.name}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-ink mb-6">Envie uma Mensagem</h2>

                        {wasSuccessful ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                                <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
                                <p className="font-semibold text-green-800">Mensagem enviada com sucesso!</p>
                                <p className="text-green-700 text-sm mt-1">Entraremos em contacto em breve.</p>
                                <button onClick={() => reset()} className="mt-4 text-sm text-brand-text hover:underline">
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1">
                                        Nome <span className="text-brand-text">*</span>
                                    </label>
                                    <Input
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="O seu nome"
                                        className={cn(errors.name && 'border-red-400')}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-ink mb-1">Email</label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="email@exemplo.com"
                                            className={cn(errors.email && 'border-red-400')}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-ink mb-1">Telefone</label>
                                        <Input
                                            type="tel"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+258 84 000 0000"
                                            className={cn(errors.phone && 'border-red-400')}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1">
                                        Assunto <span className="text-brand-text">*</span>
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ink mb-1">
                                        Mensagem <span className="text-brand-text">*</span>
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        rows={5}
                                        placeholder="Escreva a sua mensagem…"
                                        className={cn(
                                            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                            errors.message && 'border-red-400',
                                        )}
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-brand hover:bg-brand-dark text-brand-dark hover:text-white"
                                >
                                    {processing ? 'A enviar…' : 'Enviar Mensagem'}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-ink mb-6">Informações</h2>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4 p-5 bg-cream rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-brand-pale flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-brand-text" />
                                </div>
                                <div>
                                    <p className="font-medium text-ink">Sede Provincial</p>
                                    <p className="text-sm text-ink-muted mt-1">{province.name}, Moçambique</p>
                                </div>
                            </div>

                            {province.description && (
                                <p className="text-ink-muted text-sm leading-relaxed">{province.description}</p>
                            )}

                            <div className="p-5 bg-brand-pale rounded-xl">
                                <p className="font-medium text-ink mb-2">Horário de Atendimento</p>
                                <div className="text-sm text-ink-muted space-y-1">
                                    <p>Segunda a Sexta: 08h00 – 17h00</p>
                                    <p>Sábado: 08h00 – 12h00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProvinceLayout>
    );
}
