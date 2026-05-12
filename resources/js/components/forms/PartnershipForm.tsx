import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormData {
    org_name:     string;
    contact_name: string;
    email:        string;
    phone:        string;
    type:         string;
    proposal:     string;
}

interface Props {
    onSuccess?: () => void;
}

const TYPES = [
    { value: 'educational', label: 'Educação' },
    { value: 'health',      label: 'Saúde' },
    { value: 'charity',     label: 'Acção Social' },
    { value: 'other',       label: 'Outro' },
];

export default function PartnershipForm({ onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<FormData>({
        org_name:     '',
        contact_name: '',
        email:        '',
        phone:        '',
        type:         'educational',
        proposal:     '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/parcerias', {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    }

    if (wasSuccessful && !onSuccess) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-medium">Proposta enviada com sucesso!</p>
                <p className="text-green-700 text-sm mt-1">Entraremos em contacto brevemente.</p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-ink mb-1">
                    Nome da Organização <span className="text-brand-text">*</span>
                </label>
                <Input
                    value={data.org_name}
                    onChange={e => setData('org_name', e.target.value)}
                    placeholder="Nome da sua organização ou empresa"
                    className={cn(errors.org_name && 'border-red-400')}
                />
                {errors.org_name && <p className="text-red-500 text-xs mt-1">{errors.org_name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-ink mb-1">
                    Pessoa de Contacto <span className="text-brand-text">*</span>
                </label>
                <Input
                    value={data.contact_name}
                    onChange={e => setData('contact_name', e.target.value)}
                    placeholder="Nome completo"
                    className={cn(errors.contact_name && 'border-red-400')}
                />
                {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                        Email <span className="text-brand-text">*</span>
                    </label>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="email@org.com"
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
                    Área de Parceria <span className="text-brand-text">*</span>
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
                    Proposta <span className="text-brand-text">*</span>
                </label>
                <textarea
                    value={data.proposal}
                    onChange={e => setData('proposal', e.target.value)}
                    rows={5}
                    placeholder="Descreva a sua proposta de parceria..."
                    className={cn(
                        'w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        errors.proposal && 'border-red-400',
                    )}
                />
                {errors.proposal && <p className="text-red-500 text-xs mt-1">{errors.proposal}</p>}
            </div>

            <Button
                type="submit"
                disabled={processing}
                className="w-full bg-brand hover:bg-brand-dark text-white"
            >
                {processing ? 'A enviar...' : 'Enviar Proposta'}
            </Button>
        </form>
    );
}
