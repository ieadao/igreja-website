import { Head } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { storageUrl } from '@/lib/utils';
import { Building2, Users, MapPin, Globe } from 'lucide-react';
import type { Province } from '@/types';

interface Props {
    province: Province;
}

export default function ProvinceAbout({ province }: Props) {
    return (
        <ProvinceLayout province={province}>
            <Head title={`Sobre — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-brand-text text-xs font-semibold uppercase tracking-widest mb-3">Ministério Alfa e Ômega</p>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
                            Nossa Presença em {province.name}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2 className="font-display text-3xl font-semibold text-ink mb-6">Nossa História e Missão</h2>
                        <div className="prose prose-lg prose-p:text-ink-muted prose-headings:text-ink max-w-none">
                            {province.description ? (
                                <p className="whitespace-pre-line">{province.description}</p>
                            ) : (
                                <>
                                    <p>
                                        O Ministério Alfa e Ômega tem uma presença vibrante na província de {province.name}, 
                                        dedicando-se a pregar o evangelho e transformar vidas através de nossas igrejas e projectos sociais.
                                    </p>
                                    <p>
                                        Nesta província, trabalhamos activamente para alcançar todas as comunidades, 
                                        estabelecendo congregações onde a Palavra de Deus é ensinada com fidelidade 
                                        e onde o amor de Cristo é manifestado através do serviço ao próximo.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-10">
                            <div className="bg-cream rounded-xl p-5 border border-border">
                                <p className="text-brand-text text-2xl font-bold">100%</p>
                                <p className="text-ink-muted text-sm font-medium">Comprometimento</p>
                            </div>
                            <div className="bg-cream rounded-xl p-5 border border-border">
                                <p className="text-brand-text text-2xl font-bold">PT-MZ</p>
                                <p className="text-ink-muted text-sm font-medium">Presença Local</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {province.hero_image && (
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-brand-pale shadow-lg">
                                <img 
                                    src={storageUrl(province.hero_image)} 
                                    alt={province.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="bg-ink text-white rounded-2xl p-8">
                            <h3 className="font-display text-2xl font-semibold mb-6">Nossos Pilares</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Users className="text-brand-text" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Comunidade</p>
                                        <p className="text-white/60 text-xs mt-0.5">Fomentar relacionamentos baseados no amor cristão.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Building2 className="text-brand-text" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Igrejas Fortes</p>
                                        <p className="text-white/60 text-xs mt-0.5">Capacitar lideranças locais para o crescimento espiritual.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Globe className="text-brand-text" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Impacto Social</p>
                                        <p className="text-white/60 text-xs mt-0.5">Projectos que transformam a realidade social da província.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ProvinceLayout>
    );
}
