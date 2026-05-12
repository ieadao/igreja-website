import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
    name: string;
    email: string;
    phone: string;
    type: string;
    message: string;
}

export default function Prayer() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<FormData>({
        name:    '',
        email:   '',
        phone:   '',
        type:    'prayer',
        message: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/contacto', { onSuccess: () => reset() });
    }

    return (
        <GlobalLayout>
            <Head title="Pedidos de Oração — MAO" />

            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Oração</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Pedidos de Oração</h1>
                    <p className="text-white/65 mt-3 max-w-2xl text-lg">
                        Partilhe o seu pedido connosco. Comprometemo-nos a orar por si.
                    </p>
                </div>
            </section>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-brand-pale flex items-center justify-center">
                        <Heart size={18} className="text-brand-text" />
                    </div>
                    <div>
                        <p className="font-semibold text-ink">Equipa de Intercessão</p>
                        <p className="text-sm text-ink-muted">Os seus pedidos são tratados com confidencialidade e oração.</p>
                    </div>
                </div>

                {wasSuccessful ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                        <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
                        <p className="font-semibold text-green-800">Pedido recebido com sucesso!</p>
                        <p className="text-green-700 text-sm mt-1">A nossa equipa de intercessão irá orar pelo seu pedido.</p>
                        <button
                            onClick={() => reset()}
                            className="mt-4 text-sm text-brand-text hover:underline"
                        >
                            Enviar outro pedido
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
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

                        <div>
                            <label className="block text-sm font-medium text-ink mb-1">
                                O seu pedido <span className="text-brand-text">*</span>
                            </label>
                            <textarea
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                rows={6}
                                placeholder="Descreva o seu pedido de oração…"
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
                            {processing ? 'A enviar…' : 'Enviar Pedido de Oração'}
                        </Button>

                        <p className="text-xs text-ink-muted text-center">
                            Os seus dados são tratados com confidencialidade e apenas partilhados com a equipa de intercessão.
                        </p>
                    </form>
                )}
            </div>
        </GlobalLayout>
    );
}
