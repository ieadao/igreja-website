import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CheckCircle2, Paperclip } from 'lucide-react';

interface FormData {
    name: string;
    phone: string;
    payment_proof: File | null;
}

interface Props {
    eventSlug: string;
    isPaid: boolean;
    onSuccess?: () => void;
}

export default function EventRegistrationForm({ eventSlug, isPaid, onSuccess }: Props) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm<FormData>({
        name:  '',
        phone: '',
        payment_proof: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/agenda/${eventSlug}/registar`, {
            forceFormData: true,
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
                    Nome completo <span className="text-brand-text">*</span>
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

            {isPaid && (
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                        Comprovativo de pagamento <span className="text-brand-text">*</span>
                    </label>
                    <label
                        className={cn(
                            'flex items-center gap-2 h-9 rounded-md border border-input bg-background px-3 text-sm cursor-pointer hover:border-brand transition-colors',
                            errors.payment_proof && 'border-red-400',
                        )}
                    >
                        <Paperclip className="w-4 h-4 text-ink-muted shrink-0" />
                        <span className={cn('truncate', data.payment_proof ? 'text-ink' : 'text-ink-muted')}>
                            {data.payment_proof ? data.payment_proof.name : 'Anexar PDF ou imagem'}
                        </span>
                        <input
                            type="file"
                            accept=".pdf,image/jpeg,image/png,image/webp"
                            onChange={e => setData('payment_proof', e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                    </label>
                    <p className="text-ink-muted text-xs mt-1">PDF ou imagem (JPG, PNG), máx. 5 MB.</p>
                    {errors.payment_proof && <p className="text-red-500 text-xs mt-1">{errors.payment_proof}</p>}
                </div>
            )}

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
