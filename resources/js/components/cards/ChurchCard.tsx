import { Link } from '@inertiajs/react';
import { MapPin, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Church } from '@/types';

const TYPE_LABELS: Record<string, string> = {
    church:       'Igreja',
    congregation: 'Congregação',
};

interface Props {
    church: Church;
    href: string;
}

export default function ChurchCard({ church, href }: Props) {
    const firstService = church.service_times?.[0];

    return (
        <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <Badge variant="outline" className="text-xs border-brand/40 text-brand-text mb-1.5">
                        {TYPE_LABELS[church.type] ?? church.type}
                    </Badge>
                    <h3 className="font-semibold text-ink leading-snug">{church.name}</h3>
                </div>
            </div>

            <div className="space-y-1.5 text-sm text-ink-muted">
                {church.pastor_name && (
                    <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{church.pastor_name}</span>
                    </div>
                )}
                {church.address && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{church.address}</span>
                    </div>
                )}
                {firstService && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{firstService.label} — {firstService.time}</span>
                    </div>
                )}
            </div>

            <Link href={href} className="mt-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-brand text-brand-text hover:bg-brand hover:text-white"
                >
                    Ver Igreja
                </Button>
            </Link>
        </div>
    );
}
