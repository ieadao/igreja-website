import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import { Clock, MapPin, User, Sparkles, Smile, UserCircle } from 'lucide-react';
import type { Province, GroupType, ChurchProgram } from '@/types';

interface ChurchProgramWithChurch extends ChurchProgram {
    church: { id: number; name: string; slug: string };
}

interface Props {
    province: Province;
    groupTypes: GroupType[];
    programsByType: Record<number, ChurchProgramWithChurch[]>;
}

const ICON_MAP: Record<string, any> = {
    'heroicon-o-user':        User,
    'heroicon-o-user-circle': UserCircle,
    'heroicon-o-sparkles':    Sparkles,
    'heroicon-o-face-smile':  Smile,
};

function IconRenderer({ icon, className }: { icon: string, className?: string }) {
    const IconComponent = ICON_MAP[icon] || Building2;
    return <IconComponent className={className} />;
}

const FREQUENCY_LABELS: Record<string, string> = {
    weekly: 'Semanal',
    biweekly: 'Quinzenal',
    monthly: 'Mensal',
    occasional: 'Ocasional',
};

const DAY_LABELS: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

function ProgramCard({ program }: { program: ChurchProgramWithChurch }) {
    return (
        <div className="bg-cream rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-medium text-ink text-sm">{program.name ?? program.church.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{program.church.name}</p>
                </div>
                <span className="shrink-0 text-xs bg-brand-pale text-brand-dark font-medium px-2 py-0.5 rounded-full">
                    {FREQUENCY_LABELS[program.frequency] ?? program.frequency}
                </span>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
                {program.day_of_week && (
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {DAY_LABELS[program.day_of_week] ?? program.day_of_week}
                        {program.start_time && ` · ${program.start_time.slice(0, 5)}`}
                        {program.end_time && `–${program.end_time.slice(0, 5)}`}
                    </span>
                )}
                {program.location && (
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {program.location}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Ministerios({ province, groupTypes, programsByType }: Props) {
    const activeTypes = groupTypes.filter(gt => (programsByType[gt.id]?.length ?? 0) > 0);
    const [activeTab, setActiveTab] = useState<number>(activeTypes[0]?.id ?? groupTypes[0]?.id ?? 0);

    const currentPrograms: ChurchProgramWithChurch[] = programsByType[activeTab] ?? [];

    return (
        <ProvinceLayout province={province}>
            <Head title={`Ministérios — ${province.name}`} />

            <div className="bg-cream border-b border-border py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-2">Ministérios</p>
                    <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">Grupos e Ministérios</h1>
                    <p className="text-ink-muted mt-2">{province.name}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {groupTypes.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-ink-muted">Nenhum tipo de grupo configurado.</p>
                    </div>
                ) : (
                    <>
                        {/* Group type cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                            {groupTypes.map(gt => {
                                const count = programsByType[gt.id]?.length ?? 0;
                                const isActive = activeTab === gt.id;
                                return (
                                    <button
                                        key={gt.id}
                                        onClick={() => setActiveTab(gt.id)}
                                        className={`rounded-xl p-5 text-center transition-all ${
                                            isActive
                                                ? 'bg-brand text-white shadow-md shadow-brand/20'
                                                : 'bg-white border border-border hover:border-brand/30 hover:bg-brand-pale/30'
                                        }`}
                                    >
                                        <div className="flex justify-center mb-2">
                                            <IconRenderer 
                                                icon={gt.icon} 
                                                className={`w-8 h-8 ${isActive ? 'text-white' : 'text-brand'}`} 
                                            />
                                        </div>
                                        <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-ink'}`}>
                                            {gt.name}
                                        </p>
                                        <p className={`text-xs mt-1 ${isActive ? 'text-white/70' : 'text-ink-muted'}`}>
                                            {count} programa{count !== 1 ? 's' : ''}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Programs for active type */}
                        {currentPrograms.length === 0 ? (
                            <div className="text-center py-16 bg-cream rounded-xl">
                                <p className="text-ink-muted">Nenhum programa activo neste ministério.</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentPrograms.map(p => <ProgramCard key={p.id} program={p} />)}
                            </div>
                        )}
                    </>
                )}
            </div>
        </ProvinceLayout>
    );
}
