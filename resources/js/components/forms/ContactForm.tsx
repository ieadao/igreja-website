import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormData {
    name: string;
    email: string;
    phone: string;
    type: string;
    message: string;
}

interface Props {
    type?: string;
    onSuccess?: () => void;
}

const TYPES = [
    { value: 'general',     label: 'Assunto Geral' },
    { value: 'prayer',      label: 'Pedido de Oração' },
    { value: 'volunteer',   label: 'Voluntariado' },
    { value: 'partnership', label: 'Parceria' },
    { value: 'other',       label: 'Outro' },
];

export default function ContactForm({ type: initialType = 'general', onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<FormData>({
        name:    '',
        email:   '',
        phone:   '',
        type:    initialType,
        message: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/contacto', {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    }

    if (wasSuccessful && !onSuccess) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-medium">Mensagem enviada com sucesso!</p>
                <p className="text-green-700 text-sm mt-1">Entraremos em contacto em breve.</p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-ink mb-1">
                    Nome <span className="text-brand">*</span>
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
                    Assunto <span className="text-brand">*</span>
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
                    Mensagem <span className="text-brand">*</span>
                </label>
                <textarea
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    rows={5}
                    placeholder="Escreva a sua mensagem..."
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
                className="w-full bg-brand hover:bg-brand-dark text-white"
            >
                {processing ? 'A enviar...' : 'Enviar Mensagem'}
            </Button>
        </form>
    );
}
