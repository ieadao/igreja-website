import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
}

interface Props {
    eventSlug: string;
    onSuccess?: () => void;
}

export default function EventRegistrationForm({ eventSlug, onSuccess }: Props) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm<FormData>({
        name:  '',
        email: '',
        phone: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/agenda/${eventSlug}/registar`, {
            onSuccess: () => onSuccess?.(),
        });
    }

    if (wasSuccessful) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <p className="text-green-800 font-semibold">Inscrição confirmada!</p>
                <p className="text-green-700 text-sm">Aguardamos pela sua presença.</p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-ink mb-1">
                    Nome completo <span className="text-brand">*</span>
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

            <Button
                type="submit"
                disabled={processing}
                className="w-full bg-brand hover:bg-brand-dark text-white"
            >
                {processing ? 'A inscrever...' : 'Confirmar Inscrição'}
            </Button>
        </form>
    );
}
