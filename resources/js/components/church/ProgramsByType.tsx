import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, UserCircle, Sparkles, Smile, CalendarX, type LucideIcon } from 'lucide-react';
import type { ChurchProgram, GroupType } from '@/types';

const ICON_MAP: Record<string, LucideIcon> = {
    'heroicon-o-user':        User,
    'heroicon-o-user-circle': UserCircle,
    'heroicon-o-sparkles':    Sparkles,
    'heroicon-o-face-smile':  Smile,
};

function GroupIcon({ icon }: { icon?: string | null }) {
    if (!icon) return null;
    const Icon = ICON_MAP[icon];
    return Icon ? <Icon className="w-4 h-4 mr-1 shrink-0" /> : null;
}

const DAYS: Record<string, string> = {
    monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
    thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo',
    '1': 'Segunda', '2': 'Terça', '3': 'Quarta', '4': 'Quinta', '5': 'Sexta', '6': 'Sábado', '0': 'Domingo',
};

const FREQ: Record<string, string> = {
    weekly: 'Semanal', biweekly: 'Quinzenal', monthly: 'Mensal',
    quarterly: 'Trimestral', annual: 'Anual', occasional: 'Ocasional',
};

function fmtDate(iso: string) {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

type SuspensionState = 'active' | 'upcoming' | null;

function suspensionState(from: string | null, until: string | null): SuspensionState {
    if (!from) return null;
    const today = new Date().toISOString().slice(0, 10);
    if (today >= from && (!until || today <= until)) return 'active';
    if (today < from) return 'upcoming';
    return null;
}

interface Props {
    programs: ChurchProgram[];
}

export default function ProgramsByType({ programs }: Props) {
    if (programs.length === 0) return null;

    const grouped = programs.reduce<Map<number, { type: GroupType; programs: ChurchProgram[] }>>(
        (map, prog) => {
            const gt = prog.group_type;
            if (!map.has(gt.id)) {
                map.set(gt.id, { type: gt, programs: [] });
            }
            map.get(gt.id)!.programs.push(prog);
            return map;
        },
        new Map(),
    );

    const groups = [...grouped.values()].sort((a, b) => a.type.order - b.type.order);
    const defaultTab = groups[0]?.type.slug ?? '';

    return (
        <Tabs defaultValue={defaultTab}>
            <TabsList className="flex-wrap h-auto gap-1 bg-brand-pale p-1">
                {groups.map(({ type }) => (
                    <TabsTrigger
                        key={type.slug}
                        value={type.slug}
                        className="data-[state=active]:bg-brand data-[state=active]:text-white"
                    >
                        <GroupIcon icon={type.icon} />
                        {type.name}
                        <span className="ml-1.5 text-xs opacity-70">
                            ({grouped.get(type.id)?.programs.length ?? 0})
                        </span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {groups.map(({ type, programs: progs }) => (
                <TabsContent key={type.slug} value={type.slug} className="mt-4 space-y-3">
                    {progs.map(prog => (
                        <div
                            key={prog.id}
                            className="bg-cream rounded-lg border border-border p-4 flex flex-wrap gap-4 items-start"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-ink">{prog.name ?? type.name}</p>
                                {prog.description && (
                                    <p className="text-sm text-ink-muted mt-1">{prog.description}</p>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-ink-muted shrink-0">
                                {prog.day_of_week && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {DAYS[prog.day_of_week] ?? prog.day_of_week}
                                        {prog.start_time && ` ${prog.start_time.slice(0, 5)}`}
                                        {prog.end_time && `–${prog.end_time.slice(0, 5)}`}
                                    </span>
                                )}
                                {prog.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {prog.location}
                                    </span>
                                )}
                                {prog.frequency && (
                                    <Badge variant="outline" className="text-xs border-brand/30 text-brand-text">
                                        {FREQ[prog.frequency] ?? prog.frequency}
                                    </Badge>
                                )}
                                {(() => {
                                    const state = suspensionState(prog.cancelled_from, prog.cancelled_until);
                                    if (!state) return null;
                                    const range = [
                                        prog.cancelled_from ? fmtDate(prog.cancelled_from) : null,
                                        prog.cancelled_until ? fmtDate(prog.cancelled_until) : null,
                                    ].filter(Boolean).join('–');
                                    if (state === 'active') return (
                                        <Badge className="text-xs bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                                            <CalendarX className="w-3 h-3" />
                                            Suspenso{range ? `: ${range}` : ''}
                                        </Badge>
                                    );
                                    return (
                                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 flex items-center gap-1">
                                            <CalendarX className="w-3 h-3" />
                                            Pausa prevista: {range}
                                        </Badge>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </TabsContent>
            ))}
        </Tabs>
    );
}
