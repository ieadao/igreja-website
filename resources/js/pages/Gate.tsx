import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
    title: string;
    message: string | null;
}

export default function Gate({ title, message }: Props) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/gate/unlock');
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-brand-dark px-6 py-10 text-white">
            <div className="absolute inset-0">
                <div className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
                <div className="absolute bottom-[-7rem] right-[-4rem] h-72 w-72 rounded-full bg-brand-light/15 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(145deg,rgba(16,20,61,0.96),rgba(10,13,42,1))]" />
                <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
                <div className="w-full">
                    <div className="mb-8 flex justify-center">
                    <img
                        src="/images/logo-white.png"
                        alt="Ministério Alfa e Ômega"
                        className="h-16 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-brand-pale text-ink shadow-[0_30px_80px_rgba(0,0,0,0.38)]">
                        <div className="border-b border-brand/10 bg-white/50 px-8 py-4 backdrop-blur">
                            <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-text">
                                <span className="h-2 w-2 rounded-full bg-brand" />
                                Acesso privado
                            </span>
                        </div>

                        <div className="p-8">
                            <div className="mb-6 text-center">
                                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark shadow-lg shadow-brand-dark/20">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-text/80">
                                    Portal reservado
                                </p>
                                <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink">
                                    {title}
                                </h1>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                                    {message ?? 'Introduza o seu código de acesso para continuar em segurança.'}
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="code" className="mb-2 block text-sm font-medium text-ink">
                                        Código de acesso
                                    </label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="XXXX-XXXX-XXXX-XXXX"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className="h-12 rounded-xl border-brand/20 bg-white/90 px-4 text-center font-mono text-base tracking-[0.28em] text-ink shadow-sm placeholder:tracking-[0.18em] placeholder:text-ink-muted/70 focus-visible:border-brand focus-visible:ring-brand/30"
                                        autoComplete="off"
                                        autoFocus
                                        maxLength={19}
                                    />
                                    <p className="mt-2 text-xs text-ink-muted">
                                        O código é validado instantaneamente para libertar o acesso.
                                    </p>
                                    {errors.code && (
                                        <p className="mt-2 text-sm font-medium text-red-600">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !data.code}
                                    className="h-12 w-full rounded-xl bg-brand text-base font-semibold text-white shadow-[0_16px_30px_rgba(255,103,0,0.28)] transition-all hover:bg-brand-light hover:shadow-[0_18px_34px_rgba(255,103,0,0.34)]"
                                >
                                    {processing ? 'A verificar…' : 'Entrar'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
