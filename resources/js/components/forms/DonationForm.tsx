import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormData {
    name:           string;
    amount:         string;
    type:           string;
    payment_method: string;
    reference:      string;
}

interface Props {
    onSuccess?: () => void;
}

const TYPES = [
    { value: 'tithe',    label: 'Dízimo' },
    { value: 'offering', label: 'Oferta' },
    { value: 'missions', label: 'Missões' },
    { value: 'social',   label: 'Projectos Sociais' },
];

const METHODS = [
    { value: 'mpesa', label: '📱 M-Pesa', number: '84 000 0000' },
    { value: 'bank',  label: '🏦 Banco',  number: 'NIB: 0000 0000 0000 000' },
    { value: 'emola', label: '📲 e-Mola', number: '86 000 0000' },
];

const PRESET_AMOUNTS = ['500', '1000', '2000', '5000'];

export default function DonationForm({ onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<FormData>({
        name:           '',
        amount:         '',
        type:           'tithe',
        payment_method: 'mpesa',
        reference:      '',
    });

    const selectedMethod = METHODS.find(m => m.value === data.payment_method);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/apoios', {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    }

    if (wasSuccessful && !onSuccess) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-medium">Registo efectuado com sucesso!</p>
                <p className="text-green-700 text-sm mt-1">Aguardamos a confirmação do pagamento.</p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-ink mb-1">
                    Nome <span className="text-brand-text">*</span>
                </label>
                <Input
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="O seu nome completo"
                    className={cn(errors.name && 'border-red-400')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-ink mb-2">
                    Tipo <span className="text-brand-text">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {TYPES.map(t => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setData('type', t.value)}
                            className={cn(
                                'py-2 px-3 rounded-lg text-sm font-medium border transition-colors text-left',
                                data.type === t.value
                                    ? 'bg-brand text-white border-brand'
                                    : 'bg-white text-ink border-brand/20 hover:border-brand/50',
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-ink mb-2">
                    Valor (MZN) <span className="text-brand-text">*</span>
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                    {PRESET_AMOUNTS.map(amt => (
                        <button
                            key={amt}
                            type="button"
                            onClick={() => setData('amount', amt)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                                data.amount === amt
                                    ? 'bg-brand text-white border-brand'
                                    : 'bg-white text-ink border-brand/20 hover:border-brand/50',
                            )}
                        >
                            {parseInt(amt).toLocaleString()} MT
                        </button>
                    ))}
                </div>
                <Input
                    type="number"
                    min="1"
                    value={data.amount}
                    onChange={e => setData('amount', e.target.value)}
                    placeholder="Ou insira outro valor"
                    className={cn(errors.amount && 'border-red-400')}
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-ink mb-2">
                    Método de Pagamento <span className="text-brand-text">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {METHODS.map(m => (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => setData('payment_method', m.value)}
                            className={cn(
                                'py-2 px-3 rounded-lg text-xs font-medium border transition-colors text-center',
                                data.payment_method === m.value
                                    ? 'bg-brand text-white border-brand'
                                    : 'bg-white text-ink border-brand/20 hover:border-brand/50',
                            )}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
                {errors.payment_method && <p className="text-red-500 text-xs mt-1">{errors.payment_method}</p>}

                {selectedMethod && (
                    <p className="text-xs text-ink-muted mt-2 p-3 bg-brand-pale rounded-lg">
                        Envie para: <strong>{selectedMethod.number}</strong> — inclua o seu nome como referência.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-ink mb-1">Referência / Comprovativo</label>
                <Input
                    value={data.reference}
                    onChange={e => setData('reference', e.target.value)}
                    placeholder="Número de transacção (opcional)"
                    className={cn(errors.reference && 'border-red-400')}
                />
                {errors.reference && <p className="text-red-500 text-xs mt-1">{errors.reference}</p>}
            </div>

            <Button
                type="submit"
                disabled={processing}
                className="w-full bg-brand hover:bg-brand-dark text-white"
            >
                {processing ? 'A registar...' : 'Registar Doativo'}
            </Button>
        </form>
    );
}
